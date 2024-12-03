import React, { useState, useRef, useEffect } from 'react';
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
    const [selectedText, setSelectedText] = useState(null);
    const [expansion, setExpansion] = useState(null);
    const [expansionLoading, setExpansionLoading] = useState(false);

    useEffect(() => {
        let timeout;

        const handleSelectionChange = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const selection = window.getSelection();
                setSelectedText(selection.toString());
            }, 500);
        };

        document.addEventListener('selectionchange', handleSelectionChange);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);


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

        return fetchGPTResponse(`Teach me: ${prompt}`, false);
    }

    const loadLesson = async (lessonDescription) => {
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

            const response = await fetchLesson(lessonDescription)
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

    const onExpand = async () => {
        setExpansionLoading(true)
        const expansionResponse = await fetchLesson(selectedText)
        setExpansion(expansionResponse)
        setExpansionLoading(false)
    }

    const onExpansionClose = () => {
        setExpansion(null)
        setExpansionLoading(false)
    }

    const nextLessonDescription = (syllabus, currentLesson) => {
        for (let unit of syllabus.units) {
            for (let section of unit.sections) {
                for (let i = 0; i < section.lessons.length; i++) {
                    if (section.lessons[i] === currentLesson) {
                        // Check if there is a next lesson in the current section
                        if (i + 1 < section.lessons.length) {
                            return section.lessons[i + 1];
                        }
                        // If not, check for the next section in the same unit
                        let nextSectionIndex = unit.sections.indexOf(section) + 1;
                        if (nextSectionIndex < unit.sections.length) {
                            return unit.sections[nextSectionIndex].lessons[0];
                        }
                        // If not, check for the next unit
                        let nextUnitIndex = syllabus.units.indexOf(unit) + 1;
                        if (nextUnitIndex < syllabus.units.length) {
                            return syllabus.units[nextUnitIndex].sections[0].lessons[0];
                        }
                        // If no next lesson is found, return null
                        return null;
                    }
                }
            }
        }
        return null; // If the current lesson isn't found
    }

    // Fetch the lesson when the component mounts
    React.useEffect(() => {
        if (!lessonDescription || fetchedDescriptions.current.has(lessonDescription)) return;
        fetchedDescriptions.current.add(lessonDescription);

        loadLesson(lessonDescription);
    }, [lessonDescription]);

    const onReturnToSyllabus = () => {
        saveActiveLesson()
        onClose()
    }

    const nextLesson = nextLessonDescription(syllabus, lessonDescription)

    const onNextLessonClick = () => {
        loadLesson(nextLesson)
    }

    return (
        <div className="lesson-container">
            <div className="back-button" onClick={onReturnToSyllabus}>
                ⇦
            </div>
            {selectedText && <div className={`expand-button${selectedText ? ' fade-in' : ''}`} onClick={onExpand}>
                ⛶
            </div>}
            {error && <p className="error">{error}</p>}
            {
                !error && (
                    <div className="lesson-content">
                        {loading && <div className="lesson-loading"><Spinner />Creating lesson...</div>}
                        {!loading && lessonContent && <MarkdownRender source={lessonContent} />}
                        {!loading && lessonContent && nextLesson && <button onClick={onNextLessonClick}>Next: {nextLesson} →</button>}
                    </div>
                )
            }
            {(expansionLoading || expansion) && (
                <div className="expansion-lesson-container">
                    <div className="close-expand-button-container">
                        <div className="close-expand-button" onClick={onExpansionClose}>
                            ✕
                        </div>
                    </div>
                    {expansionLoading && <div className="lesson-loading"><Spinner />Expanding...</div>}
                    {!expansionLoading && expansion && <div className="expansion-content"><MarkdownRender source={expansion} /></div>}
                </div>
            )}
        </div >
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
