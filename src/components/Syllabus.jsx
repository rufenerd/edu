import React from 'react';

const Syllabus = ({ syllabus }) => {
    return (
        <div className="syllabus-container">
            <h1>{syllabus.courseTitle} Syllabus</h1>
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
                                    <li key={lessonIndex}>
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
