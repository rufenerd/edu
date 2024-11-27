// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { saveAPIKey, getAPIKey, saveName, getName } from '../utils/localStorage';

const Settings = () => {
    const [name, setName] = useState('');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        setName(getName() || '');
        setApiKey(getAPIKey() || '');
    }, []);

    const handleSave = () => {
        saveName(name);
        saveAPIKey(apiKey);
        alert('Settings updated!');
    };

    return (
        <div className="container">
            <h2>Settings</h2>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Update your name"
            />
            <label>OpenAI API Key:</label>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Update your API key"
            />
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default Settings;
