import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";

function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Lists" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "List Details" }} />
    </Stack>
  );
}

export default _layout;
