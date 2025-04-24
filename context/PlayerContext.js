import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Player from '../models/Player';

// Helper function to create player stats
const createStats = (g = 0, a = 0, cs = 0, s = 0, mins = 0, yel = 0, red = 0) => ({ 
  goals: g, 
  assists: a, 
  cleanSheets: cs, 
  saves: s, 
  minutesPlayed: mins, 
  yellowCards: yel, 
  redCards: red 
});

// Expanded sample data with ~30 players and stats
const INITIAL_PLAYERS = [
  // Goalkeepers (GK)
  new Player('1', 'Alisson Becker', 'GK', 'Liverpool', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116535.png', 5.5, createStats(0, 1, 12, 98, 2800, 1, 0)),
  new Player('2', 'Ederson', 'GK', 'Man City', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p177298.png', 5.5, createStats(0, 0, 15, 70, 3000)),
  new Player('3', 'David Raya', 'GK', 'Arsenal', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p108818.png', 5.0, createStats(0, 0, 10, 85, 2500)),

  // Defenders (DEF)
  new Player('4', 'Trent Alexander-Arnold', 'DEF', 'Liverpool', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p169187.png', 7.0, createStats(2, 12, 12, 0, 2700)), // Corrected image ID
  new Player('5', 'Virgil van Dijk', 'DEF', 'Liverpool', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p97032.png', 6.5, createStats(5, 1, 12, 0, 2900)),
  new Player('6', 'Kieran Trippier', 'DEF', 'Newcastle', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p61933.png', 6.8, createStats(1, 10, 10, 0, 2650)),
  new Player('7', 'William Saliba', 'DEF', 'Arsenal', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p226597.png', 5.9, createStats(2, 1, 14, 0, 3100)),
  new Player('8', 'Rúben Dias', 'DEF', 'Man City', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p171314.png', 6.0, createStats(0, 1, 15, 0, 2400)),
  new Player('9', 'Ben Chilwell', 'DEF', 'Chelsea', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p149484.png', 5.7, createStats(2, 2, 5, 0, 1800)),
  new Player('10', 'Pervis Estupiñán', 'DEF', 'Brighton', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p204800.png', 5.2, createStats(1, 5, 7, 0, 2550)),

  // Midfielders (MID)
  new Player('11', 'Mohamed Salah', 'MID', 'Liverpool', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png', 13.0, createStats(19, 12, 11, 0, 2850)), // Often listed as MID in FPL
  new Player('12', 'Kevin De Bruyne', 'MID', 'Man City', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png', 10.5, createStats(7, 18, 12, 0, 2300)), // Corrected image ID
  new Player('13', 'Bukayo Saka', 'MID', 'Arsenal', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png', 9.0, createStats(15, 11, 13, 0, 3000)),
  new Player('14', 'Martin Ødegaard', 'MID', 'Arsenal', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p184029.png', 8.6, createStats(15, 7, 12, 0, 2950)),
  new Player('15', 'Bruno Fernandes', 'MID', 'Man Utd', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png', 8.5, createStats(8, 8, 10, 0, 3150)),
  new Player('16', 'Marcus Rashford', 'MID', 'Man Utd', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p176297.png', 8.8, createStats(17, 5, 9, 0, 2700)), // Often listed as MID in FPL
  new Player('17', 'Phil Foden', 'MID', 'Man City', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p209244.png', 8.0, createStats(11, 5, 10, 0, 2000)),
  new Player('18', 'Kaoru Mitoma', 'MID', 'Brighton', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p464787.png', 6.6, createStats(7, 6, 6, 0, 2350)),
  new Player('19', 'James Maddison', 'MID', 'Tottenham', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116643.png', 7.8, createStats(10, 9, 4, 0, 2500)),
  new Player('20', 'Son Heung-min', 'MID', 'Tottenham', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p85971.png', 9.6, createStats(10, 6, 8, 0, 2800)), // Often listed as MID in FPL

  // Forwards (FWD)
  new Player('21', 'Erling Haaland', 'FWD', 'Man City', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png', 14.0, createStats(36, 8, 13, 0, 2750)),
  new Player('22', 'Harry Kane', 'FWD', 'Tottenham', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p78830.png', 11.5, createStats(30, 3, 9, 0, 3300)), // Still in dataset for example
  new Player('23', 'Gabriel Jesus', 'FWD', 'Arsenal', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p165153.png', 8.0, createStats(11, 6, 10, 0, 2100)),
  new Player('24', 'Ivan Toney', 'FWD', 'Brentford', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p119807.png', 7.5, createStats(20, 4, 11, 0, 3050)),
  new Player('25', 'Ollie Watkins', 'FWD', 'Aston Villa', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p178186.png', 7.9, createStats(15, 6, 9, 0, 3100)),
  new Player('26', 'Alexander Isak', 'FWD', 'Newcastle', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p218031.png', 7.7, createStats(10, 1, 7, 0, 1600)),
  new Player('27', 'Callum Wilson', 'FWD', 'Newcastle', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p66957.png', 7.6, createStats(18, 5, 8, 0, 2000)),
  new Player('28', 'Darwin Núñez', 'FWD', 'Liverpool', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p447296.png', 7.4, createStats(9, 3, 6, 0, 1800)),
  new Player('29', 'Cody Gakpo', 'FWD', 'Liverpool', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p220697.png', 7.2, createStats(7, 2, 5, 0, 1500)),
  new Player('30', 'Evan Ferguson', 'FWD', 'Brighton', 'https://resources.premierleague.com/premierleague/photos/players/250x250/p500756.png', 6.0, createStats(6, 2, 4, 0, 1000)),
];

// Create context
const PlayerContext = createContext();

// Context provider component
export const PlayerProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data when the app starts
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [players, matchResults, selectedTeam]);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('playerData');
      if (savedData) {
        const { players: savedPlayers, matchResults: savedResults, selectedTeam: savedTeam } = JSON.parse(savedData);
        
        // Convert saved player data back to Player instances
        const parsedPlayers = savedPlayers.map(playerData => {
          const player = new Player(
            playerData.id,
            playerData.name,
            playerData.position,
            playerData.team,
            playerData.imageUrl,
            playerData.value,
            playerData.stats
          );
          player.createdAt = new Date(playerData.createdAt);
          player.updatedAt = new Date(playerData.updatedAt);
          return player;
        });
        
        setPlayers(parsedPlayers);
        setMatchResults(savedResults);
        setSelectedTeam(savedTeam);
      } else {
        // If no saved data, use initial data
        setPlayers(INITIAL_PLAYERS);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setPlayers(INITIAL_PLAYERS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      // Convert Player instances to plain objects for storage
      const playersToSave = players.map(player => ({
        id: player.id,
        name: player.name,
        position: player.position,
        team: player.team,
        imageUrl: player.imageUrl,
        value: player.value,
        stats: player.stats,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString()
      }));

      const dataToSave = {
        players: playersToSave,
        matchResults,
        selectedTeam
      };
      await AsyncStorage.setItem('playerData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Add a new player (now expects stats object)
  const addPlayer = (name, position, team, imageUrl, value, stats) => {
    // Ensure stats object includes new fields, even if 0, before passing to Player constructor
    const completeStats = {
      goals: stats.goals || 0,
      assists: stats.assists || 0,
      cleanSheets: stats.cleanSheets || 0,
      saves: stats.saves || 0, // Will need logic in AddPlayerScreen to determine if this is relevant based on position
      minutesPlayed: stats.minutesPlayed || 0,
      yellowCards: stats.yellowCards || 0,
      redCards: stats.redCards || 0,
    };
    const newId = `player_${Date.now()}_${Math.random()}`;
    // Player constructor now correctly receives stats including potential new cards
    const newPlayer = new Player(newId, name, position, team, imageUrl, value, completeStats);
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    return newPlayer;
  };

  // Update an existing player (separate method for stats)
  const updatePlayerInfo = (id, data) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? player.update(data) : player
      )
    );
  };

  // Update player stats
  const updatePlayerStats = (id, newStats) => {
     setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === id ? player.updateStats(newStats) : player
      )
    );
  };

  // Delete a player
  const deletePlayer = (id) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
  };

  // Get a single player by ID
  const getPlayerById = (id) => {
    return players.find(player => player.id === id);
  };

  // Add player ID to selected team
  const addToTeam = (playerId) => {
    setSelectedTeam(prevTeam => {
      if (prevTeam.length < 11 && !prevTeam.includes(playerId)) {
        return [...prevTeam, playerId];
      }
      return prevTeam; // Return unchanged team if limit reached or player already added
    });
     // Optionally: Add feedback like an alert or toast message here
     console.log(`Attempted to add player ${playerId}. Current team: ${selectedTeam}`);
  };

  // Remove player ID from selected team
  const removeFromTeam = (playerId) => {
    setSelectedTeam(prevTeam => prevTeam.filter(id => id !== playerId));
  };

  // Add match result
  const addMatchResult = (result) => {
    setMatchResults(prevResults => [...prevResults, { ...result, id: Date.now().toString() }]);
  };

  // Get match results
  const getMatchResults = () => {
    return matchResults;
  };

  // Get selected team player objects
  const getSelectedTeamPlayers = () => {
    return selectedTeam.map(id => getPlayerById(id)).filter(Boolean); // Filter out undefined if a player was deleted
  };

  const clearTeam = () => {
    setSelectedPlayers([]);
  };

  const resetAllData = async () => {
    try {
      await AsyncStorage.clear();
      setPlayers(INITIAL_PLAYERS);
      setSelectedTeam([]);
      setMatchResults([]);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  // Context value
  const value = {
    players,
    setPlayers,
    matchResults,
    selectedTeam,
    setSelectedTeam,
    selectedTeamIds: selectedTeam,
    addPlayer,
    updatePlayerInfo,
    updatePlayerStats,
    deletePlayer,
    getPlayerById,
    addToTeam,
    removeFromTeam,
    addMatchResult,
    getMatchResults,
    getSelectedTeamPlayers,
    clearTeam: () => setSelectedTeam([]),
    resetAllData: () => {
      setPlayers(INITIAL_PLAYERS);
      setSelectedTeam([]);
      setMatchResults([]);
    }
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook for using the player context
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext; 