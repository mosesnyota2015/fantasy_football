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
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'PlayersTab') {
                  iconName = focused ? 'account-group' : 'account-group-outline';
                } else if (route.name === 'TeamTab') {
                  iconName = focused ? 'shield-account' : 'shield-account-outline';
                } else if (route.name === 'ResultsTab') {
                  iconName = focused ? 'trophy' : 'trophy-outline';
                } else if (route.name === 'SettingsTab') {
                  iconName = focused ? 'cog' : 'cog-outline';
                }
                // You can return any component that you like here!
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: 'gray',
              headerShown: false, // Hide header for tabs, Stack navigator handles its own header
            })}
          >
            <Tab.Screen 
              name="PlayersTab" 
              component={PlayerStackNavigator} 
              options={{ title: 'Players' }} 
            />
            <Tab.Screen 
              name="TeamTab" 
              component={TeamScreen} 
              options={{ title: 'Team', headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff'}} // Show header for placeholder
            />
            <Tab.Screen 
              name="ResultsTab" 
              component={MatchResultsScreen} 
              options={{ title: 'Results', headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff'}} // Show header
            />
            <Tab.Screen 
              name="SettingsTab" 
              component={SettingsScreen} 
              options={{ title: 'Settings', headerShown: true, headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: '#fff'}} // Show header for placeholder
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
