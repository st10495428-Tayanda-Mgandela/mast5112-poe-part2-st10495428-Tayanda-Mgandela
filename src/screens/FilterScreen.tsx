import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem, RootStackParamList, filterItemsByCourse } from '../../App';

interface FilterScreenProps extends NativeStackScreenProps<RootStackParamList, 'Filter'> {
  menuItems: MenuItem[];
}

const RNPicker = Picker as unknown as React.ComponentType<any> & { Item: any };

const FilterScreen: React.FC<FilterScreenProps> = ({ menuItems }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const courses = ['All', 'Starter', 'Main', 'Dessert'];

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

  const filteredItems = filterItemsByCourse(menuItems, selectedCourse);

  const getCourseStats = () => {
    if (selectedCourse === 'All') {
      const starters = menuItems.filter((item) => item.course === 'Starter').length;
      const mains = menuItems.filter((item) => item.course === 'Main').length;
      const desserts = menuItems.filter((item) => item.course === 'Dessert').length;
      return { starters, mains, desserts };
    }
    return null;
  };

  const stats = getCourseStats();

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
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#CCD1D1" />
      <Text style={styles.emptyStateTitle}>{selectedCourse === 'All' ? 'No Menu Items' : `No ${selectedCourse} Items`}</Text>
      <Text style={styles.emptyStateText}>
        {selectedCourse === 'All'
          ? 'Add some dishes to see them here!'
          : `No ${selectedCourse.toLowerCase()} dishes found. Try another category.`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E8B57" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Menu</Text>
        <Text style={styles.headerSubtitle}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Course</Text>
        <View style={styles.pickerContainer}>
          <RNPicker
            selectedValue={selectedCourse}
            onValueChange={(itemValue: string) => setSelectedCourse(itemValue)}
            style={styles.picker}
          >
            {courses.map((c) => (
              <RNPicker.Item
                label={c}
                value={c}
                key={c}
                color={c === selectedCourse ? '#2E8B57' : '#2C3E50'}
              />
            ))}
          </RNPicker>
        </View>
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.statText}>Starters: {stats.starters}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#4ECDC4' }]} />
            <Text style={styles.statText}>Mains: {stats.mains}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#FFD166' }]} />
            <Text style={styles.statText}>Desserts: {stats.desserts}</Text>
          </View>
        </View>
      )}

      {filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  filterSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E8B57',
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

export default FilterScreen;
