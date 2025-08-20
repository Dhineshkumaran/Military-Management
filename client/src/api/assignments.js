export const getAssignments = async () => {
    try {
        const response = await fetch('http://localhost:3000/assignments/history');
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

export const createAssignment = async (assignment) => {
    try {
        const response = await fetch('http://localhost:3000/assignments', {
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
