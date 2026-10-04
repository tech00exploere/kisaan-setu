// Standardized fetching utility using your NEXT_PUBLIC_API_URL
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://kisaan-setu-4exf.onrender.com/api";
const API_URL = rawApiUrl.endsWith("/api")
    ? rawApiUrl
    : `${rawApiUrl.replace(/\/+$/, "")}/api`;

export async function apiRequest(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_URL}${cleanEndpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'API Request failed');
    }

    return response.json();
}

// Example Usage:
// const users = await apiRequest('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });