import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description }) => (
  <View style={styles.featureCard}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={24} color="#1a73e8" />
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }} 
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.title}>Fantasy Football</Text>
          <Text style={styles.subtitle}>Team Builder</Text>
        </View>

        <View style={styles.cardContainer}>
          <FeatureCard
            icon="account-group"
            title="Build Your Dream Team"
            description="Select from the best players across all teams to create your ultimate fantasy squad."
          />
          <FeatureCard
            icon="chart-line"
            title="Track Performance"
            description="Monitor your team's performance with real-time stats and match results."
          />
          <FeatureCard
            icon="trophy"
            title="Compete for Glory"
            description="Earn points based on your players' real-world performances and climb the leaderboard."
          />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.replace('PlayerList')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a73e8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingBottom: 30,
  },
  logoCircle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    padding: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 115, 232, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a73e8',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen; 