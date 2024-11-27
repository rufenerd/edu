import React, { useState, useEffect } from 'react';
import SettingsForm from './SettingsForm';
import SyllabusForm from "./SyllabusForm";
import Syllabus from './Syllabus';
import { getAPIKey, getName, getOrgKey, getProjectKey, getSyllabus, saveSyllabus } from '../utils/localStorage';

const Layout = () => {
    const [activeView, setActiveView] = useState('settings');
    const [syllabus, setSyllabus] = useState(getSyllabus());
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const name = getName();
        const apiKey = getAPIKey();
        if (name && apiKey) {
            setActiveView(syllabus ? 'syllabus' : 'syllabusForm');
        }
    }, [syllabus]);

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

    const renderView = () => {
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
                return <Syllabus syllabus={syllabus} />;
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
