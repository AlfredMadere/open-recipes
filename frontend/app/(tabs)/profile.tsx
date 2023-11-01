import { useRouter } from "expo-router";
import { Button, H1, View } from "tamagui";

export default function One() {
  const router = useRouter();
  return (
    <View>
      <H1>Profile Page</H1>
      <Button >TAMA WORKS</Button>
    </View>
  );
}
