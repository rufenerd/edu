// src/utils/localStorage.js
export const saveName = (name) => localStorage.setItem("name", name);
export const getName = () => localStorage.getItem("name");

export const saveAPIKey = (key) => localStorage.setItem("apiKey", key);
export const getAPIKey = () => localStorage.getItem("apiKey");

export const saveOrgKey = (key) => localStorage.setItem("orgKey", key);
export const getOrgKey = () => localStorage.getItem("orgKey");

export const saveProjectKey = (key) => localStorage.setItem("projectKey", key);
export const getProjectKey = () => localStorage.getItem("projectKey");

export const saveSyllabus = (syllabusJson) => localStorage.setItem("syllabus", JSON.stringify(syllabusJson));
export const getSyllabus = () => JSON.parse(localStorage.getItem("syllabus"));

export const savePriorKnowledge = (priorKnowledge) => localStorage.setItem("priorKnowledge", priorKnowledge);
export const getPriorKnowledge = () => localStorage.getItem("priorKnowledge");

export const saveActiveLesson = (activeLesson) => activeLesson ? localStorage.setItem("activeLesson", activeLesson) : localStorage.removeItem("activeLesson");
export const getActiveLesson = () => localStorage.getItem("activeLesson");
