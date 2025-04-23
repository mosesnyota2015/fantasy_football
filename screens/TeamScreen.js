import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { usePlayerContext } from '../context/PlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TeamScreen = () => {
    const { getSelectedTeamPlayers, removeFromTeam } = usePlayerContext();
    const [formation, setFormation] = useState('4-4-2');
    const selectedPlayers = getSelectedTeamPlayers();
    const totalPoints = selectedPlayers.reduce((sum, player) => sum + (player.stats?.totalPoints || 0), 0);
    const budget = 100.0;

    const positionCounts = {
        GK: { required: 1, current: 0 },
        DEF: { required: 4, current: 0 },
        MID: { required: 4, current: 0 },
        FWD: { required: 3, current: 0 }
    };

    // Count current players by position
    selectedPlayers.forEach(player => {
        if (positionCounts[player.position]) {
            positionCounts[player.position].current++;
        }
    });

    // Update formation based on player positions
    useEffect(() => {
        const def = positionCounts.DEF.current;
        const mid = positionCounts.MID.current;
        const fwd = positionCounts.FWD.current;
        setFormation(`${def}-${mid}-${fwd}`);
    }, [selectedPlayers]);

    const getPositionColor = (position) => {
        switch (position) {
            case 'GK': return '#ffcdd2';
            case 'DEF': return '#c8e6c9';
            case 'MID': return '#bbdefb';
            case 'FWD': return '#ffe0b2';
            default: return '#e0e0e0';
        }
    };

    const renderPlayer = (player) => (
        <View key={player.id} style={styles.playerCard}>
            <View style={[styles.positionIndicator, { backgroundColor: getPositionColor(player.position) }]}>
                <Text style={styles.positionText}>{player.position}</Text>
            </View>
            <Image
                source={{ uri: player.imageUrl || 'https://via.placeholder.com/50' }}
                style={styles.playerImage}
            />
            <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerTeam}>{player.team}</Text>
                <Text style={styles.playerValue}>£{player.value}m</Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromTeam(player.id)}
            >
                <MaterialCommunityIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Team</Text>
            </View>
            
            <View style={styles.titleContainer}>
                <Text style={styles.title}>My Fantasy Team</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="pencil" size={24} color="#1a73e8" />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>My Fantasy Team</Text>
                
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="trophy-outline" size={24} color="#1a73e8" />
                        <Text style={styles.statValue}>{totalPoints}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>

                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-outline" size={24} color="#1a73e8" />
                        <Text style={styles.statValue}>{selectedPlayers.length}/11</Text>
                        <Text style={styles.statLabel}>Players</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.formationValue}>{formation}</Text>
                        <Text style={styles.statLabel}>Formation</Text>
                    </View>

                    <View style={styles.statItem}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#1a73e8" />
                        <Text style={styles.statValue}>£{budget}m</Text>
                        <Text style={styles.statLabel}>Budget</Text>
                    </View>
                </View>

                <View style={styles.positionsContainer}>
                    <View style={[styles.positionItem, { backgroundColor: '#ffcdd2' }]}>
                        <Text style={styles.positionLabel}>GK</Text>
                        <Text style={styles.positionCount}>{positionCounts.GK.current}/{positionCounts.GK.required}</Text>
                    </View>
                    <View style={[styles.positionItem, { backgroundColor: '#c8e6c9' }]}>
                        <Text style={styles.positionLabel}>DEF</Text>
                        <Text style={styles.positionCount}>{positionCounts.DEF.current}/{positionCounts.DEF.required}</Text>
                    </View>
                    <View style={[styles.positionItem, { backgroundColor: '#bbdefb' }]}>
                        <Text style={styles.positionLabel}>MID</Text>
                        <Text style={styles.positionCount}>{positionCounts.MID.current}/{positionCounts.MID.required}</Text>
                    </View>
                    <View style={[styles.positionItem, { backgroundColor: '#ffe0b2' }]}>
                        <Text style={styles.positionLabel}>FWD</Text>
                        <Text style={styles.positionCount}>{positionCounts.FWD.current}/{positionCounts.FWD.required}</Text>
                    </View>
                </View>
            </View>

            {selectedPlayers.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateTitle}>Your team is empty</Text>
                    <Text style={styles.emptyStateSubtitle}>Go to the Players tab to add players to your team</Text>
                </View>
            ) : (
                <ScrollView style={styles.playersList}>
                    {selectedPlayers.map(player => renderPlayer(player))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#1a73e8',
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#202124',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#202124',
        marginTop: 8,
        marginBottom: 4,
    },
    formationValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#202124',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#5f6368',
    },
    positionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    positionItem: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    positionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 4,
    },
    positionCount: {
        fontSize: 12,
        color: '#5f6368',
    },
    playersList: {
        flex: 1,
        marginTop: 16,
        paddingHorizontal: 16,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    positionIndicator: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 12,
    },
    positionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#202124',
    },
    playerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 2,
    },
    playerTeam: {
        fontSize: 12,
        color: '#5f6368',
        marginBottom: 2,
    },
    playerValue: {
        fontSize: 12,
        color: '#1a73e8',
        fontWeight: '500',
    },
    removeButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#202124',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#5f6368',
        textAlign: 'center',
    },
});

export default TeamScreen; 