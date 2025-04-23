import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { TextInput, Button, Chip, Card, Provider as PaperProvider } from 'react-native-paper';
import { usePlayerContext } from '../context/PlayerContext';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

// Default image if none is selected
const DEFAULT_IMAGE_URI = 'https://via.placeholder.com/100?text=Player';

const AddPlayerScreen = ({ navigation }) => {
  const { addPlayer } = usePlayerContext();

  const [name, setName] = useState('');
  const [position, setPosition] = useState(''); // Use short position codes
  const [team, setTeam] = useState('');
  const [price, setPrice] = useState('5.0'); // Default price
  const [imageUri, setImageUri] = useState(null);

  // Stats state
  const [goals, setGoals] = useState('0');
  const [assists, setAssists] = useState('0');
  const [cleanSheets, setCleanSheets] = useState('0');
  const [yellowCards, setYellowCards] = useState('0');
  const [redCards, setRedCards] = useState('0');

  // Image Picker Logic
  const pickImage = async (useCamera = false) => {
    let permissionResult;
    if (useCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
        return;
      }
    } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (!permissionResult.granted) {
            Alert.alert('Permission Denied', 'Media library permission is required to choose a photo.');
            return;
        }
    }

    let pickerResult;
    if (useCamera) {
        pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
    } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio
          quality: 0.5, // Reduce quality to save space
        });
    }
    
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handleSave = () => {
    console.log('handleSave called with:', {
      name,
      position,
      team,
      price,
      imageUri
    });

    // --- Input Validation ---
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter player name.'); return;
    }
    if (!position) {
      Alert.alert('Error', 'Please select a position.'); return;
    }
    if (!team.trim()) {
        Alert.alert('Error', 'Please enter team name.'); return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
        Alert.alert('Error', 'Please enter a valid price.'); return;
    }
    // Basic validation for stats (ensure they are numbers)
    const statsValues = {
        goals: parseInt(goals, 10),
        assists: parseInt(assists, 10),
        cleanSheets: parseInt(cleanSheets, 10),
        yellowCards: parseInt(yellowCards, 10),
        redCards: parseInt(redCards, 10),
    };
    for (const key in statsValues) {
        if (isNaN(statsValues[key])) {
            Alert.alert('Error', `Please enter a valid number for ${key}.`); return;
        }
    }
    // --- End Validation ---

    // Prepare data for context
    const finalStats = {
        ...statsValues,
        saves: 0, // Add default saves, adjust if needed for GK later
        minutesPlayed: 0, // Add default minutes
    };

    try {
        console.log('Adding player with data:', {
            name: name.trim(),
            position,
            team: team.trim(),
            imageUrl: imageUri || DEFAULT_IMAGE_URI,
            value: priceValue,
            stats: finalStats
        });

        addPlayer(
            name.trim(),
            position,
            team.trim(),
            imageUri || DEFAULT_IMAGE_URI,
            priceValue,
            finalStats
        );

        Alert.alert('Success', 'Player added successfully!');
        navigation.goBack();
    } catch (error) {
        console.error('Error adding player:', error);
        Alert.alert('Error', 'Failed to add player. Please try again.');
    }
  };

  return (
    <PaperProvider> {/* Need Provider for Paper components like Card */} 
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          {/* Image Picker Buttons */}
          <View style={styles.imagePickerContainer}>
                <Image 
                    source={{ uri: imageUri || DEFAULT_IMAGE_URI }} 
                    style={styles.playerImagePreview} 
                />
                <View style={styles.imageButtons}> 
                    <Button 
                        icon="upload" 
                        mode="outlined" 
                        onPress={() => pickImage(false)} 
                        style={styles.imageButton}
                    >
                        Upload
                    </Button>
                    <Button 
                        icon="camera" 
                        mode="outlined" 
                        onPress={() => pickImage(true)} 
                        style={styles.imageButton}
                    >
                        Camera
                    </Button>
                </View>
          </View>

        {/* Player Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Name"
              placeholder="Enter player name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.label}>Position</Text>
            <View style={styles.chipContainer}>
              {POSITIONS.map(pos => (
                <Chip
                  key={pos}
                  selected={position === pos}
                  onPress={() => setPosition(pos)}
                  mode="outlined" // Use outlined for consistency
                  selectedColor="#fff" // White text when selected
                  style={[styles.chip, position === pos && styles.chipSelected]}
                >
                  {pos}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Team"
              placeholder="Enter team name"
              value={team}
              onChangeText={setTeam}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Price (£m)"
              placeholder="e.g., 7.5"
              value={price}
              onChangeText={setPrice}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Player Stats Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Player Stats</Text>
            <View style={styles.statsGrid}>
                <StatInput label="Goals" value={goals} onChangeText={setGoals} />
                <StatInput label="Assists" value={assists} onChangeText={setAssists} />
                <StatInput label="Clean Sheets" value={cleanSheets} onChangeText={setCleanSheets} />
                <StatInput label="Yellow Cards" value={yellowCards} onChangeText={setYellowCards} />
                <StatInput label="Red Cards" value={redCards} onChangeText={setRedCards} />
                {/* Add more stats if needed */}
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => {
            console.log('Save button pressed');
            handleSave();
          }}
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
          contentStyle={styles.saveButtonContent}
        >
          Add Player
        </Button>
      </ScrollView>
    </PaperProvider>
  );
};

// Reusable Stat Input Component
const StatInput = ({ label, value, onChangeText }) => (
    <View style={styles.statInputContainer}>
        <TextInput
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Match background
    paddingVertical: 10,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    elevation: 0,
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowRadius: 2,
            shadowOpacity: 0.1,
        },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    marginLeft: 5, // Align with input text
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  chip: {
    // Adjust margin/padding as needed for spacing
    marginVertical: 4,
    backgroundColor: '#e0e0e0', // Default background for unselected
    borderColor: '#bdbdbd', // Border for unselected
  },
  chipSelected: {
    backgroundColor: '#1a73e8', // Primary color
    borderColor: '#1a73e8',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items
  },
  statInputContainer: {
      width: '48%', // Two columns layout
      marginBottom: 10,
  },
  statInput: {
     backgroundColor: 'white',
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 30, // Ensure space at bottom
    backgroundColor: '#1a73e8', // Use theme primary color
  },
  saveButtonContent: {
    height: 50,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Image Picker Styles
  imagePickerContainer: {
      alignItems: 'center',
      marginBottom: 20,
      marginHorizontal: 16,
  },
  playerImagePreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#e0e0e0',
      marginBottom: 15,
      borderWidth: 2,
      borderColor: '#1a73e8'
  },
  imageButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '80%',
  },
  imageButton: {
      flex: 1,
      marginHorizontal: 5, 
  },
});

export default AddPlayerScreen; 