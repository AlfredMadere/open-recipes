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
import { Alert } from "react-native";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Recipe } from "../interfaces/models";
import { removeDuplicateIds } from "../../helpers";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";




export default function Feed() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState("");
  const queryClient = useQueryClient();

  async function getValueFor(key: string) {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      throw new Error(`No values stored under ${key}.`);
    }
  }

  async function getRecipesFeed(): Promise<SearchResult<Recipe>> {
    if (!authToken) {
      throw new Error("No auth token");
    }
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes",
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
    queryFn: getRecipesFeed,
    enabled: !!authToken, // Only run the query if authToken is not empty
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const authToken = await getValueFor("authtoken");
        if (isMounted) {
          setAuthToken(authToken);
        }
      } catch (error) {
        Alert.alert("Error", "Couldn't get auth token...");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);


  const recipes = removeDuplicateIds(query.data?.recipe || []);
  return (
    <View style={{ width: "100%" }}>
      <View style={{padding: 10}}>
        <Button
          onPress={() => router.push("update-inventory")}
          size="$4" // Adjust the size
          color="$blue10" // Set the button color
          borderRadius="$6" // Round the corners
          // shadowColor="$shadow" // Add a shadow
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          hoverStyle={{ backgroundColor: "$blue8" }} // Change color on hover
          pressStyle={{ backgroundColor: "$blue12" }} // Change color on press
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

  return (
    <Card elevate size="$4" width={"100%"} height={300} bordered {...props}>
      <Card.Header padded>
        <H2>{recipe.name}</H2>
        <Paragraph theme="alt2">{recipe.description}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          borderRadius="$10"
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
