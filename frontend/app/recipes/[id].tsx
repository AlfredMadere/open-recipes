import { Text, View } from "react-native";
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
    <View>
      {query.isLoading && <Spinner />}
      <H1>{query.data?.name}</H1>
      <Text>{JSON.stringify(query.data)}</Text>
    </View>
  );
};

export default Register;
