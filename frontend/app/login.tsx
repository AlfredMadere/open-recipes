import React, { useContext, useState } from "react";
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
import { getValueFor } from "../helpers/auth";
import { AuthContext } from "./AuthContext";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

function LoginPage() {
  const router = useRouter();
  const [isSignUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const authProvider = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [toggle, setToggle] = useState(false);
  const [key, onChangeKey] = React.useState("authtoken");
  const [value, onChangeValue] = React.useState("Your value here");

  if (!authProvider) {
    throw new Error("authProvider is not defined");
  }

  const { authToken, setAuthToken, userId, setUserId, userName, setUserName } = authProvider;

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
          console.log("about to storer auth token", authToken);
          console.log("type of auth token", typeof authToken);
          await save(key, authToken);

          const results = await axios.get(
            "https://open-recipes.onrender.com/users/me/",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
              },
            },
          );
          
          console.log("results.data: ", results.data);
          await save("userName", `${results.data.name}`);
          await save("userId", `${results.data.id}`);
          authProvider.setAuthToken(authToken);
          authProvider.setUserId(results.data.id);
          authProvider.setUserName(results.data.name);

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
      <Text style={styles.label}>Password</Text>
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
        <View style={{flexDirection: "row", marginTop: 15}}>
        <Text style={styles.toggleText}>Dont have an account? Sign Up</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSignUpForm = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        onChangeText={(text) => setPhone(text)}
        value={phone}
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
    backgroundColor: "#EBE7E0",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color:"#4B4037",
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "#6E6055",
    alignSelf: "flex-start",
    marginLeft: 40,
    marginBottom: 4,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#6E6055",
    backgroundColor: "white",
    color: "#6E6055",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: "#D7783B",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    color: "#D7783B",
  },
  
});

export default LoginPage;
