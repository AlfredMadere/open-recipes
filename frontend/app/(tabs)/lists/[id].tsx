import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, FlatList, Button } from "react-native";
import { View, Card, XStack, Stack, Spinner, ScrollView } from "tamagui";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BaseRecipe, PopulatedRecipeList } from "../../../components/create-recipe-types/create-recipe-helper";

export default function Page() {
  const { id } = useLocalSearchParams();
  // const [recipes, setRecipes] = useState([]);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { authToken } = authContext;


  
  const fetchDataFromBackend = async (): Promise<PopulatedRecipeList> => {
    try {
      console.log("id")
      const response = await axios.get(
        `https://open-recipes.onrender.com/recipe-lists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
      console.log("response.data recipe-lists", response.data);
      return response.data
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw new Error("Error fetching data");
    }
  };

  const query = useQuery({
    queryKey: ["recipe_list", id],
    queryFn: fetchDataFromBackend,
    enabled: !!authToken,
  });



  console.log("query.data", query?.data?.recipes);
  return (
    <View style={{ width: "100%", flex: 1 }}>
      {query.isFetching && (
        <Spinner style={{ alignSelf: "center", marginTop: 20 }} size="large" />
      )}
      <View style={{ display: "flex", width: "100%", alignItems: "center" }}>
        {query.data != null && (
          <RecipeComponent recipes={query?.data.recipes || []} />
        )}
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RecipeComponent = ({ recipes }: { recipes: BaseRecipe[] }) => {
  return (
    <ScrollView style={{ height: "100%", width: "100%" }}>
      <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <View style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "center" }}>
          <View style={{height: "10px"}}></View>
          {recipes?.map((recipe: BaseRecipe) => {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          })}
        </View>
      </View>
           </ScrollView>
  )
};

export function RecipeCard(props: RecipeCardProps) {
  const recipe = props.recipe;
  const router = useRouter();

  return (
    <Card elevate size="4" width={305} height={120} bordered {...props}>
      <Card.Header padded>
        <Text style={{ fontWeight: "bold" }}>{recipe.name}</Text>
      </Card.Header>
      <Stack margin={20}>
        <Text style={{ fontSize: 12, height: 20}}>{recipe.description}</Text>
      </Stack>

      <Card.Footer padded>
        <XStack flex={1} maxWidth={1} />
        <Button
          title="View"
          onPress={() => {
            router.push(`/recipes/${recipe.id}`);
          }}
        />
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
};
