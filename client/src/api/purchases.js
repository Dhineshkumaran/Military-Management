const getPurchases = async(filters, auth) =>{
    try {
        // ?base_id=${filters.base_id}&start_date=${filters.start_date}&end_date=${filters.end_date}&asset_type=${filters.asset_type}&search=${filters.search}
        const response = await fetch(`http://localhost:3000/purchases`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching purchases:', error);
        return [];
    }
}

const createPurchase = async (purchaseData, auth) => {
    try {
        const response = await fetch('http://localhost:3000/purchases', {
            method: 'POST',
            body: JSON.stringify(purchaseData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating purchase:', error);
        throw error;
    }
};

export { getPurchases, createPurchase };