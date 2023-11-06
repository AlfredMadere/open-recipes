import { useRouter } from "expo-router";
import { Button, H1, View } from "tamagui";
import React from "react";

export default function One() {
  const router = useRouter();
  return (
    <View>
      <H1>Search Page !</H1>
      <Button style={{ backgroundColor: "red" }}>TAMA WORKS</Button>
    </View>
  );
}
