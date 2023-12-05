import { Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { router, useGlobalSearchParams } from "expo-router";
import axios from "axios";
import { H1, Spinner, Button } from "tamagui";
import { PopulatedRecipe, Ingredient, Tag} from "../interfaces/models";
import { useState } from "react";
import { getValueFor } from "../../helpers/auth";

const Register = () => {
  const [authToken, setAuthToken] = useState("");
  const [myId, setMyId] = useState<number | null >(null);
  const queryClient = useQueryClient();
  const { id } = useGlobalSearchParams();
  console.log("id: ", id);
  async function getRecipe(): Promise<PopulatedRecipe> {
    if (!myId) {
      throw new Error("No id");
    }
    try {

      const response = await axios.get<PopulatedRecipe>(
        `https://open-recipes.onrender.com/recipes/${id}`, 
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
<<<<<<< HEAD
    queryKey: ["recipe", id],
    queryFn: getRecipe,
    enabled: !!authToken, // Only run the query if authToken is not empty
=======
    queryKey: ["recipe", id], queryFn: getRecipe, enabled: authToken && myId ? true : false, // Only run the query if authToken is not empty
>>>>>>> e5cd77f (profile and recipe progress)
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const authToken = await getValueFor("authtoken");
        const id = await getValueFor('userId');
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

  async function deleteRecipe(id: string | string[] | undefined) {
    console.log(`https://open-recipes.onrender.com/recipes/${id}`)
    axios
      .delete(`https://open-recipes.onrender.com/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      })
      .then(function (response) {
        console.log(response, null, 2);
      })
      .catch(function (error) {
        console.log(error);
      });
  }



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
              - {ingredient.name}: {ingredient.quantity}              
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
      
      {data?.author_id == myId ? 
      
      (<View style={{padding: 10}}>
        <Button
          onPress={() => {deleteRecipe(id)}}
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
      </View>)
      
      : ""}

      <View style={{ height: 200 }} />
      


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingTop: 40,
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
