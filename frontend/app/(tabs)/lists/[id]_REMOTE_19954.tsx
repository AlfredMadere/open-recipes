import { useRouter } from "expo-router";
import {
  Button,
  H1,
  View,
  Circle,
  Stack,
  ScrollView,
  Card,
  Spinner,
  H2,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";
import { Text, FlatList } from "react-native";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { FlatGrid } from "react-native-super-grid";
import axios from "axios";
import { Recipe } from "../interfaces/models";
import { removeDuplicateIds } from "../../helpers";

export default function One() {
  const router = useRouter();

  const username = "AlfredRocks33";

  async function getRecipesFeed(): Promise<SearchResult<Recipe>> {
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes",
    );
    return response.data;
  }
  const query = useQuery({
    queryKey: ["authored_recipes"],
    queryFn: getRecipesFeed,
  });

  const recipes = removeDuplicateIds(query.data?.recipe || []);

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
      <View style={{ marginLeft: 10, marginTop: 20, marginBottom: 20 }}>
        <Text>Authored Recipes:</Text>
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
        </YStack>
      </ScrollView>
    </View>
  );
}

//DO NOT USE THIS SYNTAX, used any to pass eslint for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any

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
    <Card elevate size="$4" width={"100%"} height={70} bordered {...props}>
      <Card.Header padded>
        <Text>{recipe.name}</Text>
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

/*import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Text,
  FlatList,
  Button,
} from "react-native";
import { View, Stack, Card, XStack } from "tamagui";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { id } = useLocalSearchParams();
  const [recipes, setRecipes] = useState([]);


  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(`https://open-recipes.onrender.com/recipe-lists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View style={{ flex: 1, marginVertical: 20 }}>
      <Text>Recipes</Text>
        <View style={{ flex: 1 }}>
          <RecipeComponent data={recipes} />
        </View>
      </View>
    </View>
  );
}

const RecipeComponent = ({ data }: any) => {
  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginLeft: 45,
          marginRight: 45,
          marginTop: 20,
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        paddingHorizontal="$4"
        space>
          {
                data.map((recipe) => {
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                    />
                  );
                })
              }
        </View>
      )}
    />
  );
};

export function RecipeCard(props: RecipeCardProps) {
  const recipe = props.recipe
  const router = useRouter();

  return (
    <Card
      elevate
      size="4"
      width={120}
      height={120}
      bordered
      {...props}
    >
      <Card.Header padded>
        <Text>{recipe.name}</Text>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button title="View" onPress={() => {router.push(`/recipes/${recipe.id}`)}}/>
      </Card.Footer>
    </Card>
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
}; */