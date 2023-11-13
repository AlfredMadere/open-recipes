import { Button, H1, Paragraph, Text, View } from "tamagui";
import { StyleSheet } from "react-native";
import HomeIcon from "../icons/HomeIcon";

export default function HomeScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <HomeIcon />

      <View></View>
      <H1>Welcome 307 Team!!!!!!</H1>
      <Paragraph>
        This we will be using tamagui I made A COOL CHANFEwhich makes front end
        YOOOO development hella easy and good looking. Use the tamagui
        components!
      </Paragraph>
    </View>
  );
}
