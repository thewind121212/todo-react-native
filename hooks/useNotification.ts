import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { checkAndRequestNotificationPermission } from "./useRequestNotification";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});




const useLocalNotification = () => {
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );


    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

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
        checkAndRequestNotificationPermission().then(token => console.log(token));

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    const handleScheduleNotification = async () => {
        console.log("hit")
        const notificationId = await schedulePushNotification({
            title: "Reminder",
            body: "This is your scheduled notification",
            date: new Date(Date.now() + 15 * 1000), // Schedule to trigger in 15s
        });
        console.log("Notification scheduled with ID:", notificationId);
    };

    return { handleScheduleNotification };
};

export default useLocalNotification;