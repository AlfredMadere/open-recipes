import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

import * as SecureStore from "expo-secure-store";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

function LoginPage() {
  const router = useRouter();
  const [isSignUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [toggle, setToggle] = useState(false);
  const [key, onChangeKey] = React.useState("authtoken");
  const [value, onChangeValue] = React.useState("Your value here");

  const handleSignUp = async () => {
    //alert("name: " + username + " password: " + password + " email: " + email + " phone: " + phone);

    try {
      if (
        name.length > 0 &&
        password.length > 0 &&
        email.length > 0 &&
        phone.length > 0
      ) {
        const response = await axios.post(
          "https://open-recipes.onrender.com/auth/sign-up",
          {
            name: name,
            email: email,
            phone: phone,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        //alert("response: " + response.status);

        if (response.status === 200 || response.status === 201) {
          // Registration successful, redirect to login
          setSignUp(false);
          //alert("successfull sign in");
        } else {
          throw new Error("Registration failed");
        }
      } else {
        throw new Error("Please fill out all fields");
      }
    } catch (error) {
      console.error("Sign Up failed:");
      alert("Registration failed. Please try again, kitten!");
    }
  };

  const handleLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        const response = await axios.post(
          "https://open-recipes.onrender.com/auth/token",
          `grant_type=&username=${encodeURIComponent(
            email,
          )}&password=${encodeURIComponent(
            password,
          )}&scope=&client_id=&client_secret=`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        if (response.status === 200) {
          const authToken = response.data.access_token;
          // Save the auth token
          save(key, authToken);

          const results = await axios.get(
            "https://open-recipes.onrender.com/users/me/",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
              },
            },
          );

          save("userId", results.data.id);

          // Redirect to the profile page or wherever you need to go
          router.push("/profile");
          alert("success, redirecting to profile right now");
        } else {
          throw new Error("Authentication failed");
        }
      } else {
        alert("Please fill out all fields");
      }
    } catch (error) {
      console.error("Login failed:");
      alert("Authentication failed. Please try again, kitten!");
    }
  };

  const renderLoginForm = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text style={styles.label}>password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSignUp(true)}>
        <Text style={styles.toggleText}>Dont have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignUpForm = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.label}>name</Text>
      <TextInput
        style={styles.input}
        placeholder="name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <Text style={styles.label}>password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Text style={styles.label}>email</Text>
      <TextInput
        style={styles.input}
        placeholder="email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        secureTextEntry
      />
      <Text style={styles.label}>phone number</Text>
      <TextInput
        style={styles.input}
        placeholder="phone"
        onChangeText={(text) => setPhone(text)}
        value={phone}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSignUp(false)}>
        <Text style={styles.toggleText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );

  return isSignUp ? renderSignUpForm() : renderLoginForm();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "grey",
    alignSelf: "flex-start",
    marginLeft: 40,
    marginBottom: 4,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    color: "blue",
  },
});

export default LoginPage;
