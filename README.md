# Fantasy Football App

# Developer: JohnStanley 

A React Native mobile application for managing fantasy football teams, tracking player statistics, and recording match results.

## Features

- Player Management
  - Add, edit, and delete players
  - Track player statistics (goals, assists, clean sheets, etc.)
  - Automatic points calculation based on position and performance
  - Player images and team affiliations

- Team Management
  - Create and manage your fantasy team
  - Support for different formations (4-4-2, 4-3-3, 3-5-2, 5-3-2)
  - Position-based team selection
  - Maximum 11 players per team

- Match Results
  - Record and track match results
  - View historical match data

- Settings
  - Customize app preferences
  - Reset data functionality

## Technical Architecture

### Frontend
- Built with React Native and Expo
- Uses React Navigation for screen management
- Material Design components via React Native Paper
- Bottom tab navigation for main sections
- Stack navigation for player-related screens

### Data Management

#### Data Structures

1. Player Model
```javascript
{
  id: string,
  name: string,
  position: 'GK' | 'DEF' | 'MID' | 'FWD',
  team: string,
  imageUrl: string,
  value: number,
  stats: {
    goals: number,
    assists: number,
    cleanSheets: number,
    saves: number,
    minutesPlayed: number,
    yellowCards: number,
    redCards: number,
    totalPoints: number
  },
  createdAt: Date,
  updatedAt: Date
}
```

2. Match Results
```javascript
{
  id: string,
  // Match details and results
}
```

#### Points Calculation

Points are calculated automatically based on player position and performance:

- Minutes Played: 2 points per 90 minutes
- Goals:
  - GK/DEF: 6 points
  - MID: 5 points
  - FWD: 4 points
- Assists: 3 points
- Clean Sheets:
  - GK/DEF: 4 points
  - MID: 1 point
- Saves (GK only): 1 point per 3 saves
- Cards:
  - Yellow: -1 point
  - Red: -3 points

### Data Persistence

- Uses AsyncStorage for local data persistence
- Data is automatically saved when changes occur
- Initial dataset includes 30 sample players
- Data can be reset to initial state

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
```bash
npm run android
# or
npm run ios
```

## Dependencies

- @expo/vector-icons: ^14.0.2
- @react-native-async-storage/async-storage: ^2.1.2
- @react-navigation/bottom-tabs: ^7.3.10
- @react-navigation/native: ^7.1.6
- @react-navigation/native-stack: ^7.3.10
- expo: ~52.0.46
- react-native-paper: ^4.9.2
- react-native-safe-area-context: ^4.12.0
- react-native-screens: ~4.4.0

