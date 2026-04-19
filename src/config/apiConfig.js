const raw = import.meta.env.VITE_API_URL || "/api/v1/";
const BASE_API_URL = raw.endsWith("/") ? raw.slice(0, -1) : raw;

export default BASE_API_URL;
