import { useEffect } from "react";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const useLocalNotification = () => {
    const checkAndRequestNotificationPermission = async () => {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return;
        }
    };

    const schedulePushNotification = async ({
        title,
        body,
        date,
    }: {
        title: string;
        body: string;
        date: Date;
    }) => {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
            },
        });
        return id;
    }

    useEffect(() => {
        checkAndRequestNotificationPermission();
    }, []);

    const handleScheduleNotification = async () => {
        console.log("hit")
        const notificationId = await schedulePushNotification({
            title: "Reminder",
            body: "This is your scheduled notification",
            date: new Date(Date.now() + 15 * 1000), // Schedule to trigger in 1 minute
        });
        console.log("Notification scheduled with ID:", notificationId);
    };

    return { handleScheduleNotification };
};

export default useLocalNotification;