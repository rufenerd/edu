import React, { useState } from "react";
import OpenAI from 'openai'


const LearningPrompt = ({ apiKey, orgKey, projectKey }) => {
    const [topic, setTopic] = useState("");
    const [knowledge, setKnowledge] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const openai = new OpenAI({
        apiKey: apiKey,
        organization: orgKey,
        project: projectKey,
        dangerouslyAllowBrowser: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!topic.trim() || !apiKey) {
            alert("Please enter a topic and ensure your API key is set.");
            return;
        }

        const prompt = `Help me learn ${topic}. I already know ${knowledge || "nothing about it"}. Responde in JSON with a single key named 'lesson'`;

        try {
            setLoading(true);
            setResponse("");

            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o-mini",
                response_format: {
                    "type": "json_object"
                }
            });
            const result = completion.choices[0].message.content
            setResponse(result);
        } catch (err) {
            setResponse(`Error: ${err.message}`);
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
                    {loading ? "Asking GPT..." : "Submit"}
                </button>
            </form>
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
