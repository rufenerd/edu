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

const Settings = () => {
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
        alert("Settings updated!");
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
            <label>OpenAI Organization Key:</label>
            <input
                type="password"
                value={orgKey}
                onChange={(e) => setOrgKey(e.target.value)}
                placeholder="Update your Organization key"
            />
            <label>OpenAI Project Key:</label>
            <input
                type="password"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
                placeholder="Update your Project key"
            />
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
};

export default Settings;
