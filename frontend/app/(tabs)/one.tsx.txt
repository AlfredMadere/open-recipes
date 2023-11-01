import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function One() {
  const router = useRouter();
  return (
    <View>
      <Text style={{fontSize: 20}}>One</Text>
      <Button title="Go back" onPress={() => router.back()} />
    </View>
    
  );
}