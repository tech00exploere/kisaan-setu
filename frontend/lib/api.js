// Standardized fetching utility using your NEXT_PUBLIC_API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
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