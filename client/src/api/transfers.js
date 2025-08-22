import API_URL from '../config.js';

const getTransfers = async(filters, auth) => {
    try {
        const response = await fetch(`${API_URL}/transfers/history`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching transfers");
        return [];
    }
}

const createTransfer = async (transferData, auth) => {
    try {
        const response = await fetch(`${API_URL}/transfers`, {
            method: 'POST',
            body: JSON.stringify(transferData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating transfer");
        return null;
    }
};

export {getTransfers, createTransfer};