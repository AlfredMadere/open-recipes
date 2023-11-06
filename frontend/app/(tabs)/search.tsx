import { useRouter } from "expo-router";
import { Button, H1, View } from "tamagui";
import SearchScreen from "../../components/screens/SearchScreen";

export default function One() {
  const router = useRouter();
  return (
    <View>
      <SearchScreen></SearchScreen>
    </View>
  );
}
