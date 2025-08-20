const getTransfers = async(filters) => {
    try {
        const response = await fetch('http://localhost:3000/transfers/history');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching transfers");
        return [];
    }
}

const createTransfer = async (transferData) => {
    try {
        const response = await fetch('http://localhost:3000/transfers', {
            method: 'POST',
            body: JSON.stringify(transferData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating transfer");
        return null;
    }
};

export {getTransfers, createTransfer};