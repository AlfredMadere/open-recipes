import { Tabs } from "expo-router";
import { View } from "react-native";

function _layout() {
  return ( 
    <Tabs>
      <Tabs.Screen name="one" options={{tabBarLabel: "One", headerTitle: "One"}} />
      <Tabs.Screen name="two" options={{tabBarLabel: "Two", headerTitle: "Two"}} />
      </Tabs>
   );
}

export default _layout;
  
