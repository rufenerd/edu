// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import SettingsForm from './SettingsForm';  // Assuming SettingsForm is a shared component
import { getAPIKey, getName } from '../utils/localStorage';

const HomePage = () => {
    const [isSettingsSet, setIsSettingsSet] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    return (
        <div className="homepage">
            {isSettingsSet ? (
                <div>
                    <h1>Welcome</h1>
                    <div className="gear-icon" onClick={handleGearClick}>
                        &#9881; {/* Unicode character for a simple gear icon */}
                    </div>
                    <div className={`modal ${isModalOpen ? 'open' : ''}`}>
                        <div className="modal-content">
                            <SettingsForm onSave={() => setIsModalOpen(false)} />
                        </div>
                    </div>
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

export default HomePage;
