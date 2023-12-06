import { useRouter } from "expo-router";
import {
  Button,
  View,
  Circle,
  Stack,
  ScrollView,
  Card,
  Spinner,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";
import { Alert, Text } from "react-native";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import axios from "axios";
import { PopulatedRecipe } from "../interfaces/models";
import { removeDuplicateIds } from "../../helpers";
import * as SecureStore from "expo-secure-store";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";


export default function Profile() {

    const authContext = useContext(AuthContext);
    if (!authContext) {
      throw new Error("AuthContext must be used within an AuthProvider");
    }
    const { authToken, userId } = authContext;

    async function getRecipesFeed(): Promise<SearchResult<PopulatedRecipe>> {
    if (!authToken) {
      throw new Error("No auth token");
    }
    if (!userId) {
      throw new Error("No id");
    }
    //console.log("myId: ", myId)
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes?cursor=0&authored_by=" + userId + "&order_by=name",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );
    // console.log("response.data", response.data);
    return response.data;
  }
  const query = useQuery({
    queryKey: ["recipes_feed"],
    gcTime: 0,
    queryFn: getRecipesFeed,
    enabled: authToken && userId ? true : false, // Only run the query if authToken is not empty
  });

  


  const recipes = removeDuplicateIds(query.data?.recipe || []);



  const username = 'John'


  return (
    <View style={{ width: "100%" }}>
      <View style={{ alignSelf: "center" }}>
        <Stack scale={1.2} marginTop={15}>
          <Circle size={100} backgroundColor="$color" elevation="$4" />
        </Stack>
        <Stack scale={1.2} marginTop={15}>
          <Text>{username}</Text>
        </Stack>
      </View>
      <View style={{ alignSelf: "center" }}>
      <Button
        onPress={() => {
          query.refetch();
        }}
        bordered
        style={{ width: "50%" }}
      >
        Refresh
      </Button>
      </View>
      <View style={{ marginLeft: 10, marginTop: 20, marginBottom: 20 }}>

        <Text>Authored Recipes:</Text>
      </View>
      {query.error && <Text>{JSON.stringify(query.error)}</Text>}
      {query.isFetching && <Spinner size="large" color="$orange10" />}
      <ScrollView style={{ width: "100%", paddingBottom: 500 }}>
        <YStack
          $sm={{
            flexDirection: "column",
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          paddingHorizontal="$4"
          space
        >
          {recipes.map((recipe) => {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          })}
          <View style={{ height: 300 }} />
        </YStack>
      </ScrollView>
      <View style={{ height: 200 }} />
    </View>
  );
}


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

export function RecipeCard(props: RecipeCardProps) {
  const recipe = props.recipe;
  const router = useRouter();

  function goToRecipe(id: number) {
    router.push(`/recipes/${id}`);
  }

  return (
    <Card elevate size="$4" width={"100%"} height={70} bordered {...props}>
      <Card.Header padded width={'83%'}>
        <Text>{recipe.name}</Text>
        <XStack width={'83%'}>
          <Paragraph theme="alt2">{recipe.description}</Paragraph>
        </XStack>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          borderRadius="$10"
          onPress={() => {
            goToRecipe(recipe.id)
          }}
        >
          View
        </Button>
      </Card.Footer>
    </Card>
  );
}
