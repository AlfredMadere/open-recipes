import { useRouter } from "expo-router";
import {
  Button,
  View,
  Stack,
  ScrollView,
  Card,
  Spinner,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";
import { Text, Image, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { PopulatedRecipe } from "../interfaces/models";
import { removeDuplicateIds } from "../../helpers";

import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import {
  Foundation,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function Profile() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { authToken, userId, userName } = authContext;

  async function getRecipesFeed(): Promise<SearchResult<PopulatedRecipe>> {
    if (!authToken) {
      throw new Error("No auth token");
    }
    if (!userId) {
      throw new Error("No id");
    }
    //console.log("myId: ", myId)
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes?cursor=0&authored_by=" +
        userId +
        "&order_by=name",
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
    queryKey: ["recipes_search"],
    gcTime: 0,
    queryFn: getRecipesFeed,
    enabled: authToken && userId ? true : false, // Only run the query if authToken is not empty
  });

  const styles = StyleSheet.create({
    circularView: {
      width: 150,
      height: 150,
      borderRadius: 75, // half of width or height to make it circular
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "#D7783B",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
  });

  const recipes = removeDuplicateIds(query.data?.recipe || []);

  return (
    <View style={{ width: "100%", backgroundColor: "#EBE7E0" }}>
      <Foundation.Button
        name="refresh"
        size={26}
        color="#6E6055"
        backgroundColor={"#EBE7E0"}
        style={{
          width: "100%",
          alignSelf: "flex-start",
          backgroundColor: "#EBE7E0",
        }}
        onPress={() => {
          query.refetch();
        }}
      />

      <View style={{ alignSelf: "center" }}>
        <Stack scale={1.2} marginTop={15}>
          <View style={styles.circularView}>
            <Image
              source={require("../../assets/hdken.png")}
              style={styles.image}
            />
          </View>
        </Stack>

        <Stack scale={1.2} marginTop={15}>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: "18",
              color: "#4B4037",
            }}
          >
            {userName}
          </Text>
          <Text> </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AntDesign name="instagram" size={22} color="#6E6055" />
            <MaterialCommunityIcons name="snapchat" size={22} color="#6E6055" />
            <FontAwesome5 name="user-friends" size={22} color="#6E6055" />
          </View>
        </Stack>
      </View>

      <View style={{ marginLeft: 10, marginTop: 20, marginBottom: 20 }}>
        <Text
          style={{ fontSize: "18", justifyContent: "center", color: "#6E6055" }}
        >
          Authored Recipes:
        </Text>
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
      <Card.Header padded width={"83%"}>
        <Text style={{ fontWeight: "bold", color: "#4B4037" }}>
          {recipe.name}
        </Text>
        <XStack width={"83%"}>
          <Paragraph theme="alt2">{recipe.description}</Paragraph>
        </XStack>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          borderRadius="$6" // Round the corners
          size="$3"
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          color="#6E6055"
          hoverStyle={{ color: "white", backgroundColor: "#D7783B" }} // Change color on hover
          pressStyle={{ color: "white", backgroundColor: "#D7783B" }} // Change color on press
          onPress={() => {
            goToRecipe(recipe.id);
          }}
        >
          View
        </Button>
      </Card.Footer>
    </Card>
  );
}
