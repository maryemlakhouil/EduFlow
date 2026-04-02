export const API_URL = "http://127.0.0.1:8000/api";

export async function apiRequest(endpoint, method="GET", data=null) {
    const token = localStorage.getItem("token");
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = payload.message || "Une erreur est survenue.";
        throw new Error(message);
    }

    return payload;
}
