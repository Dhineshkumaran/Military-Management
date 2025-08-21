const getTransfers = async(filters, auth) => {
    try {
        const response = await fetch('http://localhost:3000/transfers/history', {
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
        const response = await fetch('http://localhost:3000/transfers', {
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