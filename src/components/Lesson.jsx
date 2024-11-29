import React, { useState } from 'react';
import { fetchGPTResponse } from '../utils/gpt'; // Ensure this method is implemented in your utils
import { getPriorKnowledge, saveActiveLesson } from '../utils/localStorage';
import Spinner from '../components/Spinner'
import MarkdownRender from '../components/MarkdownRender';

const Lesson = ({ syllabus, lessonDescription, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [lessonContent, setLessonContent] = useState('');
    const [error, setError] = useState('');

    const fetchLesson = async (lessonDescription) => {
        if (!lessonDescription) {
            setError('No lesson provided.');
            return;
        }

        const prompt = `You are an expert educator known for writing clear and illuminating material.
        
        Consider this course syllabus:
        ${buildSyllabusString(syllabus)}
        
        Now, assume I understand everything that comes before "${lessonDescription}" in the syllabus above
        and also that I have this background: ${getPriorKnowledge()}.
        
        Teach me "${lessonDescription}".
        Phrase your response as if it were straight out of a high-quality textbook.
        - Only use Markdown, do not use Tex
        - Do not include any questions or practice problems
`;

        try {
            setLoading(true);
            setError('');
            const response = await fetchGPTResponse(`Teach me: ${prompt}`, false);
            setLessonContent(response);
        } catch (err) {
            setError(`Failed to fetch lesson: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the lesson when the component mounts
    React.useEffect(() => {
        fetchLesson(lessonDescription);
    }, [lessonDescription]);

    const onReturnToSyllabus = () => {
        saveActiveLesson()
        onClose()
    }

    return (
        <div className="lesson-container">
            <button onClick={onReturnToSyllabus} className="return-button">
                Return to Syllabus
            </button>

            {error && <p className="error">{error}</p>}
            {!error && (
                <div className="lesson-content">
                    {loading && <div className="lesson-loading"><Spinner />Creating lesson...</div>}
                    {!loading && lessonContent && <MarkdownRender source={lessonContent} />}
                </div>
            )}
            {!loading && <button onClick={onReturnToSyllabus} className="return-button">
                Return to Syllabus
            </button>}
        </div>
    );
};

const buildSyllabusString = (data) => {
    return data.courseTitle + " " + data.units
        .map((unit, unitIndex) => {
            const unitHeader = `${unitIndex + 1}. ${unit.unitName}`;
            const sections = unit.sections
                .map(
                    (section, sectionIndex) =>
                        `   ${String.fromCharCode(97 + sectionIndex)}. ${section.sectionName
                        }\n${section.lessons
                            .map((lesson) => `      * ${lesson}`)
                            .join("\n")}`
                )
                .join("\n");
            return `${unitHeader}\n${sections}`;
        })
        .join("\n\n");
};

export default Lesson;
