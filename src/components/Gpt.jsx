import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import { getAPIKey, getOrgKey, getProjectKey } from "../utils/localStorage";

const Gpt = ({ prompt, onResponse, model = "gpt-4o-mini" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [keys, setKeys] = useState({ apiKey: "", orgKey: "", projectKey: "" });

    useEffect(() => {
        // Load keys from local storage
        setKeys({
            apiKey: getAPIKey() || "",
            orgKey: getOrgKey() || "",
            projectKey: getProjectKey() || "",
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { apiKey, orgKey, projectKey } = keys;

        if (!apiKey || !orgKey || !projectKey) {
            setError("Please ensure all OpenAI keys are set in settings.");
            return;
        }

        try {
            const openai = new OpenAI({
                apiKey: apiKey,
                organization: orgKey,
                project: projectKey,
                dangerouslyAllowBrowser: true,
            });

            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: model,
            });
            const response = completion.choices[0].message.content;
            onResponse(response);
        } catch (err) {
            setError(err.message || "An error occurred.");
            onResponse(null, err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
            </button>
            {error && <p className="error">Error: {error}</p>}
        </form>
    );
};

export default Gpt;
