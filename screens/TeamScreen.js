import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Platform,
} from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Surface } from 'react-native-paper';
import { usePlayerContext } from '../context/PlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Helper to get color based on position (reuse from PlayerListScreen or define here)
const getPositionColor = (position) => {
    switch (position) {
        case 'GK': return '#f1c40f'; // Yellow
        case 'DEF': return '#2ecc71'; // Green
        case 'MID': return '#3498db'; // Blue
        case 'FWD': return '#e74c3c'; // Red
        default: return '#95a5a6'; // Gray
    }
};

const TeamScreen = ({ navigation }) => {
    const { getSelectedTeamPlayers, removeFromTeam, selectedTeamIds } = usePlayerContext();
    const selectedPlayers = getSelectedTeamPlayers();

    // Calculate summary stats AND formation
    const { totalPoints, totalValue, playerCount, formation } = useMemo(() => {
        let points = 0;
        let value = 0;
        let defCount = 0;
        let midCount = 0;
        let fwdCount = 0;

        selectedPlayers.forEach(player => {
            points += player.points || 0;
            value += player.value || 0;
            switch (player.position) {
                case 'DEF': defCount++; break;
                case 'MID': midCount++; break;
                case 'FWD': fwdCount++; break;
                // GK is ignored for formation string
            }
        });

        // Construct formation string (only if outfield players exist)
        const formationString = (defCount > 0 || midCount > 0 || fwdCount > 0) 
                                ? `${defCount}-${midCount}-${fwdCount}` 
                                : '-';

        return {
            totalPoints: points,
            totalValue: value,
            playerCount: selectedPlayers.length,
            formation: formationString,
        };
    }, [selectedPlayers]);

    const renderPlayerCard = ({ item }) => (
        <Card style={styles.playerCard}>
             <View style={styles.cardHeader}>
                <View style={[styles.positionTag, { backgroundColor: getPositionColor(item.position) }]}>
                   <Text style={styles.positionTagText}>{item.position}</Text>
                </View>
                 <Text style={styles.playerValueSmall}>£{item.value.toFixed(1)}m</Text>
            </View>
            <Card.Content style={styles.playerCardContent}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.playerImage}
                    resizeMode="contain"
                />
                <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{item.name}</Text>
                    <Text style={styles.teamNameSmall}>{item.team}</Text>
                    <Text style={styles.playerPoints}>Points: {item.points}</Text>
                </View>
                <IconButton
                    icon="minus-circle-outline"
                    color="#e74c3c" // Red for remove
                    size={28}
                    onPress={() => removeFromTeam(item.id)}
                />
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Summary Card */}
                <Surface style={styles.summaryCard} elevation={4}>
                    {/* Total Points */}
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Points</Text>
                        <Text style={styles.summaryValue}>{totalPoints}</Text>
                    </View>
                    <View style={styles.summarySeparator} />
                    {/* Players */}
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Players</Text>
                        <Text style={styles.summaryValue}>{playerCount} / 11</Text>
                    </View>
                     <View style={styles.summarySeparator} />
                    {/* Formation */}
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Formation</Text>
                        <Text style={styles.summaryValue}>{formation}</Text>
                    </View>
                    <View style={styles.summarySeparator} />
                     {/* Total Value */}
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Value</Text>
                        <Text style={styles.summaryValue}>£{totalValue.toFixed(1)}m</Text>
                    </View>
                </Surface>

                {/* Selected Players List */}
                {selectedPlayers.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="account-off-outline" size={60} color="#bdc3c7" />
                        <Text style={styles.emptyStateText}>Your team is empty.</Text>
                        <Text style={styles.emptyStateSubText}>Go to the Players tab to add players.</Text>
                         <Button 
                            mode="outlined"
                            onPress={() => navigation.navigate('PlayersTab', { screen: 'PlayerList'})} // Navigate to player list
                            style={{marginTop: 15}}
                         >
                             Browse Players
                         </Button>
                    </View>
                ) : (
                    <FlatList
                        data={selectedPlayers}
                        renderItem={renderPlayerCard}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
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
    // Summary Card Styles
    summaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 12,
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowRadius: 4,
                shadowOpacity: 0.2,
            },
            android: { elevation: 4 },
        }),
    },
    summaryItem: {
        alignItems: 'center',
        flexShrink: 1, // Allow items to shrink if needed
        paddingHorizontal: 5, // Add padding between items
    },
    summaryLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 16, // Slightly smaller font for more items
        fontWeight: 'bold',
        color: '#1a73e8',
    },
     summarySeparator: {
        width: 1,
        height: '60%',
        backgroundColor: '#e0e0e0',
    },
    // List Styles
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    // Player Card Styles
    playerCard: {
        marginBottom: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowRadius: 2,
                shadowOpacity: 0.1,
            },
            android: { elevation: 2 },
        }),
    },
     cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 5,
    },
    positionTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    positionTagText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 11,
    },
     playerValueSmall: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    playerCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 10,
        paddingTop: 5,
    },
    playerImage: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    },
     teamNameSmall: {
        fontSize: 12,
        color: '#777',
        marginBottom: 3,
    },
    playerPoints: {
        fontSize: 13,
        color: '#555',
    },
    // Empty State Styles
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
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
        marginBottom: 10,
    },
});

export default TeamScreen; 