import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/styles';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.disabled,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
          headerTitle: '레쥬미 - 말하는 이력서',
        }}
      />
      <Tabs.Screen
        name="my-resumes"
        options={{
          title: '내 이력서',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📄</Text>,
          headerTitle: '내 이력서',
        }}
      />
    </Tabs>
  );
}
