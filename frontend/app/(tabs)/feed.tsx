import { useRouter } from "expo-router";
import { Button, H1, View } from "tamagui";

export default function One() {
  const router = useRouter();
  return (
    <View>
      <H1>Feed Page!</H1>
      <Button style={{ backgroundColor: "red" }}>TAMA WORKS</Button>
    </View>
  );
}
