import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem, RootStackParamList } from '../../App';

interface AddMenuScreenProps extends NativeStackScreenProps<RootStackParamList, 'AddMenu'> {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const RNPicker = Picker as unknown as React.ComponentType<any> & { Item: any };

const AddMenuScreen: React.FC<AddMenuScreenProps> = ({ navigation, menuItems, setMenuItems }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  const courses = ['Starter', 'Main', 'Dessert'];

  const addMenuItem = (): void => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields to add a new dish.');
      return;
    }

    const priceValue = parseFloat(price);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return;
    }

    const newItem: MenuItem = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      course,
      price: priceValue,
    };

    setMenuItems([...menuItems, newItem]);

    setName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');

    Alert.alert('Success!', `${name} has been added to the menu.`);
  };

  const getCourseColor = (courseName: string) => {
    return courseName === course ? '#2E8B57' : '#CCD1D1';
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            placeholder="Enter dish name"
            placeholderTextColor="#95A5A6"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe the dish"
            placeholderTextColor="#95A5A6"
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course Type</Text>
          <View style={styles.pickerContainer}>
            <RNPicker
              selectedValue={course}
              onValueChange={(itemValue: string) => setCourse(itemValue)}
              style={styles.picker}
            >
              {courses.map((c) => (
                <RNPicker.Item label={c} value={c} key={c} color={getCourseColor(c)} />
              ))}
            </RNPicker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#95A5A6"
              style={[styles.input, styles.priceInput]}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (!name.trim() || !description.trim() || !price.trim()) && styles.submitButtonDisabled]}
          onPress={addMenuItem}
          disabled={!name.trim() || !description.trim() || !price.trim()}
        >
          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Add to Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 2,
    borderRightWidth: 0,
    borderColor: '#E9ECEF',
  },
  priceInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  submitButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#2E8B57',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCD1D1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddMenuScreen;
