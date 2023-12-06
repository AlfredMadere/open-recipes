/* eslint-disable react/prop-types */
import { useRouter } from "expo-router";
import { View, Stack, Card, XStack, Button, Paragraph, YStack, H2, ScrollView } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  FlatList,
  Modal,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";

export default function One() {
  const [modalVisible, setModalVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Feedmust be used within an AuthProvider");
  }
  const { authToken} = authContext;


  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("data", data);
    console.log("stringified", JSON.stringify(data));
    try {
      const response = await axios.post(
        "https://open-recipes.onrender.com/recipe-lists",
        {
          name: data.name,
          description: data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );

      fetchDataFromBackend();
    } catch (error) {
      console.error("Error adding data:", error.message);
    }
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(
        "https://open-recipes.onrender.com/recipe-lists", 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("response", response);
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };


  return (
    <View style={{ width: "100%", backgroundColor: "#EBE7E0",}}>
      <View style={{ padding: 10 }}>
      <Button
              bordered
              size="$3"
              backgroundColor= "#D7783B"
              color= "white"
              pressStyle={{color: "white", backgroundColor: "#6E6055" }} // Change color on press
              onPress={() => {
                setModalVisible(true);
                reset({
                  name: "",
                  description: "",
                });
              }} >
          New List
          </Button>
      </View>

          <ListComponent data={lists} />

      <View style={{ alignSelf: "flex-end" }}>
        <Stack scale={1.2} marginTop={15}>
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
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
                  height: 350,
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
                    style={{ justifyContent: "center", alignItems: "center", color:"#E1DCD2" }}
                  >
                    <View>
                      <Text style={{ fontWeight: "bold", fontSize: 20, color: "#4B4037" }}>
                        Create New List
                      </Text>
                    </View>

                    <View style={{ height: 300, paddingTop: 25 }}>
                      <Text style={{color: "#6E6055" }}>Title:</Text>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={errors["name"] ? styles.error : styles.input}
                            placeholder={`Enter name here...`}
                            onBlur={onBlur}
                            onChangeText={(value) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="name"
                        rules={{ required: true }}
                      />
                      {errors.name && (
                        <Text
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        >
                          This is required.
                        </Text>
                      )}
                     
                      <Text style={{color: "#6E6055" }}>Description</Text>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            style={
                              errors["description"]
                                ? styles.error
                                : styles.input
                            }
                            placeholder={`Enter description here...`}
                            onBlur={onBlur}
                            onChangeText={(value) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="description"
                        rules={{ maxLength: 100 }}
                      />
                      {errors.description && (
                        <Text
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        >
                          This description has exceeded the word count.
                        </Text>
                      )}

                      <View style={{ padding: 3 }}>

                      <Button
                          size="$3" // Adjust the size
                          backgroundColor="$green10" // Set the button color
                          color="white"
                          borderRadius="$6" // Round the corners
                          // shadowColor="$shadow" // Add a shadow
                          shadowRadius={10} // Shadow radius
                          elevation={2} // Elevation for a 3D effect
                          hoverStyle={{ backgroundColor: "green" }} // Change color on hover
                          pressStyle={{ backgroundColor: "green" }} // Change color on press
                          fontFamily="$body" // Set the font family
                          fontSize="$4" // Set the font size
                          fontWeight="bold" // Make the text bold
                          onPress={handleSubmit(onSubmit)}
                        >
                        Create
                        </Button>
                        <Text> </Text>

                        <Button
                          size="$3" // Adjust the size
                          backgroundColor="$red10" // Set the button color
                          color="white"
                          borderRadius="$6" // Round the corners
                          // shadowColor="$shadow" // Add a shadow
                          shadowRadius={10} // Shadow radius
                          elevation={2} // Elevation for a 3D effect
                          hoverStyle={{ backgroundColor: "red" }} // Change color on hover
                          pressStyle={{ backgroundColor: "red" }} // Change color on press
                          fontFamily="$body" // Set the font family
                          fontSize="$4" // Set the font size
                          fontWeight="bold" // Make the text bold
                          onPress={() => {
                            setModalVisible(!modalVisible);
                            reset({
                              name: "",
                              description: "",
                            });
                          }} 
                        >
                        Cancel
                        </Button>

                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

        </Stack>
      </View>
    </View>
  );
}

const ListComponent = ({ data }) => {
  return (
    <FlatList
      data={data}
      numColumns={1}
      style={{ width: "100%" , height: "100%" }}
      renderItem={({ item }) => (
        <View
          style={{
            flex: 1,
            
            marginTop: 20,
            marginLeft: 15,
            width: "92%",
            alignItems: "stretch",
            justifyContent: "center",
          }}
          space
        >
          <ListCard
            id={item.id}
            name={item.name}
            description={item.description}
          />
        </View>
      )}
    />
  );
};

export function ListCard(props: {
  id: string;
  name: string;
  description: string;
}) {
  const { name, description, id } = props;
  const router = useRouter();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext not found");
  }
  const { authToken } = authContext;

  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      console.log("id to delet is", id)
      const response = await axios.delete(
        `https://open-recipes.onrender.com/recipe-lists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
        setIsDeleted(true);
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  return (
    <>
      {!isDeleted && (
      <ScrollView style={{ width: "100%" }}>
      <YStack
      $sm={{
        flexDirection: "column",
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}

    >
      <Card elevate size="$4" width={"100%"} height={200} bordered {...props}>
      <Card.Header padded>
        <H2 color="#4B4037">{name}</H2>
        <Paragraph theme="alt2">{description}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
                size="$2"
                borderRadius="$6"
                backgroundColor="$red10"
                color="white"
                hoverStyle={{ color: "white", backgroundColor: "red" }} // Change color on hover
                pressStyle={{ color: "white", backgroundColor: "red" }} // Change color on press
                onPress={handleDelete}>
              Delete
            </Button>
        <Text>    </Text>

        <Button
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          color="#6E6055"
          hoverStyle={{color: "white", backgroundColor: "#D7783B" }} // Change color on hover
          pressStyle={{ color: "white", backgroundColor: "#D7783B" }} // Change color on press
          size="$2" 
          borderRadius="$6" // Round the corners
          onPress={() => {
            router.push(`/lists/${id}`);
          }}
        >
          View
        </Button>

      </Card.Footer>
    </Card>
    </YStack>
    </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor:"#4B4037",
    color:"#6E6055"
  },
  error: {
    borderColor: "red",
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
