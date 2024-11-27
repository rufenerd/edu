export const saveAPIKey = (key) => localStorage.setItem('apiKey', key);
export const getAPIKey = () => localStorage.getItem('apiKey');
export const saveName = (name) => localStorage.setItem('userName', name);
export const getName = () => localStorage.getItem('userName');