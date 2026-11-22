const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

export const API_URL = apiUrl
