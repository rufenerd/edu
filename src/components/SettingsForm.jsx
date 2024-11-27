// src/components/SettingsForm.jsx
import React, { useState, useEffect } from 'react';
import { saveAPIKey, getAPIKey, saveName, getName } from '../utils/localStorage';

const SettingsForm = (props) => {
    const [name, setName] = useState('');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        // Load saved values on mount
        setName(getName() || '');
        setApiKey(getAPIKey() || '');
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        saveName(name);
        saveAPIKey(apiKey);
        props.onSave && props.onSave()
    };

    return (
        <div className="container">
            <form onSubmit={handleSave}>
                <label htmlFor="name">What should I call you?</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
                <label htmlFor="apiKey">OpenAI API Key</label>
                <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    required
                />
                <button type="submit">Save Settings</button>
            </form>
        </div>
    );
};

export default SettingsForm;
