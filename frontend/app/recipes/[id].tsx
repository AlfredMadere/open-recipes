import { Text, View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import axios from "axios";
import { H1, Spinner } from "tamagui";
import { Recipe } from "../interfaces/models";

const Register = () => {
  const queryClient = useQueryClient();
  const { id } = useGlobalSearchParams();
  async function getRecipe(): Promise<Recipe> {
    const response = await axios.get(
      `https://open-recipes.onrender.com/recipes/${id}`,
    );
    console.log("response.data", response.data);
    return response.data;
  }
  const query = useQuery({ queryKey: ["recipe", id], queryFn: getRecipe });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.recipeDetails}>
        <Text style={styles.title}>{query.data?.name}</Text>
        <Text style={styles.description}>{query.data?.description}</Text>
        <View style={styles.info}>
          <Text style={styles.infoItem}>Prep Time: {query.data?.mins_prep} mins</Text>
          <Text style={styles.infoItem}>Cook Time: {query.data?.mins_cook} mins</Text>
          <Text style={styles.infoItem}>Servings: {query.data?.default_servings}</Text>
        </View>
        <Text style={styles.infoItem}>Procedure:</Text>
        <Text style={styles.procedure}>{query.data?.procedure}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  recipeDetails: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  info: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  procedure: {
    fontSize: 18,
  },
});

type RecipeCardProps = {
  recipe: {
    name: string;
    description: string;
    id: number;
    mins_prep: number;
    mins_cook: number;
    category_id: number;
    author_id: number;
    created_at: string;
    procedure: string;
    default_servings: number;
  };
};

export default Register;
