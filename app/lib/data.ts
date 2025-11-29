'use server';

export async function fetchAssistantHealth() {
    const res = await fetch('https://portfolio-assistant-csi7.onrender.com/');
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return res.json();
}