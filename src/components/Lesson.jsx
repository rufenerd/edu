import React, { useState, useRef } from 'react';
import { fetchGPTResponse } from '../utils/gpt'; // Ensure this method is implemented in your utils
import { getPriorKnowledge, saveActiveLesson, saveLesson, getLesson, addUsedImageUrls, getUsedImageUrls } from '../utils/localStorage';
import Spinner from '../components/Spinner'
import MarkdownRender from '../components/MarkdownRender';
import { fetchWikipediaImages } from '../utils/images'

const Lesson = ({ syllabus, lessonDescription, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [lessonContent, setLessonContent] = useState('');
    const [error, setError] = useState('');
    const fetchedDescriptions = useRef(new Set());

    const generateImagesPromptClause = (images) => {
        if (images == null || images.length === 0) {
            return ''
        }
        const imageEntries = Object.entries(images)
            .map(([key, { url, caption }]) => `- ${caption}: ${url}`)
            .join("\n");

        return `
      When relevant, include the following images in your response. Provide the image's URL and its caption for context:
      ${imageEntries}
      Only use the images when they add value to your answer, like what would appear in a textbook for this topic. Avoid including irrelevant images.
      Only use the provided captions.

      When including images, use this example format:
![Cute character](https://example.com/cute-character.jpg)  
_This is a cute character from the game._
        `.trim();
    };

    const extractUrls = (text) => {
        const urlRegex = /https?:\/\/[^\s/$.?#].[^\s)"]*/g;
        return text.match(urlRegex) || [];
    }

    const fetchLesson = async (lessonDescription) => {
        const savedContent = getLesson(lessonDescription)
        if (savedContent != null) {
            setLessonContent(savedContent);
            return;
        }

        if (!lessonDescription) {
            setError('No lesson provided.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const imagePromptResponse = await fetchGPTResponse(`Consider this course syllabus:
            ${buildSyllabusString(syllabus)}
            
            What would the top three wikipedia articles to search for to gain understanding on this topic: ${lessonDescription}?
            Respond with a JSON array of strings under a single key called \`articles\`.`, true);
            const imageSearchQueries = JSON.parse(imagePromptResponse).articles
            let images = []
            for (const imageQuery of Object.values(imageSearchQueries)) {
                images = images.concat(await fetchWikipediaImages(imageQuery))
            }
            const usedImageUrls = getUsedImageUrls()
            const unusedImages = images.filter(image => !usedImageUrls.includes(image.url));

            const prompt = `You are an expert educator known for writing clear and illuminating material.
            
            Consider this course syllabus:
            ${buildSyllabusString(syllabus)}
            
            Now, assume I understand everything that comes before "${lessonDescription}" in the syllabus above
            and also that I have this background: ${getPriorKnowledge()}.
            
            Teach me "${lessonDescription}".
            Phrase your response as if it were straight out of a high-quality textbook.
            - Only use Markdown, do not use Tex or html
            - Do not include any questions or practice problems
    
            ${generateImagesPromptClause(unusedImages)}
    `;

            const response = await fetchGPTResponse(`Teach me: ${prompt}`, false);
            setLessonContent(response);
            saveLesson(lessonDescription, response)

            const usedUrls = extractUrls(response)
            addUsedImageUrls(usedUrls);
            debugger
        } catch (err) {
            setError(`Failed to fetch lesson: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the lesson when the component mounts
    React.useEffect(() => {
        if (!lessonDescription || fetchedDescriptions.current.has(lessonDescription)) return;
        fetchedDescriptions.current.add(lessonDescription);

        fetchLesson(lessonDescription);
    }, [lessonDescription]);

    const onReturnToSyllabus = () => {
        saveActiveLesson()
        onClose()
    }

    return (
        <div className="lesson-container">
            <div className="back-button" onClick={onReturnToSyllabus}>
                ⇦
            </div>
            {error && <p className="error">{error}</p>}
            {!error && (
                <div className="lesson-content">
                    {loading && <div className="lesson-loading"><Spinner />Creating lesson...</div>}
                    {!loading && lessonContent && <MarkdownRender source={lessonContent} />}
                </div>
            )}
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
