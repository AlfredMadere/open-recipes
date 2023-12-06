import { useRouter } from "expo-router";
import {
  Button,
  Card,
  CardProps,
  H1,
  H2,
  Image,
  Paragraph,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { Alert, StyleSheet } from "react-native";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Recipe } from "../interfaces/models";
import { removeDuplicateIds } from "../../helpers";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../AuthContext";
import {Foundation} from "@expo/vector-icons";

export default function Feed() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

    if (!authContext) {
      throw new Error("Feedmust be used within an AuthProvider");
    }
    const { authToken, } = authContext;


  async function getRecipesFeed(): Promise<SearchResult<Recipe>> {
    if (!authToken) {
      throw new Error("No auth token");
    }
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes?use_inventory_of=1",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      },
    );
    // console.log("response.data", response.data);
    return response.data;
  }
  const query = useQuery({
    queryKey: ["recipes_feed"],
    gcTime: 0,
    queryFn: getRecipesFeed,
    refetchOnMount: true,
    enabled: !!authToken, // Only run the query if authToken is not empty
  });

  





  const recipes = removeDuplicateIds(query.data?.recipe || []);
  return (
    <View style={{ width: "100%", height:"100%", backgroundColor:"#EBE7E0"}}>
      <View style={{ padding: 10 , display: "flex", flexDirection: "column", gap: 10}}>
        <Button
          onPress={() => router.push("update-inventory")}
          bordered
          size="$3" // Adjust the size
          color="white" // Set the word color
          backgroundColor="#D7783B"
          //shadowColor="$shadow" // Add a shadow
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          pressStyle={{color: "white", backgroundColor: "#6E6055" }} // Change color on press
          fontFamily="$body" // Set the font family
          fontSize="$4" // Set the font size
          fontWeight="bold" // Make the text bold
        >
          Update Inventory
        </Button>
      </View>
      {query.error && <Text>{JSON.stringify(query.error)}</Text>}
      {query.isFetching && <Spinner size="large" color="$orange10" />}
      <ScrollView style={{ width: "100%" }}>
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
          <View style={{ height: 100 }} />
        </YStack>
      </ScrollView>

      <Foundation.Button name="refresh" size={24} color="#6E6055" backgroundColor="#EBE7E0"
        style={{ width: "12%", alignSelf: "flex-end"}} onPress={() => query.refetch()}/>

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
  const styles = StyleSheet.create({
    circularView: {
      marginTop: 60,
      marginLeft:15,
      width: 200,
      height: 70,
      borderRadius: 5,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
  });

  return (
    <Card elevate size="$4" width={"100%"} height={200} bordered {...props}>
      <Card.Header padded>
        <H2 color="#4B4037">{recipe.name}</H2>
        <Paragraph theme="alt2">{recipe.description}</Paragraph>
      </Card.Header>
      <View style={styles.circularView}>
            <Image
              source={require("../../assets/recipie.png")}
              style={styles.image}
            />
          </View>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          color="#6E6055"
          hoverStyle={{color: "white", backgroundColor: "#D7783B" }} // Change color on hover
          pressStyle={{ color: "white", backgroundColor: "#D7783B" }} // Change color on press
          size="$3" 
          borderRadius="$6" // Round the corners
          onPress={() => {
            router.push(`/recipes/${recipe.id}`);
          }}
        >
          View
        </Button>
      </Card.Footer>
    </Card>
  );
}
