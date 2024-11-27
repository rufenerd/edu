// src/utils/localStorage.js
export const saveName = (name) => localStorage.setItem("name", name);
export const getName = () => localStorage.getItem("name");

export const saveAPIKey = (key) => localStorage.setItem("apiKey", key);
export const getAPIKey = () => localStorage.getItem("apiKey");

export const saveOrgKey = (key) => localStorage.setItem("orgKey", key);
export const getOrgKey = () => localStorage.getItem("orgKey");

export const saveProjectKey = (key) => localStorage.setItem("projectKey", key);
export const getProjectKey = () => localStorage.getItem("projectKey");
