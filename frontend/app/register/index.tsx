import { Button, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Register = () => {
  return (
    <View>
      <Text>Register</Text>
      <Link href="/login/" asChild>
        <Button title="Open Login Page" />
      </Link>
    </View>
  );
};

export default Register;
