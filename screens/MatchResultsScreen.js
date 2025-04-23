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
  Dimensions,
} from 'react-native';
import { Card, Button, TextInput as PaperInput, IconButton, Title, Paragraph, Provider as PaperProvider, Divider } from 'react-native-paper';
import { usePlayerContext } from '../context/PlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Player from '../models/Player';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const AddMatchResultModal = ({ visible, onClose, onSave }) => {
  const { getSelectedTeamPlayers, getPlayerById } = usePlayerContext();
  const teamPlayers = getSelectedTeamPlayers() || [];

  const [opponentTeam, setOpponentTeam] = useState('');
  const [homeScore, setHomeScore] = useState('0');
  const [awayScore, setAwayScore] = useState('0');
  const [performances, setPerformances] = useState([]);
  const [selectedPlayerForPerf, setSelectedPlayerForPerf] = useState(null);
  const [playerSelectModalVisible, setPlayerSelectModalVisible] = useState(false);

  const [currentGoals, setCurrentGoals] = useState('0');
  const [currentAssists, setCurrentAssists] = useState('0');
  const [currentMins, setCurrentMins] = useState('0');
  const [currentYellow, setCurrentYellow] = useState('0');
  const [currentRed, setCurrentRed] = useState('0');
  const [currentSaves, setCurrentSaves] = useState('0');
  const [currentCS, setCurrentCS] = useState(false);

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

    const newPerf = {
      playerId: selectedPlayerForPerf.id,
      name: selectedPlayerForPerf.name,
      goals: parseInt(currentGoals) || 0,
      assists: parseInt(currentAssists) || 0,
      minutesPlayed: parseInt(currentMins) || 0,
      cleanSheet: currentCS,
      saves: parseInt(currentSaves) || 0,
      yellowCards: parseInt(currentYellow) || 0,
      redCards: parseInt(currentRed) || 0,
    };

    setPerformances(prev => [...prev, newPerf]);
    setSelectedPlayerForPerf(null);
    resetPerfFields();
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayerForPerf(player);
    resetPerfFields();
    setPlayerSelectModalVisible(false);
  };

  const calculateMatchPoints = (performances) => {
    return performances.reduce((total, perf) => {
      let points = 0;
      
      // Minutes played points
      points += Math.floor(perf.minutesPlayed / 90) * 2;
      
      // Goals
      const player = getPlayerById(perf.playerId);
      if (player) {
        switch(player.position) {
          case 'GK':
          case 'DEF':
            points += perf.goals * 6;
            break;
          case 'MID':
            points += perf.goals * 5;
            break;
          case 'FWD':
            points += perf.goals * 4;
            break;
        }
      }
      
      // Assists
      points += perf.assists * 3;
      
      // Clean sheets
      if (player && (player.position === 'GK' || player.position === 'DEF')) {
        points += perf.cleanSheet ? 4 : 0;
      } else if (player && player.position === 'MID') {
        points += perf.cleanSheet ? 1 : 0;
      }
      
      // Saves (Goalkeepers only)
      if (player && player.position === 'GK') {
        points += Math.floor(perf.saves / 3);
      }
      
      // Cards
      points -= perf.yellowCards * 1;
      points -= perf.redCards * 3;
      
      return total + points;
    }, 0);
  };

  const handleInternalSave = () => {
    if (!opponentTeam.trim()) {
      Alert.alert("Input Error", "Please enter opponent team name.");
      return;
    }
    if (isNaN(parseInt(homeScore)) || isNaN(parseInt(awayScore))) {
      Alert.alert("Input Error", "Please enter valid scores.");
      return;
    }

    const matchPoints = calculateMatchPoints(performances);
    
    const matchData = {
      opponentTeam: opponentTeam.trim(),
      score: `${parseInt(homeScore)}-${parseInt(awayScore)}`,
      date: new Date().toISOString(),
      playerPerformances: performances,
      totalPoints: matchPoints,
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

            <Title style={styles.sectionTitle}>Player Performances</Title>
            
            {performances.map((perf, index) => (
              <Card key={index} style={styles.perfCard}>
                <Card.Content style={styles.perfCardContent}>
                  <View style={styles.perfInfo}>
                    <Text style={styles.perfPlayerName}>{perf.name}</Text>
                    <View style={styles.perfStatsSummary}>
                      {perf.goals > 0 && <Text style={styles.perfStat}>G:{perf.goals} </Text>}
                      {perf.assists > 0 && <Text style={styles.perfStat}>A:{perf.assists} </Text>}
                      {perf.minutesPlayed > 0 && <Text style={styles.perfStat}>M:{perf.minutesPlayed} </Text>}
                      {perf.cleanSheet && <Text style={styles.perfStat}>CS </Text>}
                      {perf.saves > 0 && <Text style={styles.perfStat}>S:{perf.saves} </Text>}
                      {perf.yellowCards > 0 && <Text style={styles.perfStat}>YC:{perf.yellowCards} </Text>}
                      {perf.redCards > 0 && <Text style={styles.perfStat}>RC:{perf.redCards} </Text>}
                    </View>
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

            {selectedPlayerForPerf ? (
              <Card style={styles.perfInputCard}>
                <Card.Content>
                  <Text style={styles.selectedPlayerName}>{selectedPlayerForPerf.name}</Text>
                  <View style={styles.perfInputGrid}>
                    <View style={styles.statInputContainer}>
                      <PaperInput
                        label="Goals"
                        value={currentGoals}
                        onChangeText={setCurrentGoals}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.statInput}
                      />
                    </View>
                    <View style={styles.statInputContainer}>
                      <PaperInput
                        label="Assists"
                        value={currentAssists}
                        onChangeText={setCurrentAssists}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.statInput}
                      />
                    </View>
                    <View style={styles.statInputContainer}>
                      <PaperInput
                        label="Minutes"
                        value={currentMins}
                        onChangeText={setCurrentMins}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.statInput}
                      />
                    </View>
                    <View style={styles.statInputContainer}>
                      <PaperInput
                        label="Saves"
                        value={currentSaves}
                        onChangeText={setCurrentSaves}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.statInput}
                      />
                    </View>
                    <View style={styles.statInputContainer}>
                      <PaperInput
                        label="Yellow Cards"
                        value={currentYellow}
                        onChangeText={setCurrentYellow}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.statInput}
                      />
                    </View>
                    <View style={styles.statInputContainer}>
                      <PaperInput
                        label="Red Cards"
                        value={currentRed}
                        onChangeText={setCurrentRed}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.statInput}
                      />
                    </View>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => setCurrentCS(!currentCS)}
                    >
                      <MaterialCommunityIcons
                        name={currentCS ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color="#1a73e8"
                      />
                      <Text style={styles.checkboxLabel}>Clean Sheet</Text>
                    </TouchableOpacity>
                  </View>
                  <Button 
                    mode="contained" 
                    onPress={handleAddPerformance}
                    style={styles.confirmButton}
                  >
                    Confirm Performance
                  </Button>
                </Card.Content>
              </Card>
            ) : (
              <Button 
                icon="account-plus-outline" 
                mode="outlined" 
                onPress={() => setPlayerSelectModalVisible(true)}
                style={styles.addPlayerButton}
              >
                Add Player Performance
              </Button>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button 
              mode="contained" 
              onPress={handleInternalSave}
              style={styles.saveButton}
            >
              Save Match
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={playerSelectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPlayerSelectModalVisible(false)}
      >
        <View style={styles.playerSelectModal}>
          <View style={styles.playerSelectContent}>
            <Title>Select Player</Title>
            <ScrollView>
              {teamPlayers.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerSelectItem}
                  onPress={() => handlePlayerSelect(player)}
                >
                  <Text style={styles.playerSelectName}>{player.name}</Text>
                  <Text style={styles.playerSelectPosition}>{player.position}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              mode="outlined"
              onPress={() => setPlayerSelectModalVisible(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const MatchResultsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { matchResults, addMatchResult, updatePlayerStats, getPlayerById } = usePlayerContext();

  const handleSaveMatch = useCallback((matchData) => {
    addMatchResult(matchData);

    matchData.playerPerformances.forEach(perf => {
      const player = getPlayerById(perf.playerId);
      if (player) {
        const currentStats = player.stats;
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
        updatePlayerStats(perf.playerId, updatedStats);
      }
    });

    setModalVisible(false);
  }, [addMatchResult, updatePlayerStats, getPlayerById]);

  const renderMatchCard = ({ item }) => (
    <Card style={styles.matchCard}>
      <Card.Content>
        <View style={styles.matchHeader}>
          <View style={styles.matchInfo}>
            <Title style={styles.opponentTitle}>vs {item.opponentTeam}</Title>
            <Text style={styles.matchDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Total Points:</Text>
          <Text style={styles.pointsValue}>{item.totalPoints}</Text>
        </View>
        <View style={styles.performancesContainer}>
          {item.playerPerformances.map((perf, index) => (
            <View key={index} style={styles.performanceItem}>
              <Text style={styles.performanceName}>{perf.name}</Text>
              <View style={styles.performanceStats}>
                {perf.goals > 0 && <Text style={styles.performanceStat}>G:{perf.goals} </Text>}
                {perf.assists > 0 && <Text style={styles.performanceStat}>A:{perf.assists} </Text>}
                {perf.minutesPlayed > 0 && <Text style={styles.performanceStat}>M:{perf.minutesPlayed} </Text>}
                {perf.cleanSheet && <Text style={styles.performanceStat}>CS </Text>}
                {perf.saves > 0 && <Text style={styles.performanceStat}>S:{perf.saves} </Text>}
                {perf.yellowCards > 0 && <Text style={styles.performanceStat}>YC:{perf.yellowCards} </Text>}
                {perf.redCards > 0 && <Text style={styles.performanceStat}>RC:{perf.redCards} </Text>}
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {matchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-off-outline" size={60} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No matches recorded</Text>
            <Text style={styles.emptyStateSubText}>Add a match result to get started</Text>
            <Button 
              mode="contained" 
              onPress={() => setModalVisible(true)} 
              style={styles.emptyStateButton}
            >
              Add First Match
            </Button>
          </View>
        ) : (
          <FlatList
            data={matchResults}
            renderItem={renderMatchCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

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
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
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
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 16,
  },
  matchCard: {
    marginBottom: 16,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchInfo: {
    flex: 1,
  },
  opponentTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  scoreSeparator: {
    fontSize: 24,
    marginHorizontal: 15,
    color: '#888',
  },
  divider: {
    marginVertical: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  performancesContainer: {
    marginTop: 8,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  performanceName: {
    fontSize: 14,
    fontWeight: '500',
  },
  performanceStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  performanceStat: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalScrollContent: {
    padding: 16,
  },
  modalInput: {
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreInput: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  perfCard: {
    marginBottom: 8,
  },
  perfCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perfInfo: {
    flex: 1,
  },
  perfPlayerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  perfStatsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  perfStat: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  perfInputCard: {
    marginTop: 16,
  },
  selectedPlayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  perfInputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statInputContainer: {
    width: '48%',
    marginBottom: 12,
  },
  statInput: {
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    marginTop: 8,
  },
  addPlayerButton: {
    marginTop: 16,
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#1a73e8',
  },
  playerSelectModal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playerSelectContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  playerSelectItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerSelectName: {
    fontSize: 16,
    fontWeight: '500',
  },
  playerSelectPosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    marginTop: 16,
  },
});

export default MatchResultsScreen; 