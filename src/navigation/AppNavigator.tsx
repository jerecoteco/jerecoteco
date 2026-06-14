import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store';

// Placeholder/Scaffold Screen components since we are setting up the architecture
// We'll write expressively styled screen modules so they present beautifully
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { VoiceLoggingScreen } from '../screens/VoiceLoggingScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Insights: undefined;
  VoiceLog: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#05FF84', // Emerald Resonance
        tabBarInactiveTintColor: '#52576C', // Text low (Mist)
        tabBarStyle: {
          backgroundColor: '#161722', // Card surface
          borderTopColor: '#2D3142',  // Divider line
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{
          tabBarLabel: 'Insights',
        }}
      />
      <Tab.Screen 
        name="VoiceLog" 
        component={VoiceLoggingScreen}
        options={{
          tabBarLabel: 'Voice Logging',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  const { onboardingCompleted } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      ) as any}
    </Stack.Navigator>
  );
};

export default AppNavigator;
