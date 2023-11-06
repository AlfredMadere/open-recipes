import { useRouter } from "expo-router";
import { Button, H1, View } from "tamagui";
<<<<<<< HEAD
import SearchScreen from "../../components/screens/SearchScreen";
=======
import React from "react";
>>>>>>> af22d79 (List Feature - 1st Sprint)

export default function One() {
  const router = useRouter();
  return (
    <View>
      <SearchScreen></SearchScreen>
    </View>
  );
}
