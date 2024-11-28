import OpenAI from "openai";
import { getAPIKey, getOrgKey, getProjectKey } from "./localStorage";

/**
 * Send a prompt to OpenAI and return the response.
 * 
 * @param {string} prompt - The prompt to send to GPT.
 * @param {string} model - The model to use (default: "gpt-4o-mini").
 * @returns {Promise<string>} - The GPT response.
 */
export async function fetchGPTResponse(prompt, jsonMode = true, model = "gpt-4o-mini") {
    const apiKey = getAPIKey();
    const orgKey = getOrgKey();
    const projectKey = getProjectKey();

    if (!apiKey || !orgKey || !projectKey) {
        throw new Error("OpenAI keys are not properly configured in local storage.");
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        organization: orgKey,
        project: projectKey,
        dangerouslyAllowBrowser: true,
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: model,
            response_format: {
                "type": jsonMode ? "json_object" : "text"
            }
        });
        return completion.choices[0].message.content;
    } catch (err) {
        throw new Error(err.message || "An error occurred while communicating with OpenAI.");
    }
}
