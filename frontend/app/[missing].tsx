import { Link, usePathname } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Page() {
  const pathname = usePathname();
  return (
    <View>
      <Text style={{ fontSize: 20 }}>404: Not found!</Text>
      <Text>Path name: {pathname}</Text>
      <Link href="/" asChild>
        <Button title="Go back" />
      </Link>
    </View>
  );
}
