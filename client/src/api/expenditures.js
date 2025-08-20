export const getExpenditures = async () => {
    try {
        const response = await fetch('http://localhost:3000/expenditures/history');
        if (!response.ok) {
            throw new Error('Error fetching expenditures');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createExpenditure = async (expenditureData) => {
    try {
        const response = await fetch('http://localhost:3000/expenditures', {
            method: 'POST',
            body: JSON.stringify(expenditureData),
        });
        if (!response.ok) {
            throw new Error('Error creating expenditure');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
