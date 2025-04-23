import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Card, Button, TextInput as PaperInput, IconButton, Title, Paragraph, Provider as PaperProvider, Divider } from 'react-native-paper';
import { usePlayerContext } from '../context/PlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Placeholder AddMatchResultModal component - we will build this out next
const AddMatchResultModal = ({ visible, onClose, onSave }) => {
  const { Platform, Alert } = require('react-native');
  const { getSelectedTeamPlayers, getPlayerById } = usePlayerContext();
  const teamPlayers = getSelectedTeamPlayers() || []; // Ensure it's an array

  // Form State
  const [opponentTeam, setOpponentTeam] = useState('');
  const [homeScore, setHomeScore] = useState('0');
  const [awayScore, setAwayScore] = useState('0');
  const [performances, setPerformances] = useState([]);

  // State for Player Selection
  const [selectedPlayerForPerf, setSelectedPlayerForPerf] = useState(null);
  const [playerSelectModalVisible, setPlayerSelectModalVisible] = useState(false); // New state for player list modal

  // State for Performance Input Fields (when a player is selected)
  const [currentGoals, setCurrentGoals] = useState('0');
  const [currentAssists, setCurrentAssists] = useState('0');
  const [currentMins, setCurrentMins] = useState('0');
  const [currentYellow, setCurrentYellow] = useState('0');
  const [currentRed, setCurrentRed] = useState('0');
  const [currentSaves, setCurrentSaves] = useState('0');
  const [currentCS, setCurrentCS] = useState(false);

  // Reset form when main modal closes or opens
  useEffect(() => {
    if (visible) {
      setOpponentTeam('');
      setHomeScore('0');
      setAwayScore('0');
      setPerformances([]);
      setSelectedPlayerForPerf(null);
      setPlayerSelectModalVisible(false); // Ensure player select modal is closed
      resetPerfFields();
    } 
  }, [visible]);

  const resetPerfFields = () => {
    setCurrentGoals('0');
    setCurrentAssists('0');
    setCurrentMins('0');
    setCurrentYellow('0');
    setCurrentRed('0');
    setCurrentSaves('0');
    setCurrentCS(false);
  };

  const handleAddPerformance = () => {
    if (!selectedPlayerForPerf) return;
    
    const existingPerfIndex = performances.findIndex(p => p.playerId === selectedPlayerForPerf.id);
    const newPerf = {
      playerId: selectedPlayerForPerf.id,
      name: selectedPlayerForPerf.name,
      goals: parseInt(currentGoals) || 0,
      assists: parseInt(currentAssists) || 0,
      minutesPlayed: parseInt(currentMins) || 0,
      yellowCards: parseInt(currentYellow) || 0,
      redCards: parseInt(currentRed) || 0,
      saves: selectedPlayerForPerf.position === 'GK' ? (parseInt(currentSaves) || 0) : 0,
      cleanSheet: (selectedPlayerForPerf.position === 'GK' || selectedPlayerForPerf.position === 'DEF') && currentCS,
    };

    let updatedPerformances;
    if (existingPerfIndex > -1) {
      updatedPerformances = [...performances];
      updatedPerformances[existingPerfIndex] = newPerf;
    } else {
      updatedPerformances = [...performances, newPerf];
    }
    setPerformances(updatedPerformances);
    setSelectedPlayerForPerf(null); // Reset selection
    resetPerfFields();
  };

  // Calculate available players for the selection modal
  const availablePlayers = teamPlayers.filter(
    player => !performances.some(p => p.playerId === player.id)
  );

  const handlePlayerSelect = (player) => {
    setSelectedPlayerForPerf(player);
    resetPerfFields();
    setPlayerSelectModalVisible(false);
  };

  const handleInternalSave = () => {
    if (!opponentTeam.trim()) { Alert.alert("Input Error", "Please enter opponent team name."); return; }
    if (isNaN(parseInt(homeScore)) || isNaN(parseInt(awayScore))) { Alert.alert("Input Error", "Please enter valid scores."); return; }
    
    const matchData = {
      opponentTeam: opponentTeam.trim(),
      score: `${parseInt(homeScore)}-${parseInt(awayScore)}`,
      date: new Date().toISOString(), 
      playerPerformances: performances, 
    };
    onSave(matchData);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Title>Add Match Result</Title>
            <IconButton icon="close" size={24} onPress={onClose} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {/* Match Details */}
            <PaperInput
              label="Opponent Team"
              value={opponentTeam}
              onChangeText={setOpponentTeam}
              mode="outlined"
              style={styles.modalInput}
            />
            <View style={styles.scoreContainer}>
              <PaperInput
                label="Home Score"
                value={homeScore}
                onChangeText={setHomeScore}
                mode="outlined"
                keyboardType="numeric"
                style={styles.scoreInput}
              />
              <Text style={styles.scoreSeparator}>-</Text>
              <PaperInput
                label="Away Score"
                value={awayScore}
                onChangeText={setAwayScore}
                mode="outlined"
                keyboardType="numeric"
                style={styles.scoreInput}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Player Performances Section */}
            <Title style={styles.sectionTitle}>Player Performances</Title>
            
            {/* Display Added Performances */}
            {performances.map((perf, index) => (
              <Card key={index} style={styles.perfCard} elevation={0}>
                <Card.Content style={styles.perfCardContent}>
                  <Text style={styles.perfPlayerName}>{perf.name}</Text>
                  {/* Display summary of stats added */}
                  <View style={styles.perfStatsSummary}>
                    {perf.goals > 0 && <Text style={styles.perfStat}>G:{perf.goals} </Text>}
                    {perf.assists > 0 && <Text style={styles.perfStat}>A:{perf.assists} </Text>}
                    {perf.minutesPlayed > 0 && <Text style={styles.perfStat}>M:{perf.minutesPlayed} </Text>}
                    {perf.cleanSheet && <Text style={styles.perfStat}>CS </Text>}
                    {perf.saves > 0 && <Text style={styles.perfStat}>S:{perf.saves} </Text>}
                    {perf.yellowCards > 0 && <Text style={styles.perfStat}>YC:{perf.yellowCards} </Text>}
                    {perf.redCards > 0 && <Text style={styles.perfStat}>RC:{perf.redCards} </Text>}
                  </View>
                   <IconButton 
                      icon="pencil-outline" 
                      size={18} 
                      onPress={() => {
                          const player = getPlayerById(perf.playerId);
                          setSelectedPlayerForPerf(player);
                          setCurrentGoals(String(perf.goals));
                          setCurrentAssists(String(perf.assists));
                          setCurrentMins(String(perf.minutesPlayed));
                          setCurrentYellow(String(perf.yellowCards));
                          setCurrentRed(String(perf.redCards));
                          setCurrentSaves(String(perf.saves));
                          setCurrentCS(perf.cleanSheet);
                      }}
                    />
                </Card.Content>
              </Card>
            ))}

            {/* Input area for selected player performance */}
            {selectedPlayerForPerf ? (
              <Card style={[styles.perfInputCard, {marginTop: performances.length > 0 ? 10 : 0}]} elevation={0}>
                <Card.Title 
                  title={`Performance for ${selectedPlayerForPerf.name}`} 
                  titleStyle={{fontSize: 16}}
                  right={(props) => <IconButton {...props} icon="close-circle" onPress={() => { setSelectedPlayerForPerf(null); resetPerfFields(); }} />}
                />
                <Card.Content>
                  <View style={styles.perfInputGrid}>
                    <StatInputModal label="Goals" value={currentGoals} onChangeText={setCurrentGoals} />
                    <StatInputModal label="Assists" value={currentAssists} onChangeText={setCurrentAssists} />
                    <StatInputModal label="Mins Played" value={currentMins} onChangeText={setCurrentMins} />
                     {(selectedPlayerForPerf.position === 'GK' || selectedPlayerForPerf.position === 'DEF') && (
                         <TouchableOpacity onPress={() => setCurrentCS(!currentCS)} style={styles.checkboxContainer}>
                             <MaterialCommunityIcons name={currentCS ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color="#1a73e8" />
                             <Text style={styles.checkboxLabel}>Clean Sheet</Text>
                         </TouchableOpacity>
                     )}
                    {selectedPlayerForPerf.position === 'GK' && (
                        <StatInputModal label="Saves" value={currentSaves} onChangeText={setCurrentSaves} />
                    )}
                    <StatInputModal label="Yellow Cards" value={currentYellow} onChangeText={setCurrentYellow} />
                    <StatInputModal label="Red Cards" value={currentRed} onChangeText={setCurrentRed} />
                  </View>
                   <Button 
                      mode="contained" 
                      onPress={handleAddPerformance} 
                      style={{marginTop: 15}}
                      icon="check"
                   >
                      Confirm Performance
                   </Button>
                </Card.Content>
              </Card>
            ) : (
              /* Player Selection Button */
              <Button 
                icon="account-plus-outline" 
                mode="outlined" 
                onPress={() => setPlayerSelectModalVisible(true)} // Open new modal
                disabled={availablePlayers.length === 0} // Disable if no players left to add
                style={{marginTop: 10}}
              >
                {teamPlayers.length === 0 ? 'No players in team' : availablePlayers.length === 0 ? 'All player performances added' : 'Select Player to Add Performance'}
              </Button>
            )}

          </ScrollView>
          
           {/* Save Button Area */}
          <View style={styles.modalActions}>
               <Button 
                  icon="content-save" 
                  mode="contained" 
                  onPress={handleInternalSave}
                  disabled={!opponentTeam.trim() || isNaN(parseInt(homeScore)) || isNaN(parseInt(awayScore))}
                  style={styles.saveMatchButton}
              >
                  Save Match
              </Button>
          </View>
        </View>
       </KeyboardAvoidingView>

      {/* Player Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={playerSelectModalVisible}
        onRequestClose={() => setPlayerSelectModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.playerSelectModalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setPlayerSelectModalVisible(false)} // Close on touching outside
        >
          <View style={styles.playerSelectModalContainer}>
            <Title style={styles.playerSelectTitle}>Select Player</Title>
            <FlatList
              data={availablePlayers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.playerSelectItem} 
                  onPress={() => handlePlayerSelect(item)}
                >
                  <Text style={styles.playerSelectItemText}>{item.name} ({item.position})</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.playerSelectSeparator} />}
            />
            <Button onPress={() => setPlayerSelectModalVisible(false)} style={{marginTop: 10}}>
                Cancel
            </Button>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

// Reusable Stat Input Component for Modal
const StatInputModal = ({ label, value, onChangeText }) => (
  <View style={styles.statInputModalContainer}>
    <PaperInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      keyboardType="numeric"
      style={styles.statInput}
      dense // Make input smaller
    />
  </View>
);

const MatchResultsScreen = ({ navigation }) => {
  const { 
    matchResults, 
    addMatchResult, 
    updatePlayerStats, 
    getPlayerById, 
    getSelectedTeamPlayers,
    selectedTeam 
  } = usePlayerContext();
  const [modalVisible, setModalVisible] = useState(false);

  // Add header button only if there are players in the team
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus-circle-outline"
          color="#fff"
          size={28}
          onPress={() => {
            if (!selectedTeam || selectedTeam.length === 0) {
              Alert.alert(
                "No Team Selected",
                "Please add players to your team before recording match results.",
                [{ text: "OK" }]
              );
              return;
            }
            setModalVisible(true);
          }}
          style={{ marginRight: 10 }}
        />
      ),
    });
  }, [navigation, selectedTeam]);

  const handleSaveMatch = useCallback((matchData) => {
    console.log("Saving Match: ", matchData);
    
    // 1. Save basic match info
    addMatchResult({ 
      opponentTeam: matchData.opponentTeam,
      score: matchData.score,
      date: matchData.date, 
    });

    // 2. Update player stats based on performance
    matchData.playerPerformances.forEach(perf => {
      const player = getPlayerById(perf.playerId);
      if (player) {
        const currentStats = player.stats; // Get current TOTAL stats
        const updatedStats = {
          ...currentStats,
          goals: (currentStats.goals || 0) + perf.goals,
          assists: (currentStats.assists || 0) + perf.assists,
          minutesPlayed: (currentStats.minutesPlayed || 0) + perf.minutesPlayed,
          cleanSheets: (currentStats.cleanSheets || 0) + (perf.cleanSheet ? 1 : 0),
          saves: (currentStats.saves || 0) + perf.saves,
          yellowCards: (currentStats.yellowCards || 0) + perf.yellowCards,
          redCards: (currentStats.redCards || 0) + perf.redCards,
        };
        updatePlayerStats(perf.playerId, updatedStats); // Update context/player object
      }
    });

    setModalVisible(false); // Close modal after saving
  }, [addMatchResult, updatePlayerStats, getPlayerById]);

  const renderMatchCard = ({ item }) => (
    <Card style={styles.matchCard}>
      <Card.Content>
        <View style={styles.cardTitleRow}>
          <Title style={styles.opponentTitle}>vs {item.opponentTeam}</Title>
          {/* Add date here if stored */}
        </View>
        <Paragraph style={styles.scoreText}>Score: {item.score}</Paragraph>
        {/* Optionally display player performances summary */}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {matchResults.length === 0 ? (
          // Empty State
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-off-outline" size={60} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No matches recorded</Text>
            <Text style={styles.emptyStateSubText}>Add a match result to get started</Text>
            <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.emptyStateButton}>
              Add First Match
            </Button>
          </View>
        ) : (
          // Results List
          <FlatList
            data={matchResults}
            renderItem={renderMatchCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Add Match Result Modal */}
      <AddMatchResultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveMatch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
  },
  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    // Use primary color from theme if available
  },
  // List Styles
  listContainer: {
    padding: 16,
  },
  matchCard: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  opponentTitle: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 16,
    color: '#333',
  },
  // Modal Styles (Basic)
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingVertical: 20, // Padding handled by header/actions/scrollview
    // paddingHorizontal: 15,
    // minHeight: '60%', 
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    // paddingBottom: 10,
    // marginBottom: 10,
  },
  modalScrollContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20, // Space before save button
  },
  modalInput: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scoreInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  scoreSeparator: {
    fontSize: 24,
    marginHorizontal: 15,
    color: '#888',
  },
  divider: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  perfCard: {
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    elevation: 0,
  },
  perfCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8, // Reduce padding
    paddingHorizontal: 12,
  },
  perfPlayerName: {
    fontWeight: 'bold',
    flexShrink: 1, // Prevent long names pushing button off
    marginRight: 5,
  },
  perfStatsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1, // Take up available space
    justifyContent: 'flex-start',
    marginRight: 5,
  },
  perfStat: {
    fontSize: 12,
    color: '#555',
    marginRight: 5,
    backgroundColor: '#e9ecef',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    overflow: 'hidden', 
    marginBottom: 2,
    marginTop: 2,
  },
  perfInputCard: {
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 0,
  },
  perfInputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
   statInputModalContainer: {
    width: '48%', // Adjust width for desired layout
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Match other inputs
    marginBottom: 10,
    // paddingVertical: 10, // Add padding for touch area
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  modalActions: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  saveMatchButton: {
    // Style as needed
  },
   statInput: {
    backgroundColor: 'white',
  },
  playerSelectModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  playerSelectModalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowRadius: 4,
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  playerSelectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerSelectItem: {
    paddingVertical: 12,
  },
  playerSelectItemText: {
    fontSize: 16,
  },
  playerSelectSeparator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default MatchResultsScreen; 