export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/path/login",
        GET_PROFILE: "/api/path/profile",
    },

    

    AI:{
        GENERATE_QUESTIONS: "/api/ai/generate-questions",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation",
    },

    SESSION:{
        CREATE: "/api/session/create",
        GET_ALL: "/api/session/my-sessions",
        GET_ONE: (id)=> `/api/session/${id}`,
        DELETE: (id) => `/api/session/${id}`,
    },
    
    QUESTION:{
        ADD_TO_SESSION: "/api/questions/add",
        PIN: (id) => `/api/questions/${id}/pin`,
        UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
    },
};
