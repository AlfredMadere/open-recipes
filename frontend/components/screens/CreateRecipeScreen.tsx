import { StyleSheet } from "react-native";
import { H1, Paragraph, View } from "tamagui";

export default function CreateRecipeScreen() {
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
        This page should have a bunch of form inputs on it and a submit button
        at the bottom
      </Paragraph>
    </View>
  );
}
