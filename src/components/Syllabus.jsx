import React from 'react';
import { saveActiveLesson } from '../utils/localStorage';

const Syllabus = ({ syllabus, onLessonSelect, onBackClick }) => {

    const onLessonClick = (lesson) => {
        saveActiveLesson(lesson)
        onLessonSelect(lesson)
    }
    return (
        <div className="syllabus-container">
            <div className="back-button" onClick={onBackClick}>
                ⇦
            </div>
            <h1>{syllabus.courseTitle}</h1>
            {syllabus.units.map((unit, unitIndex) => (
                <div key={unit.unitName} className="unit">
                    <h2>
                        Unit {unitIndex + 1}: {unit.unitName}
                    </h2>
                    {unit.sections.map((section, sectionIndex) => (
                        <div key={section.sectionName} className="section">
                            <h3>
                                Section {unitIndex + 1}.{sectionIndex + 1}: {section.sectionName}
                            </h3>
                            <ul>
                                {section.lessons.map((lesson, lessonIndex) => (
                                    <li className="lesson-selector" key={lessonIndex} onClick={() => onLessonClick(lesson)}>
                                        {lesson}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Syllabus;
