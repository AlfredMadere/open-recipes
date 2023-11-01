import { Button, H1, Paragraph, Text, View } from "tamagui";
import { StyleSheet } from "react-native";

export default function SearchScreen() {
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
      <H1>Search!</H1>
    </View>
  );
}
