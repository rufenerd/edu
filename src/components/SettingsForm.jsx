import React, { useState, useEffect } from "react";
import {
    saveAPIKey,
    getAPIKey,
    saveName,
    getName,
    saveOrgKey,
    getOrgKey,
    saveProjectKey,
    getProjectKey
} from "../utils/localStorage";

const SettingsForm = (props) => {
    const [name, setName] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [orgKey, setOrgKey] = useState("");
    const [projectKey, setProjectKey] = useState("");

    useEffect(() => {
        setName(getName() || "");
        setApiKey(getAPIKey() || "");
        setOrgKey(getOrgKey() || "");
        setProjectKey(getProjectKey() || "");
    }, []);

    const handleSave = () => {
        saveName(name);
        saveAPIKey(apiKey);
        saveOrgKey(orgKey);
        saveProjectKey(projectKey);
        props.onSave && props.onSave()
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-inputs">
                <label>Student name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Update your name"
                />
                <label>OpenAI API Key</label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Update your API key"
                />
                <label>OpenAI Organization Key</label>
                <input
                    type="password"
                    value={orgKey}
                    onChange={(e) => setOrgKey(e.target.value)}
                    placeholder="Update your Organization key"
                />
                <label>OpenAI Project Key</label>
                <input
                    type="password"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value)}
                    placeholder="Update your Project key"
                />
            </div>
            <button onClick={handleSave}>Ok</button>
        </div>
    );
};

export default SettingsForm;
