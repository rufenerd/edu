import React, { useState } from "react";
import { fetchGPTResponse } from "../utils/gpt";

const SyllabusForm = ({ onSyllabusCreate }) => {
    const [topic, setTopic] = useState("");
    const [knowledge, setKnowledge] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const prompt = `I want to learn about: ${topic}. I already know: ${knowledge}.

Design a course syllabus for me with units and sections where each section would take about an hour.
Each section be divided into 2-3 lessons.

Respond with a JSON object with two keys, "units" and "courseTitle".
"units" is a list of objects with keys "unitName" and "sections".
Each section should also be a JSON object with keys "sectionName" and "lessons".
Each lesson should be a string containing a description of the content of the lesson.

Do not include unit or sections numbers, just name them based on the content that would be covered.`;

        try {
            const result = await fetchGPTResponse(prompt);
            onSyllabusCreate(JSON.parse(result));
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
                    {loading ? "Creating personalized course..." : "Generate course"}
                </button>
            </form>
            {error && <p className="error">Error: {error}</p>}
        </div>
    );
};

export default SyllabusForm;
