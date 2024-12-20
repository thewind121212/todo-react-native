import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';


export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#1A182C',
                },
                headerTitleStyle:{
                    display: 'none'
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#1A182C',
                    borderTopColor: 'transparent',
                    display: 'flex',
                    borderTopWidth: 0,
                },
                headerShown: true,
                headerRight: () => {
                    return  <FontAwesome6 name="bell" size={24} color="#fff" style={{ marginRight: 20 }}  />
                },
                headerLeft: () => {
                    return  <FontAwesome6 name="bars" size={24} color="#fff" style={{ marginLeft: 20 }} />
                    
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="groupTask"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name="tasklist" size={24} color={color}  />
                    ),
                }}
            />
            <Tabs.Screen
                name="allTasks"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Octicons name="checklist" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    )

}