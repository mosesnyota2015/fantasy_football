import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { usePlayerContext } from '../context/PlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const POSITIONS = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];

// Helper to get color based on position
const getPositionColor = (position) => {
  switch (position) {
    case 'GK': return '#f1c40f'; // Yellow
    case 'DEF': return '#2ecc71'; // Green
    case 'MID': return '#3498db'; // Blue
    case 'FWD': return '#e74c3c'; // Red
    default: return '#95a5a6'; // Gray
  }
};

const PlayerListScreen = ({ navigation }) => {
  const { 
    players, 
    addToTeam, 
    removeFromTeam, 
    selectedTeam,
    getSelectedTeamPlayers 
  } = usePlayerContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('ALL');

  // Use selectedTeam directly for calculations
  const selectedPlayers = useMemo(() => selectedTeam.map(id => players.find(p => p.id === id)).filter(Boolean), [selectedTeam, players]);
  const hasGoalkeeper = useMemo(() => 
    selectedPlayers.some(p => p.position === 'GK'), 
    [selectedPlayers]
  );
  const teamIsFull = selectedPlayers.length >= 11;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus-circle-outline"
          color="#fff"
          size={28}
          onPress={() => navigation.navigate('AddPlayer')}
          style={{ marginRight: 10 }}
        />
      ),
    });
  }, [navigation]);

  const filteredPlayers = useMemo(() => {
    // Filter the raw players list from context
    return players.filter(player => {
      const nameMatch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const teamMatch = player.team.toLowerCase().includes(searchQuery.toLowerCase());
      const positionMatch = selectedPosition === 'ALL' || player.position === selectedPosition;
      return (nameMatch || teamMatch) && positionMatch;
    });
  }, [players, searchQuery, selectedPosition]); // Dependency on raw players list

  const handlePlayerToggle = (player) => {
    const isSelected = selectedTeam.includes(player.id);
    if (isSelected) {
      removeFromTeam(player.id);
    } else {
      // Check if we can add this player
      if (teamIsFull) {
        Alert.alert('Team Full', 'You cannot add more than 11 players to your team.');
        return;
      }
      if (player.position === 'GK' && hasGoalkeeper) {
        Alert.alert('Position Limit', 'You can only have one Goalkeeper in your team.');
        return;
      }
      addToTeam(player.id);
    }
  };

  const renderPlayerCard = ({ item }) => {
    const isSelected = selectedTeam.includes(item.id); // Check against selectedTeam directly
    
    // Determine if adding this player is allowed using component-level variables
    const cannotAddGoalkeeper = item.position === 'GK' && hasGoalkeeper;
    const canAddPlayer = !isSelected && !teamIsFull && !cannotAddGoalkeeper;

    // Updated onPress handler for clarity
    const handleAddRemovePlayer = () => {
      if (isSelected) {
        removeFromTeam(item.id);
      } else { // Attempting to add
        if (teamIsFull) {
          Alert.alert("Team Full", "You can only select up to 11 players.");
        } else if (cannotAddGoalkeeper) { 
          Alert.alert("Goalkeeper Limit", "You can only select one Goalkeeper.");
        } else {
          addToTeam(item.id); // Add allowed player
        }
      }
    };
    
    // Ensure stats exist before accessing them
    const stats = item.stats || {}; 

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.positionTag, { backgroundColor: getPositionColor(item.position) }]}>
            <Text style={styles.positionTagText}>{item.position}</Text>
          </View>
          <View style={styles.teamValueContainer}>
            <Text style={styles.teamName}>{item.team}</Text>
            <Text style={styles.playerValue}>£{item.value?.toFixed(1) || '0.0'}m</Text> 
          </View>
        </View>
        <Card.Content style={styles.cardContent}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.playerImage}
              resizeMode="contain"
              onError={(e) => console.log(`Failed to load image: ${item.imageUrl}`, e.nativeEvent.error)}
            />
          ) : (
            <View style={[styles.playerImage, styles.placeholderContainer]}>
              <MaterialCommunityIcons name="account" size={35} color="#bdc3c7" />
            </View>
          )}
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.name || 'Unknown Player'}</Text>
            <View style={styles.statsRow}>
              <StatItem label="PTS" value={item.points || 0} />
              <StatItem label="G" value={stats.goals || 0} />
              <StatItem label="A" value={stats.assists || 0} />
              <StatItem label="S" value={(item.position === 'GK' ? stats.saves : 0) || 0} />
              <StatItem label="CS" value={stats.cleanSheets || 0} />
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddRemovePlayer}
            disabled={!isSelected && !canAddPlayer} // Simplified disable logic
          >
            <MaterialCommunityIcons
              name={isSelected ? "minus-circle-outline" : "plus-circle-outline"}
              size={28}
              color={isSelected ? "#e74c3c" : (!canAddPlayer ? "#bdc3c7" : "#3498db")} // Grey out if cannot add
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  const StatItem = ({ label, value }) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search players by name or team..."
            placeholderTextColor="#888"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {POSITIONS.map(position => (
              <Chip
                key={position}
                mode="flat"
                selected={selectedPosition === position}
                onPress={() => setSelectedPosition(position)}
                style={[
                  styles.chip,
                  selectedPosition === position ? styles.chipSelected : styles.chipUnselected
                ]}
                textStyle={[
                  styles.chipText,
                  selectedPosition === position ? styles.chipTextSelected : styles.chipTextUnselected
                ]}
              >
                {position}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredPlayers} // Use the filtered list based on raw players
          renderItem={renderPlayerCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {players.length === 0 ? 'Loading players...' : 'No players match your criteria.'}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light background for the whole screen
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowRadius: 2,
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterScroll: {
    paddingVertical: 5, // Add some vertical padding for the scroll area
  },
  chip: {
    marginRight: 8,
    height: 36, // Adjust height
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#1a73e8', // Primary color for selected
  },
  chipUnselected: {
    backgroundColor: '#e0e0e0', // Lighter grey for unselected
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  chipTextSelected: {
    color: 'white',
  },
  chipTextUnselected: {
    color: '#555',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowRadius: 4,
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    marginBottom: 5,
  },
  positionTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  positionTagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  teamValueContainer: {
    alignItems: 'flex-end',
  },
  teamName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  playerValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden', // Ensures background applies correctly with borderRadius
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 0, // Reduced top padding as header handles spacing
  },
  playerImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4, // Add some space above stats
  },
  statItem: {
    alignItems: 'center',
    minWidth: 30, // Ensure some minimum width for alignment
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    marginLeft: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Push down from filters
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  placeholderContainer: {
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlayerListScreen; 