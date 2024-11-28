import React, { useState, useEffect } from 'react';
import SettingsForm from './SettingsForm';
import SyllabusForm from "./SyllabusForm";
import Lesson from './Lesson';
import Syllabus from './Syllabus';
import { getActiveLesson, getAPIKey, getName, getOrgKey, getProjectKey, getSyllabus, saveSyllabus } from '../utils/localStorage';

const Layout = () => {
    const [activeView, setActiveView] = useState('settings');
    const [syllabus, setSyllabus] = useState(getSyllabus());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeLesson, setActiveLesson] = useState(getActiveLesson());

    useEffect(() => {
        const name = getName();
        const apiKey = getAPIKey();
        if (name && apiKey) {
            if (activeLesson) {
                setActiveView("lesson")
            } else {
                setActiveView(syllabus ? 'syllabus' : 'syllabusForm');
            }
        }
    }, [syllabus, activeLesson]);

    const handleGearClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSyllabusCreate = (newSyllabus) => {
        saveSyllabus(newSyllabus);
        setSyllabus(newSyllabus);
        setActiveView('syllabus');
    };

    const onLessonClose = () => {
        setActiveLesson()
    }

    const renderView = () => {
        console.log("Active view:" + activeView)
        switch (activeView) {
            case 'settings':
                return (
                    <div>
                        <h1>Let's get started</h1>
                        <SettingsForm onSave={() => setActiveView(syllabus ? 'syllabus' : 'syllabusForm')} />
                    </div>
                );
            case 'syllabusForm':
                return (
                    <SyllabusForm
                        apiKey={getAPIKey()}
                        orgKey={getOrgKey()}
                        projectKey={getProjectKey()}
                        onSyllabusCreate={onSyllabusCreate}
                    />
                );
            case 'syllabus':
                return <Syllabus syllabus={syllabus} onLessonSelect={setActiveLesson} />;
            case 'lesson':
                return <Lesson syllabus={syllabus} lessonDescription={getActiveLesson()} onClose={onLessonClose} />
            default:
                return <h1>Page not found</h1>; // Fallback for unknown views
        }
    };

    return (
        <div className="homepage">
            {activeView !== 'settings' && (
                <div className="gear-icon" onClick={handleGearClick}>
                    &#9881; {/* Unicode character for a simple gear icon */}
                </div>
            )}
            {isModalOpen && (
                <div className={`modal ${isModalOpen ? 'open' : ''}`}>
                    <div className="modal-content">
                        <SettingsForm onSave={closeModal} />
                    </div>
                </div>
            )}
            {renderView()}
        </div>
    );
};

export default Layout;
