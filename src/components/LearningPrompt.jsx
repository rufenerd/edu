import React, { useState } from "react";
import { fetchGPTResponse } from "../utils/gpt";

const LearningPrompt = () => {
    const [topic, setTopic] = useState("");
    const [knowledge, setKnowledge] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const prompt = `Help me learn ${topic}. I already know ${knowledge || "nothing about it"}.`;

        try {
            const result = await fetchGPTResponse(prompt);
            setResponse(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="learning-container">
            <form className="learning-form" onSubmit={handleSubmit}>
                <h2>What do you want to learn?</h2>
                <label>
                    Topic:
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Quantum Physics"
                        required
                    />
                </label>
                <label>
                    What do you already know?
                    <textarea
                        value={knowledge}
                        onChange={(e) => setKnowledge(e.target.value)}
                        placeholder="e.g., Basic knowledge of Newtonian physics"
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
            {error && <p className="error">Error: {error}</p>}
            {response && (
                <div className="response">
                    <h3>GPT Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default LearningPrompt;
