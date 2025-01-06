export const getCurrentDay = () => {
    const today = new Date()

    return today.toLocaleDateString("en-Ca").split('T')[0]; // Format: YYYY-MM-DD
};

export const calcRemainTimePercent = (dueDate: string, createDate: string) => {
    const [year, month, day] = dueDate ? dueDate.split('-').map(Number) : [0, 0, 0];
    const dueDayTimeStamp = new Date(year, month - 1, day).getTime()
    const createDayTimeStamp = new Date(createDate).getTime()
    const today = new Date().getTime()
    return 100 - ((today - createDayTimeStamp) / (dueDayTimeStamp - createDayTimeStamp) * 100)
}

export function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');


    const rv = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(rv)
    return rv
}