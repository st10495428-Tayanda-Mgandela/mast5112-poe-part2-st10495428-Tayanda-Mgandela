import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import AddMenuScreen from './src/screens/AddMenuScreen';
import FilterScreen from './src/screens/FilterScreen';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  course: string;
  price: number;
}

export type RootStackParamList = {
  Home: undefined;
  AddMenu: undefined;
  Filter: undefined;
};

export const calculateAveragePrices = (items: MenuItem[]) => {
  const courses = ['Starter', 'Main', 'Dessert'];
  const averages: { [key: string]: number } = {};

  courses.forEach((course) => {
    const courseItems = items.filter((item) => item.course === course);
    if (courseItems.length > 0) {
      const sum = courseItems.reduce((acc, item) => acc + item.price, 0);
      averages[course] = sum / courseItems.length;
    } else {
      averages[course] = 0;
    }
  });

  return averages;
};

export const filterItemsByCourse = (items: MenuItem[], course: string) => {
  if (course === 'All') return items;
  return items.filter((item) => item.course === course);
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: 'Garden Salad',
      description: 'Fresh seasonal greens with balsamic vinaigrette',
      course: 'Starter',
      price: 12.5,
    },
    {
      id: 2,
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with roasted vegetables',
      course: 'Main',
      price: 28,
    },
    {
      id: 3,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with vanilla ice cream',
      course: 'Dessert',
      price: 10.5,
    },
  ]);

  const removeMenuItem = (id: number) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2E8B57',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" options={{ title: "Chef's Menu" }}>
          {(props) => (
            <HomeScreen
              {...props}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              removeMenuItem={removeMenuItem}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AddMenu" options={{ title: 'Add New Dish' }}>
          {(props) => (
            <AddMenuScreen
              {...props}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Filter" options={{ title: 'Filter Menu' }}>
          {(props) => (
            <FilterScreen
              {...props}
              menuItems={menuItems}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
