// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import SettingsForm from './SettingsForm';
import SyllabusForm from "./SyllabusForm";
import Syllabus from './Syllabus';
import { getAPIKey, getName, getOrgKey, getProjectKey, getSyllabus, saveSyllabus } from '../utils/localStorage';


const Layout = () => {
    const [isSettingsSet, setIsSettingsSet] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [syllabus, setSyllabus] = useState(getSyllabus());

    useEffect(() => {
        const name = getName();
        const apiKey = getAPIKey();
        if (name && apiKey) {
            setIsSettingsSet(true);
        }
    }, []);

    const handleGearClick = () => {
        setIsModalOpen(true);
    };

    const onSyllabusCreate = (syllabus) => {
        saveSyllabus(syllabus)
        setSyllabus(syllabus)
    }

    return (
        <div className="homepage">
            {isSettingsSet ? (
                <div>
                    <div className="gear-icon" onClick={handleGearClick}>
                        &#9881; {/* Unicode character for a simple gear icon */}
                    </div>
                    <div className={`modal ${isModalOpen ? 'open' : ''}`}>
                        <div className="modal-content">
                            <SettingsForm onSave={() => setIsModalOpen(false)} />
                        </div>
                    </div>
                    {(syllabus ?
                        <Syllabus syllabus={syllabus} /> :
                        <SyllabusForm apiKey={getAPIKey()} orgKey={getOrgKey()} projectKey={getProjectKey()} onSyllabusCreate={onSyllabusCreate} />)}
                </div>
            ) : (
                <div>
                    <h1>Let's get started</h1>
                    <SettingsForm onSave={() => setIsSettingsSet(true)} />
                </div>
            )}
        </div>
    );
};

export default Layout;
