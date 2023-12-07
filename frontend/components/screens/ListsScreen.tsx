import { StyleSheet } from "react-native";
import { H1, View } from "tamagui";

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
