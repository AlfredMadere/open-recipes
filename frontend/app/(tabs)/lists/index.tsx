/* eslint-disable react/prop-types */
import { useRouter } from "expo-router";
import { View, Stack, Card, XStack, Button } from "tamagui";
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
    <View style={{ width: "100%", flex: 1 , backgroundColor: "#EBE7E0",}}>
      <View style={{ flex: 1, marginVertical: 20 }}>
        <View style={{ flex: 1 }}>
          <ListComponent data={lists} />
        </View>
      </View>
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
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View>
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        Create New List
                      </Text>
                    </View>

                    <View style={{ height: 300, paddingTop: 25 }}>
                      <Text>Title:</Text>
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
                      <Text> </Text>
                      <Text>Description</Text>
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
                          bordered
                          size="$3" theme="active"
                          style={{backgroundColor: "green", color: "white"}}
                          onPress={handleSubmit(onSubmit)}
                        >
                        Create
                        </Button>

                        <Button
                          bordered
                          size="$3" theme="active"
                          style={{backgroundColor: "red", color: "white"}}
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


        <View style={{marginTop: 40,
    color: "white",
    height: 40,
    //backgroundColor: "gray",
    borderRadius: 0,
    flexDirection: "row",
    justifyContent: "space-between",}}>
          <Button
              bordered
              size="$3" theme="active"
              style={{backgroundColor: "#F4591D", color: "white"}}
              onPress={() => {
                setModalVisible(true);
                reset({
                  name: "",
                  description: "",
                });
              }} >
          New List
          </Button>
          <Text> </Text>
          </View>

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
            marginLeft: 45,
            marginRight: 45,
            marginTop: 20,
            width: "100%",
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
        <Card elevate size="4" width={305} height={120} bordered>
          <Card.Header padded>
            <Text style={{ fontWeight: "bold" }}>{name}</Text>
          </Card.Header>
          <Stack margin={20}>
            <Text style={{ fontSize: 10, height: 10, overflow: "hidden" }}>{description }</Text>
          </Stack>

          <Card.Footer padded>
            <XStack maxWidth={1} flex={10} />

            <Button
                bordered
                size="$2" theme="active"
                style={{backgroundColor:"red", color:"white"}}
                onPress={handleDelete}>
              Delete
            </Button>
            
          <Text>                                           </Text>
           <Button
                bordered
                size="$2"
                onPress={() => {
                router.push(`/lists/${id}`);
              }}>
              View
            </Button>

          </Card.Footer>
        </Card>
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
