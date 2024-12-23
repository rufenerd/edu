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

const LESSON_MAP_KEY = "lessonMap";

const getLessonMap = () => {
    const mapJson = localStorage.getItem(LESSON_MAP_KEY);
    return mapJson ? JSON.parse(mapJson) : {};
};

export const saveLesson = (lessonDescription, lessonContent) => {
    const lessonMap = getLessonMap();
    lessonMap[lessonDescription] = lessonContent;
    localStorage.setItem(LESSON_MAP_KEY, JSON.stringify(lessonMap));
};

export const getLesson = (lessonDescription) => {
    const lessonMap = getLessonMap();
    return lessonMap[lessonDescription] || null;
};

export const clearSyllabus = () => {
    localStorage.removeItem("syllabus")
    localStorage.removeItem("activeLesson")
    localStorage.removeItem("priorKnowledge")
    localStorage.removeItem(USED_IMAGE_URLS_KEY)
    localStorage.removeItem(LESSON_MAP_KEY)
}

const USED_IMAGE_URLS_KEY = "usedImageUrls";

export const getUsedImageUrls = () => {
    const imageUrls = localStorage.getItem(USED_IMAGE_URLS_KEY)
    return imageUrls ? JSON.parse(imageUrls) : []
}

export const addUsedImageUrls = (urls) => {
    const imageUrls = getUsedImageUrls();
    for (const url of urls) {
        imageUrls.push(url)
    }
    localStorage.setItem(USED_IMAGE_URLS_KEY, JSON.stringify(imageUrls));
}