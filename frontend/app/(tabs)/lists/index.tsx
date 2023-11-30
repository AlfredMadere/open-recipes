/* eslint-disable react/prop-types */
import { useRouter } from "expo-router";
import { View, Stack, Card, XStack } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  FlatList,
  Modal,
  Alert,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";


export default function One() {
  const [modalVisible, setModalVisible] = useState(false);
  const [lists, setLists] = useState([]);

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
  })
 
  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://open-recipes.onrender.com/recipe-lists', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
         },
        body: JSON.stringify(data),
       });

       if (!response.ok) {
         throw new Error('Failed to add data');
       }

      fetchDataFromBackend();
    } catch (error) {
      console.error('Error adding data:', error.message);
    }
    setModalVisible(!modalVisible)
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch('https://open-recipes.onrender.com/recipe-lists');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  return (
    <View style={{ width: "100%", flex: 1 }}>
      <View style={{ flex: 1, marginVertical: 20 }}>
        <View style={{ flex: 1 }}>
          <ListComponent data={lists}/>
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
                    <Text style={{ textDecorationLine: "underline" }}>
                      Create New List
                    </Text>
                  </View>
                
                  <View style={{ height: 300, paddingTop: 25 }}>
                   
                  <Text>Title:</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                     style={{
                      height: 40,
                      width: 200,
                      margin: 12,
                      borderWidth: 1,
                      padding: 10,
                     }}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                       />
                     )}
                      name="name"
                      rules={{ required: true }}
                     />
                     {errors.name && <Text>This is required.</Text>}
                    
                    <Text>Description</Text>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                      style={{
                        height: 40,
                        width: 200,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                      }}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                        value={value}/>
                      )}
                     name="description"
                     rules={{ maxLength: 100, }}
                     />
                      {errors.description && <Text>This description has exceeded the word count.</Text>}
                    
                    <View style={{ padding: 20 }}>
                    <Button onPress={handleSubmit(onSubmit)}
                    title="Create"
                    color="green"
                    />

                    <Button
                      onPress={() => {
                      setModalVisible(!modalVisible)
                      reset({
                        name: "",
                        description: "",
                      });
                      }}
                    title="Cancel"
                    color="red"
                    />

                    </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <Button
                   onPress={() => {
                    setModalVisible(true)
                    reset({
                      name: "",
                      description: "",
                    });
                    }}
                  title="New List"
                  color="blue"
                  />
        </Stack>
      </View>
    </View>
  );
}

const ListComponent = ({ data}) => {

  return (
    <FlatList
      data={data}
      numColumns={1}
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
          <ListCard id={item.id} name={item.name} description={item.description}/>
        </View>
      )}
    />
  );
};

export function ListCard(props: { id: string; name: string; description: string }) {
  const { name, description, id } = props;
  const router = useRouter();

  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://open-recipes.onrender.com/recipe-lists/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("Deletion was a success! Navigating now.")
        setIsDeleted(true);

      } else {
        throw new Error('Failed to delete list');
      }
    } catch (error) {
      console.error('Error deleting list:', error.message);
    }
  };



  return (
    <>
    {!isDeleted && (
    <Card elevate size="4" width={305} height={120} bordered>
      <Card.Header padded>
        <Text>{name}</Text>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Text>{description}</Text>
        <Button
            onPress={handleDelete}
            title="Delete List"
            color="red"
        />
        <Button
            onPress={() => {
              router.push(`/lists/${id}`);
            }}
            title="View"
            color="blue"
        />
       
      </Card.Footer>
    </Card>
)}  
    </>
  );
}
