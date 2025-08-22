import API_URL from '../config.js';

const getLogs = async(auth) => {
    try {
        const response = await fetch(`${API_URL}/logs`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching logs");
        return [];
    }
}

export { getLogs };