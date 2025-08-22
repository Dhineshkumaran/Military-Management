import API_URL from '../config.js';

export const getAssignments = async (auth) => {
    try {
        const response = await fetch(`${API_URL}/assignments/history`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching assignments');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const createAssignment = async (assignment, auth) => {
    try {
        const response = await fetch(`${API_URL}/assignments`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            method: 'POST',
            body: JSON.stringify(assignment)
        });
        if (!response.ok) {
            throw new Error('Error creating assignment');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
