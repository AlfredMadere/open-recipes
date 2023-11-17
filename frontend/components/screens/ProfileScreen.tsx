import {
  Button,
  H1,
  Paragraph,
  Text,
  View,
  Circle,
  SizableText,
} from "tamagui";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
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
      <H1>Profile Screen!</H1>
    </View>
  );
}
