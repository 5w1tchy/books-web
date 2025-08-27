const raw = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_BASE = raw.replace(/\/+$/, '');

async function okText(res) {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.text();
}

async function okJSON(res) {
    if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(`${res.status} ${res.statusText}: ${t}`);
    }
    return res.json();
}

export const api = {
    health: () => fetch(`${API_BASE}/healthz`, { method: 'GET', mode: 'cors' }).then(okText),
    listBooks: () => fetch(`${API_BASE}/books/`, { method: 'GET', mode: 'cors' }).then(okJSON),
};
