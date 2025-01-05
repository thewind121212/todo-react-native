export const getCurrentDay = () => {
    const today = new Date()

    return today.toLocaleDateString("en-Ca").split('T')[0]; // Format: YYYY-MM-DD
};