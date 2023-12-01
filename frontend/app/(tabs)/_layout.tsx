import { Tabs } from "expo-router";
import { View } from "react-native";

function _layout() {
  return (
    // If login is successful, show the Tabs
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{ tabBarLabel: "Feed", headerTitle: "Feed" }}
      />
      <Tabs.Screen
        name="search"
        options={{ tabBarLabel: "Search", headerTitle: "Search" }}
      />
      <Tabs.Screen
        name="create-recipe"
        options={{ tabBarLabel: "Create", headerTitle: "Create Recipe" }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          tabBarLabel: "Lists",
          headerTitle: "Lists",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarLabel: "Profile", headerTitle: "Profile " }}
      />
    </Tabs>
  );
}

export default _layout;
