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

export default function Feed() {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function getRecipesFeed(): Promise<SearchResult<Recipe>> {
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes"
    );
    console.log("response.data", response.data);
  

    return response.data;
  }
  const query = useQuery({
    queryKey: ["recipes_feed"],
    queryFn: getRecipesFeed,
  });

  // const recipes = [
  //   {
  //     name: "Epic Recipe 1",
  //     description: "Super delicious recipe",
  //     id: 1,
  //     mins_prep: 20,
  //     mins_cook: 30,
  //     category_id: 1,
  //     author_id: 1,
  //     created_at: "2022-01-01 00:00:00",
  //     procedure: "Make it",
  //     default_servings: 1,
  //   },
  //   {
  //     name: "Epic Recipe 2",
  //     description: "ANOTHER AMAXZONG Super delicious recipe",
  //     id: 2,
  //     mins_prep: 20,
  //     mins_cook: 30,
  //     category_id: 1,
  //     author_id: 1,
  //     created_at: "2022-01-01 00:00:00",
  //     procedure: "Make it",
  //     default_servings: 1,
  //   },
  //   {
  //     name: "Epic Recipe",
  //     description: "Super delicious recipe",
  //     id: 3,
  //     mins_prep: 20,
  //     mins_cook: 30,
  //     category_id: 1,
  //     author_id: 1,
  //     created_at: "2022-01-01 00:00:00",
  //     procedure: "Make it",
  //     default_servings: 1,
  //   },
  // ];
  return (
    <View style={{ width: "100%" }}>
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
          {query.data?.recipe.map((recipe) => {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          })}
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
