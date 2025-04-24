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
  TextInput as RNTextInput, // Rename to avoid conflict
} from 'react-native';
import { Chip, Button as PaperButton } from 'react-native-paper';
import { usePlayerContext } from '../context/PlayerContext';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

// Default image if none is selected
const DEFAULT_IMAGE_URI = 'https://via.placeholder.com/100?text=Player';

const AddPlayerScreen = ({ navigation }) => {
  const { addPlayer } = usePlayerContext();
  const [isLoading, setIsLoading] = useState(false);

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

  const [errors, setErrors] = useState({});

  const pickImage = async (useCamera = false) => {
    try {
      setIsLoading(true);
      let permissionResult;
      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission Denied', 'Camera permission is required.');
          return;
        }
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission Denied', 'Media library permission is required.');
          return;
        }
      }

      let pickerResult;
      const options = {
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
      };

      if (useCamera) {
        pickerResult = await ImagePicker.launchCameraAsync(options);
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          ...options,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
      }

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert('Error', 'Failed to pick image.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!position) newErrors.position = 'Position is required';
    if (!team.trim()) newErrors.team = 'Team is required';
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    // Validate stats
    const statsValues = {
      goals: parseInt(goals, 10),
      assists: parseInt(assists, 10),
      cleanSheets: parseInt(cleanSheets, 10),
      yellowCards: parseInt(yellowCards, 10),
      redCards: parseInt(redCards, 10),
    };

    Object.entries(statsValues).forEach(([key, value]) => {
      if (isNaN(value) || value < 0) {
        newErrors[key] = 'Must be a non-negative number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form for errors.');
      return;
    }

    console.log('handleSave called with:', {
      name,
      position,
      team,
      price,
      imageUri
    });

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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity 
            style={[styles.imageButton, isLoading && styles.disabledButton]} 
            onPress={() => pickImage(false)}
            disabled={isLoading}
        >
            <MaterialCommunityIcons name="upload" size={20} color="#1a73e8" />
            <Text style={styles.imageButtonText}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.imageButton, isLoading && styles.disabledButton]} 
            onPress={() => pickImage(true)}
            disabled={isLoading}
        >
            <MaterialCommunityIcons name="camera" size={20} color="#1a73e8" />
            <Text style={styles.imageButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Player Info Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <RNTextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Enter player name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Position</Text>
        <View style={styles.chipContainer}>
          {POSITIONS.map(pos => (
            <Chip
              key={pos}
              selected={position === pos}
              onPress={() => setPosition(pos)}
              mode="flat" // Flat removes the outline/elevation
              style={[
                  styles.chip, 
                  position === pos ? styles.chipSelected : styles.chipUnselected
              ]}
              textStyle={[
                  styles.chipText,
                  position === pos ? styles.chipTextSelected : styles.chipTextUnselected
              ]}
              selectedColor={position === pos ? '#1a73e8' : '#f0f2f5'} // Hacky way to control background via selectedColor
            >
              {pos}
            </Chip>
          ))}
        </View>
        {errors.position && <Text style={styles.errorText}>{errors.position}</Text>}

        <Text style={styles.label}>Team</Text>
        <RNTextInput
          style={[styles.input, errors.team ? styles.inputError : null]}
          placeholder="Enter team name"
          value={team}
          onChangeText={setTeam}
          placeholderTextColor="#999"
        />
        {errors.team && <Text style={styles.errorText}>{errors.team}</Text>}

        <Text style={styles.label}>Price (£m)</Text>
        <RNTextInput
          style={[styles.input, errors.price ? styles.inputError : null]} // Use 'price' key here
          placeholder="5.0"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>} 
      </View>

      {/* Player Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Stats</Text>
        <View style={styles.statsGrid}>
          <StatInput label="Goals" value={goals} onChangeText={setGoals} error={errors.goals} />
          <StatInput label="Assists" value={assists} onChangeText={setAssists} error={errors.assists} />
          <StatInput label="Clean Sheets" value={cleanSheets} onChangeText={setCleanSheets} error={errors.cleanSheets} />
          <StatInput label="Yellow Cards" value={yellowCards} onChangeText={setYellowCards} error={errors.yellowCards} />
          <StatInput label="Red Cards" value={redCards} onChangeText={setRedCards} error={errors.redCards} />
        </View>
      </View>

      <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>Add Player</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Reusable Stat Input Component using standard TextInput
const StatInput = ({ label, value, onChangeText, error }) => (
    <View style={styles.statInputContainer}>
        <Text style={styles.label}>{label}</Text>
        <RNTextInput
            style={[styles.input, styles.statInput, error ? styles.inputError : null]}
            value={value}
            onChangeText={onChangeText}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#999"
        />
        {error && <Text style={styles.errorTextSmall}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light grey background
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd', // Light border
    elevation: 1,
  },
  imageButtonText: {
    marginLeft: 8,
    color: '#1a73e8', // Blue text
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#ffffff', // White background for sections
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 1, // Subtle shadow (Android)
    ...Platform.select({
      ios: {
        shadowColor: '#000', // Shadow (iOS)
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#555', // Dark grey label
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f7f7f7', // Very light grey input background
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 6, // Space before error or next element
    borderWidth: 1,
    borderColor: '#ddd', // Light border
  },
  inputError: {
    borderColor: '#d9534f', // Red border for errors
  },
  errorText: {
    color: '#d9534f', // Red error text
    fontSize: 12,
    marginBottom: 10, // Add space after error text
  },
    errorTextSmall: {
    color: '#d9534f',
    fontSize: 11,
    marginTop: 2, // Space between input and error
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10, // Space below chips before next element
    // justifyContent: 'space-between', // Let them wrap naturally
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 0, // Remove default border if using background color control
  },
  chipSelected: {
     backgroundColor: '#1a73e8', // Blue background selected
  },
  chipUnselected: {
      backgroundColor: '#e9ecef', // Light grey background unselected
  },
  chipText: {
      fontWeight: '500',
  },
  chipTextSelected: {
      color: '#ffffff', // White text selected
  },
  chipTextUnselected: {
      color: '#495057', // Darker grey text unselected
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statInputContainer: {
      width: '48%', // Two columns layout
      marginBottom: 10,
  },
  statInput: {
      // Inherits general input style, can add specific overrides
      marginBottom: 2, // Less space before error text
  },
  saveButton: {
    backgroundColor: '#1a73e8', // Blue background
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  saveButtonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6, // Dim disabled buttons
  },
});

export default AddPlayerScreen; 