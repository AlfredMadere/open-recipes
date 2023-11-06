import { useRouter } from "expo-router";
import React, {useState} from 'react';
import {Button, View, Text, StyleSheet } from 'react-native';
import Table from '../../components/table'
import Form from '../../components/form';
import { Link } from 'expo-router';

export default function Page() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  return (
    <View style={styles.container}>
    <View style={styles.content}>
      <Form />
    </View>
    <View style={styles.buttonContainer}>
      <Button title="Cancel" color="red" />
      <Button title="Create" color="green" />
    </View>
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
});