import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import SplashScreen from './screens/SplashScreen';
import PlayerListScreen from './screens/PlayerListScreen';
import AddPlayerScreen from './screens/AddPlayerScreen';
import MatchResultsScreen from './screens/MatchResultsScreen';
import TeamScreen from './screens/TeamScreen'; // Import placeholder
import SettingsScreen from './screens/SettingsScreen'; // Import placeholder

// Import context provider
import { PlayerProvider } from './context/PlayerContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1a73e8', // Example primary color (adjust as needed)
    accent: '#f1c40f',
  },
};

// Stack Navigator for screens related to Players (including Splash)
function PlayerStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="PlayerList"
        component={PlayerListScreen}
        options={{ 
          title: 'Players',
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen
        name="AddPlayer"
        component={AddPlayerScreen}
        options={{ title: 'Add Player' }}
      />
    </Stack.Navigator>
  );
}

// Main App component with Bottom Tab Navigator
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <PlayerProvider>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0',
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
              },
              tabBarActiveTintColor: '#1a73e8',
              tabBarInactiveTintColor: '#757575',
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="Players"
              component={PlayerStackNavigator}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
                ),
                tabBarLabelStyle: { fontSize: 12 },
              }}
            />
            <Tab.Screen
              name="Team"
              component={TeamScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account-group" size={size} color={color} />
                ),
                tabBarLabelStyle: { fontSize: 12 },
              }}
            />
            <Tab.Screen
              name="Results"
              component={MatchResultsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="chart-line" size={size} color={color} />
                ),
                tabBarLabelStyle: { fontSize: 12 },
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cog" size={size} color={color} />
                ),
                tabBarLabelStyle: { fontSize: 12 },
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </PaperProvider>
  );
}

// Keep styles if needed, otherwise remove
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
});
