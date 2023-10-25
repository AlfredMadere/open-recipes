import { Button, H1, Paragraph, Text, View } from "tamagui";
import { StyleSheet } from "react-native";

export default function HomeScreen({navigation}) {

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
      <H1>Welcome 307 Team!</H1>
      <Paragraph>
        This we will be using tamagui I made A COOL CHANFEwhich makes front end YOOOO development hella
        easy and good looking. Use the tamagui components!
      </Paragraph>
      <Button
        onPress={() => navigation.navigate("Details")}
      >
        <Text>Go to Details</Text>
      </Button>
        
    </View>
  );
}
