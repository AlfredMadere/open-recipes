import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "./tamagui.config";
import { H1, Button, Paragraph} from "tamagui";

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <View style={styles.container}>
        <H1>Welcome 307 Team!</H1>
        <Paragraph>This we will be using tamagui which makes front end development hella easy and good looking. Use the tamagui components!</Paragraph>
        <Button>
          <Text>Look how easy it is to make buttons</Text>
        </Button>
      </View>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
