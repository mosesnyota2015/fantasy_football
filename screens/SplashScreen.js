import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, delay }) => {
  const translateY = new Animated.Value(50);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.featureCardShadow}>
      <Animated.View style={[
        styles.featureCard,
        {
          transform: [{ translateY }],
          opacity
        }
      ]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={32} color="#1a73e8" />
        </View>
        <View style={styles.featureTextContainer}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const SplashScreen = ({ navigation }) => {
  const logoScale = new Animated.Value(0.3);
  const titleOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#ffffff', '#f5f5f5']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircleShadow}>
            <Animated.View style={[
              styles.logoCircle,
              { transform: [{ scale: logoScale }] }
            ]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }} 
                style={styles.logo}
                resizeMode="cover"
              />
            </Animated.View>
          </View>
          <Animated.View style={{ opacity: titleOpacity }}>
            <Text style={styles.title}>Fantasy Football</Text>
            <Text style={styles.subtitle}>Team Builder</Text>
          </Animated.View>
        </View>

        <View style={styles.cardContainer}>
          <FeatureCard
            icon="account-group"
            title="Build Your Dream Team"
            description="Select from the best players across all teams to create your ultimate fantasy squad."
            delay={300}
          />
          <FeatureCard
            icon="chart-line"
            title="Track Performance"
            description="Monitor your team's performance with real-time stats and match results."
            delay={500}
          />
          <FeatureCard
            icon="trophy"
            title="Compete for Glory"
            description="Earn points based on your players' real-world performances and climb the leaderboard."
            delay={700}
          />
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('PlayerList')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircleShadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'transparent',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  featureCardShadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: '#1a73e8',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default SplashScreen; 