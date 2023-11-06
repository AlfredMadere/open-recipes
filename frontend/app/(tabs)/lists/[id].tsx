import { useLocalSearchParams, Stack } from "expo-router";
import { Button, Text, View } from "react-native";
import React from "react";

export default function Page() {
  const {id} = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options = {{ headerTitle: ""}}/>
      <Text style={{ fontSize: 20 }}>Recipe #1: ...</Text>
      <Text></Text>
      <Text style={{ fontSize: 20 }}>Recipe #2: ...</Text>
      <Text></Text>
      <Text style={{ fontSize: 20 }}>Recipe #3: ...</Text>
      <Text></Text>
      <Text style={{ fontSize: 20 }}>Recipe #4: ...</Text>
      <Text></Text>
      <Text style={{ fontSize: 20 }}>Recipe #5: ...</Text>
    </View>
  );
}