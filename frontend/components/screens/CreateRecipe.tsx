import { Button, H1, Paragraph, Text, View } from "tamagui";
import { StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
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
      <H1>Create Recipe Page</H1>
      <Paragraph>
       This page shoul have a bunch of form inputs on it and a submit button at the bottom
      </Paragraph>
    </View>
  );
}
