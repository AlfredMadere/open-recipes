import { Text, View, StyleSheet, ScrollView, Alert, Modal } from "react-native";
import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import {
  H1,
  Spinner,
  Button,
  Stack,
  Card,
  XStack,
  Paragraph,
  YStack,
} from "tamagui";
import { PopulatedRecipe, Ingredient, Tag, RecipeList } from "../interfaces/models";
import { useState } from "react";
import { getValueFor } from "../../helpers/auth";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../AuthContext";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
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
  const recipe_id = data?.id;
  if (!recipe_id) {
    return (
      <View>
        <Text>Recipe not found</Text>
      </View>
     )
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RecipeListModal visible={visible} setVisible={setVisible} recipe_id={recipe_id}/>

      <View style={styles.recipeDetails}>
        <Text style={styles.title}>{data?.name}</Text>

        <Text style={styles.description}>{data?.description}</Text>

        <View style={styles.info}>
          <Text style={styles.infoItem}>Prep Time: {data?.mins_prep} mins</Text>
          <Text style={styles.infoItem}>Cook Time: {data?.mins_cook} mins</Text>
          <Text style={styles.infoItem}>
            Servings: {data?.default_servings}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.descriptionHeader}>Procedure:</Text>
          <Text style={styles.description}>{data?.procedure}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.descriptionHeader}>Ingredients:</Text>
          {ingredients?.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientsItem}>
              - {ingredient.quantity} {ingredient.unit} {ingredient.name}:
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.descriptionHeader}>Tags:</Text>
          {tags?.map((tag, index) => (
            <Text key={index} style={styles.ingredientsItem}>
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
          color="white" // Set the button color
          backgroundColor="$green10"
          borderRadius="$6" // Round the corners
          // shadowColor="$shadow" // Add a shadow
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          hoverStyle={{ backgroundColor: "green" }} // Change color on hover
          pressStyle={{ backgroundColor: "green" }} // Change color on press
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
            color="white" // Set the button color
            borderRadius="$6" // Round the corners
            backgroundColor= "$red10"
            // shadowColor="$shadow" // Add a shadow
            shadowRadius={10} // Shadow radius
            elevation={2} // Elevation for a 3D effect
            hoverStyle={{ backgroundColor: "red" }} // Change color on hover
            pressStyle={{ backgroundColor: "red" }} // Change color on press
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
    color:"#4B4037",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color:"#6E6055",
    marginBottom: 10,
    marginTop: 10,
  },
  descriptionHeader: {
    fontSize: 18,
    color:"#4B4037",
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  info: {
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoItem: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color:"#4B4037",
  },
  ingredientsItem: {
    fontSize: 16,
    marginTop: 5,
    color:"#6E6055",
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

  absolutePositioning: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999, // Set a high zIndex to appear over other components
    // Other styles for your Card component
  },
});

type recipeModalInputs = {
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  recipe_id: number;
};

function RecipeListModal(params: recipeModalInputs) {
  const { setVisible, visible, recipe_id } = params;
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("must be used within an AuthProvider");
  }

  const { authToken } = authContext;

  const addRecipeToList = async (list_id: number, recipe_id: number) => {
    //console.log("data", list_id);
    //console.log("stringified", JSON.stringify(data));
    try {
      const response = await axios.post(
        `https://open-recipes.onrender.com/recipe-lists/${list_id}/recipe/${recipe_id}`,
        {
          name: "cd",
          description: "striasdng",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
  
    } catch (error) {
      console.error("Error adding data:", error.message);
    }
    router.push(`/feed`);
  };


  async function getRecipeLists(): Promise<RecipeList[]> {
    if (!authToken) {
      throw new Error("No auth token");
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
    console.log("response.data", response.data);
    return response.data;
  }
  const query = useQuery({
    queryKey: ["recipe_lists"],
    queryFn: getRecipeLists,
    enabled: !!authToken, // Only run the query if authToken is not empty
  });

 


  const lists = query.data || [];
  console.log("lists", lists);

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
                  style={{ justifyContent: "center", alignItems: "center",  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 20, color:"#4B4037",}}>
                      Add to List
                    </Text>
                  </View>

                  <View style={{ height: 30, paddingTop: 30 }}></View>
                  {query.error && <Text>{JSON.stringify(query.error)}</Text>}
                  {query.isFetching && (
                    <Spinner size="large" color="$orange10" />
                  )}
                  <ScrollView
                    style={{ height: 550, width: 335, paddingBottom: 0 }}
                  >
                    <YStack
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      paddingHorizontal="$4"
                      space
                    >
                      {lists.map((recipelist) => {

                      return (
                        <Card key={recipelist.id} elevate size="$4" width={"100%"} height={70} bordered marginLeft={20} >
                          <Card.Header padded width={"83%"}>
                            <Text style={{
                                  color:"#4B4037", fontWeight: "bold",}}>{recipelist.name}</Text>
                            <XStack width={"83%"}>
                              <Paragraph theme="alt2">
                                {recipelist.description}
                              </Paragraph>
                            </XStack>
                          </Card.Header>
                          <Card.Footer padded>
                            <XStack flex={1} />
                            <Button
                              color="#6E6055"
                              borderRadius="$10"
                              hoverStyle={{ color: "white", backgroundColor: "#F4591D" }} // Change color on hover
                              pressStyle={{ color: "white", backgroundColor: "#F4591D" }} // Change color on press
                              onPress={() => {
                                console.log("clickeddd");
                                addRecipeToList(recipelist.id, recipe_id);
                              }}
                            >
                              Add
                            </Button>
                          </Card.Footer>
                        </Card>
                
                      )
            
                      })}
                    </YStack>
                  </ScrollView>
                  <View style={{ height: 20 }} />
                </View>
                <View style={{ padding: 3 }}>
                  <Button
                    onPress={() => {
                      setVisible(!visible);
                    }}
                    hoverStyle={{ color: "white", backgroundColor: "red" }} // Change color on hover
                    pressStyle={{ color: "white", backgroundColor: "red" }} // Change color on press
                    color="white"
                    backgroundColor="$red10"
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* <Button
          onPress={() => {
            setVisible(true);
          }}
          color="blue"
        /> */}
      </Stack>
    </View>
  );
}



export default Register;
