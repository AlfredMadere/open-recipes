import { useRouter } from "expo-router";
import { Button, H1, Text, View } from "tamagui";

export default function Page() {
  const router = useRouter();
  return (
    <View>
      <H1>Create Recipe!</H1>
      <Button style={{ backgroundColor: "red" }}>TAMA WORKS</Button>
    </View>
    // <TamaView>
    //   <TamaText style={{ fontSize: 20 }}>Create Recipe Page!</TamaText>
    //   <TamaButton>
    //     <TamaText> Tama works!</TamaText>
    //   </TamaButton>
    // </TamaView>
  );
}
