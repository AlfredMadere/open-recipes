import { useLocalSearchParams, useRouter } from "expo-router";
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
    if(id) {
      console.log('The value of id is:', id);
      fetchDataFromBackend();
    } else {
      console.log('No id found.');
    }}, []);


  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(`https://open-recipes.onrender.com/recipe-lists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('Response Data:', data);
      const {recipes} = data;
      console.log('Recipes:', recipes);
      setRecipes(recipes);
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
}; 

