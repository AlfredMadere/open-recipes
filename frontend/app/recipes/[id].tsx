import { Text, View, StyleSheet, ScrollView, Alert, Modal } from "react-native";
import React, { useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { H1, Spinner, Button, Stack, Card, XStack, Paragraph, YStack } from "tamagui";
import { PopulatedRecipe, Ingredient, Tag } from "../interfaces/models";
import { useState } from "react";
import { getValueFor } from "../../helpers/auth";
import { removeDuplicateIds } from "../../helpers";
import * as SecureStore from "expo-secure-store";


const Register = () => {
  const [visible, setVisible] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { id } = useGlobalSearchParams();
  //console.log("id: ", id);
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
        }
      );
      //console.log("response.data", response.data);
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

  async function deleteRecipe(id: string | string[] | undefined) {
    await axios
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
    router.push("profile");
  }

  function addToRecipeList(id: string | string[] | undefined) {
    setVisible(true);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <RecipeListModal visible={visible} setVisible={setVisible}/>

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












type recipeModalInputs = {
  setVisible: (visible: boolean) => null,
  visible: boolean;
}

function RecipeListModal(params: recipeModalInputs) {
  const {setVisible, visible} = params;

  const router = useRouter();
  const [authToken, setAuthToken] = useState("");
  const [myId, setMyId] = useState<number | null >(null);
  const queryClient = useQueryClient();

  async function getValueFor(key: string) {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      throw new Error(`No values stored under ${key}.`);
    }
  }

  async function getRecipesFeed(): Promise<SearchResult<PopulatedRecipe>> {
    if (!authToken) {
      throw new Error("No auth token");
    }
    if (!myId) {
      throw new Error("No id");
    }
    //console.log("myId: ", myId)
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipe-lists",
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
    enabled: authToken && myId ? true : false, // Only run the query if authToken is not empty
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const authToken = await getValueFor("authtoken");
        const id = await getValueFor('userId');
        console.log('id: ', id)
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


  console.log('response data: ', query)
  const recipes = removeDuplicateIds(query.data?.recipe || []);
  
  return (
    <View style={{ alignSelf: "flex-end" }}>
      <Stack scale={1.2} marginTop={15}>
        <Modal
          animationType="none"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setVisible(!visible);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                margin: 20,
                backgroundColor: "white",
                height: 550,
                width: 335,
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      Add to List
                    </Text>
                  </View>

                  <View style={{ height: 300, paddingTop: 400 }}>
                    
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
            function addRecipetoRecipelist(id: any) {
              throw new Error("Function not implemented.");
            }

            return (
            
            <Card key={recipe.id} elevate size="$4" width={"100%"} height={70} bordered >
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
                  addRecipetoRecipelist(recipe.id)
                }}
              >
                View
              </Button>
            </Card.Footer>
          </Card>
          );
          })}
        </YStack>
      </ScrollView>
      <View style={{ height: 200 }} />
    </View>
                    <View style={{ padding: 3 }}>
                

                    <Button onPress={() => {setVisible(!visible);}} color="red">Close</Button>
                    </View>
                  </View>
              </View>
          </View>
        </Modal>

        <Button
          onPress={() => {
            setVisible(true);
          }}
          color="blue"
        />
      </Stack>
    </View>
  );
}



export default Register;



