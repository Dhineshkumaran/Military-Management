export const getAssignments = async (auth) => {
    try {
        const response = await fetch('http://localhost:3000/assignments/history', {
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
        const response = await fetch('http://localhost:3000/assignments', {
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
