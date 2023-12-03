import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from @expo/vector-icons

function _layout() {
  return (
    // If login is successful, show the Tabs
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{
          tabBarLabel: "Feed",
          headerTitle: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={30} color={color} /> // Change the icon here
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          headerTitle: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={30} color={color} /> // Change the icon here
          ),
        }}
      />
      <Tabs.Screen
        name="create-recipe"
        options={{
          tabBarLabel: "Create",
          headerTitle: "Create Recipe",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create" size={30} color={color} /> // Change the icon here
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          tabBarLabel: "Lists",
          headerTitle: "Lists",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={30} color={color} /> // Change the icon here
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          headerTitle: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-person" size={30} color={color} /> // Change the icon here
          ),
        }}
      />
    </Tabs>
  );
}

export default _layout;
