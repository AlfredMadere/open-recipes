import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Spinner } from "tamagui";
import { getValueFor } from "../../helpers/auth";
import { PopulatedRecipe } from "../interfaces/models";

const Register = () => {
  const [authToken, setAuthToken] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const { id } = useGlobalSearchParams();
  console.log("id: ", id);
  async function getRecipe(): Promise<PopulatedRecipe> {
    if (!myId) {
      throw new Error("No id");
    }
    try {
      const response = await axios.get<PopulatedRecipe>(
        `https://open-recipes.onrender.com/recipe-lists`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        },
      );
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recipe", error);
      throw new Error("Error fetching recipe");
    }
  }

  const query = useQuery({
    queryKey: ["recipe", id],
    queryFn: getRecipe,
    enabled: authToken && myId ? true : false, // Only run the query if authToken is not empty
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const authToken = await getValueFor("authtoken");
        const id = await getValueFor("userId");
        if (isMounted) {
          setAuthToken(authToken);
          setMyId(parseInt(id));
        }
      } catch (error) {
        Alert.alert("Error", "Couldn't get auth token...");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const { isLoading, data } = query; // Assuming 'query' is a hook or context providing recipe data

  if (isLoading) {
    return <Spinner size="large" padding={50} />;
  }

  const ingredients = data?.ingredients || []; // Assuming ingredients are stored in an array
  const tags = data?.tags || []; // Assuming tags are stored in an array

  // async function addToList(list_id: number, recipe_id: number) {
  //   axios
  //     .post(
  //       `https://open-recipes.onrender.com/recipe-lists/${list_id}/recipe/${recipe_id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //           Accept: "application/json",
  //         },
  //       },
  //     )
  //     .then(function (response) {
  //       console.log(response, null, 2);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  //   router.push("recipe-lists");
  // }

  // function addToRecipeList(id: string | string[] | undefined) {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.recipeDetails}>
        <Text style={styles.title}>{data?.name}</Text>
        <Text style={styles.infoItem}>Author id: {data?.author_id}</Text>
        <Text style={styles.description}>{data?.description}</Text>

        <View style={styles.info}>
          <Text style={styles.infoItem}>Prep Time: {data?.mins_prep} mins</Text>
          <Text style={styles.infoItem}>Cook Time: {data?.mins_cook} mins</Text>
          <Text style={styles.infoItem}>
            Servings: {data?.default_servings}
          </Text>
        </View>

        <Text style={styles.description}>Procedure: {data?.procedure}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.infoItem}>
              - {ingredient.quantity} {ingredient.unit} {ingredient.name}:
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags:</Text>
          {tags.map((tag, index) => (
            <Text key={index} style={styles.infoItem}>
              - {tag.key}: {tag.value}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ padding: 10 }}>
        <Button
          onPress={() => {
            addToRecipeList(id);
          }}
          size="$4" // Adjust the size
          color="$green" // Set the button color
          borderRadius="$6" // Round the corners
          // shadowColor="$shadow" // Add a shadow
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          hoverStyle={{ backgroundColor: "$green8" }} // Change color on hover
          pressStyle={{ backgroundColor: "$green8" }} // Change color on press
          fontFamily="$body" // Set the font family
          fontSize="$4" // Set the font size
          fontWeight="bold" // Make the text bold
        >
          Add to Recipe List
        </Button>
      </View>

      {data?.author_id == myId ? (
        <View style={{ padding: 10 }}>
          <Button
            onPress={() => {
              deleteRecipe(id);
            }}
            size="$4" // Adjust the size
            color="$red" // Set the button color
            borderRadius="$6" // Round the corners
            // shadowColor="$shadow" // Add a shadow
            shadowRadius={10} // Shadow radius
            elevation={2} // Elevation for a 3D effect
            hoverStyle={{ backgroundColor: "$red8" }} // Change color on hover
            pressStyle={{ backgroundColor: "$red8" }} // Change color on press
            fontFamily="$body" // Set the font family
            fontSize="$4" // Set the font size
            fontWeight="bold" // Make the text bold
          >
            Delete Recipe
          </Button>
        </View>
      ) : (
        ""
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EBE7E0",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recipeDetails: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  info: {
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoItem: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  procedureStep: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Register;
