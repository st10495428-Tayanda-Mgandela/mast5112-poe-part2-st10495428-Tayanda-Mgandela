import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem, RootStackParamList, calculateAveragePrices } from '../../App';

interface HomeScreenProps extends NativeStackScreenProps<RootStackParamList, 'Home'> {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  removeMenuItem: (id: number) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, menuItems, setMenuItems, removeMenuItem }) => {
  const getCourseColor = (course: string) => {
    switch (course) {
      case 'Starter':
        return '#FF6B6B';
      case 'Main':
        return '#4ECDC4';
      case 'Dessert':
        return '#FFD166';
      default:
        return '#95E1D3';
    }
  };

  const averagePrices = calculateAveragePrices(menuItems);

  const confirmRemoveItem = (item: MenuItem) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${item.name}" from the menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeMenuItem(item.id),
        },
      ],
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[styles.courseBadge, { backgroundColor: getCourseColor(item.course) }]}>
          <Text style={styles.courseText}>{item.course}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={() => confirmRemoveItem(item)}>
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color="#CCD1D1" />
      <Text style={styles.emptyStateTitle}>No Menu Items</Text>
      <Text style={styles.emptyStateText}>Get started by adding your first dish to the menu!</Text>
    </View>
  );

  const AveragePriceDisplay = () => {
    if (menuItems.length === 0) return null;
    return (
      <View style={styles.averagePriceContainer}>
        <Text style={styles.averagePriceTitle}>Average Prices by Course</Text>
        <View style={styles.averagePriceRow}>
          {Object.entries(averagePrices).map(([course, average]) => (
            <View key={course} style={styles.averagePriceItem}>
              <View style={[styles.averageDot, { backgroundColor: getCourseColor(course) }]} />
              <Text style={styles.averagePriceText}>
                {course}: ${average.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu Items</Text>
        <Text style={styles.headerSubtitle}>
          {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} total
        </Text>
      </View>
      <AveragePriceDisplay />
      {menuItems.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddMenu')}>
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Add Menu Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Filter')}>
          <Ionicons name="filter" size={20} color="#2E8B57" />
          <Text style={styles.secondaryButtonText}>Filter Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  averagePriceContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  averagePriceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  averagePriceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  averagePriceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  averageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  averagePriceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginRight: 8,
  },
  courseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  courseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E8B57',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E8B57',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen;
