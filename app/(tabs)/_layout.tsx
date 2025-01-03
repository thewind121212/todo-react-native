import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#6861ED',
                headerStyle: {
                    backgroundColor: '#1A182C',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#1A182C',
                    borderTopColor: 'transparent',
                    display: 'flex',
                    borderTopWidth: 0,
                    paddingTop: 10,
                },
                headerShown: true,
                headerRight: () => {
                    return <FontAwesome6 name="bell" size={24} color="#fff" style={{ marginRight: 20 }} />
                },
                headerLeft: () => {
                    return <FontAwesome6 name="bars" size={24} color="#fff" style={{ marginLeft: 20 }} />

                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "",
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="allHabit"
                options={{
                    headerTitle: 'Habits',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="task-alt" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="allTasks"
                options={{
                    headerTitle: 'Tasks',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name="checklist" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="groupTask"
                options={{
                    headerTitle: 'Group Tasks',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name="inbox-full" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    )

}