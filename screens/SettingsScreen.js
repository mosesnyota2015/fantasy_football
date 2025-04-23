import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePlayerContext } from '../context/PlayerContext';

const SettingItem = ({ icon, iconColor, title, subtitle, onPress, rightElement }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    {rightElement}
  </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { clearTeam, resetAllData, selectedTeamIds, removeFromTeam } = usePlayerContext();

  const handleClearTeam = () => {
    Alert.alert(
      'Clear Team',
      'Are you sure you want to remove all players from your team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Remove each player from the team
            if (selectedTeamIds && selectedTeamIds.length > 0) {
              selectedTeamIds.forEach(playerId => removeFromTeam(playerId));
            }
            clearTeam();
          }
        }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all app data and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // First clear the team
            if (selectedTeamIds && selectedTeamIds.length > 0) {
              selectedTeamIds.forEach(playerId => removeFromTeam(playerId));
            }
            resetAllData();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Team" />
      <SettingItem
        icon="delete-outline"
        iconColor="#ff4444"
        title="Clear Team"
        subtitle={`Remove all players from your team (${selectedTeamIds?.length || 0} players)`}
        onPress={handleClearTeam}
      />

      <SectionHeader title="Preferences" />
      <SettingItem
        icon="bell-outline"
        iconColor="#1a73e8"
        title="Notifications"
        subtitle="Get updates about matches and points"
        rightElement={
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#1a73e8' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        }
      />

      <SectionHeader title="About" />
      <SettingItem
        icon="information-outline"
        iconColor="#1a73e8"
        title="App Info"
        subtitle="Version 1.0.0"
        onPress={() => {}}
        rightElement={
          <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        }
      />
      <SettingItem
        icon="shield-outline"
        iconColor="#1a73e8"
        title="Privacy Policy"
        subtitle="All data is stored locally on your device"
        onPress={() => {}}
        rightElement={
          <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        }
      />

      <SectionHeader title="Data" />
      <SettingItem
        icon="refresh"
        iconColor="#ff4444"
        title="Reset All Data"
        subtitle="Clear all app data and start fresh"
        onPress={handleResetData}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Fantasy Football by JohnStanley</Text>
        <Text style={styles.footerText}>© 2025 All Rights Reserved</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SettingsScreen; 