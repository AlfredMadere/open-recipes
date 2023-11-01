import { Button, H1, Paragraph, Text, View } from "tamagui";
import { StyleSheet } from "react-native";

export default function ListsScreen() {
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
      <H1>Lists Screen!</H1>
    </View>
  );
}
