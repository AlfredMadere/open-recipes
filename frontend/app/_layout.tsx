import {Stack, useRouter } from "expo-router";
import HomeScreen from "../components/screens/HomeScreen";
import { Button } from "react-native";

const StackLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Home'}}/>
      <Stack.Screen name="register/index" options={{
        title: 'Register', headerRight: () => (
        <Button title="Login" onPress={() => {router.push('/login')}} />
      )}}/>
      <Stack.Screen name="login" options={{title: 'Login Modal', presentation: 'modal'}}/>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      <Stack.Screen name="[missing]" options={{title: '404'}}/>
    </Stack>
  )
}

export default StackLayout