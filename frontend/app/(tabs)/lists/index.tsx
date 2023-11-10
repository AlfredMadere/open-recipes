/* eslint-disable react/prop-types */
import { useRouter } from "expo-router";
import { Button, View, Stack, Card, XStack } from "tamagui";
import {Text, FlatList, Modal, Alert, TextInput, SafeAreaView} from 'react-native';
import React, {useState} from "react";


export default function One() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, onChangeNameText] = React.useState('');
  const [description, onChangeDescriptionText] = React.useState('');


  const lists = [
    {
      name: "Breakfast",
      description: "Some description here...",
    },{
      name: "Lunch",
      description: "Some description here...",
    },
    {
      name: "Dinner",
      description: "Some description here...",
    },
    {
      name: "Snacks",
      description: "Some description here...",
    },
    {
      name: "Desserts",
      description: "Some description here...",

    },
  ];

  
  return (
    <View style={{width: '100%', flex: 1}}>
    
      <View style={{flex: 1, marginVertical: 20}}>

          <View style={{ flex: 1 }}>
           <ListComponent data={lists} />
          </View>
      </View>
      <View style={{alignSelf: 'flex-end'}}>
          <Stack scale={1.2} marginTop={15}>
        
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{margin: 20,
                backgroundColor: 'white',
                height: 350,
                width: 335,
                borderRadius: 20,
                padding: 35,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,}}>
          <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ textDecorationLine: 'underline' }}>Create New List</Text>
          </View>
            <Button 
              style = {{color: 'red',  backgroundColor: 'white', position: 'absolute', top:-20, right:-50, width:50, height:50}} 
              onPress={() => setModalVisible(!modalVisible)}
              >X</Button>

          <View style={{ height: 300, paddingTop: 25 }}>
            <Text>Name:</Text>
            <SafeAreaView>
              <TextInput
                  onChangeText={onChangeNameText}
                  value={name}
                  style = {{ height: 40, width: 200,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,}}
                />
            </SafeAreaView>
            <Text> </Text> 
            <Text>Description:</Text>
            <SafeAreaView>
              <TextInput
                  onChangeText={onChangeDescriptionText}
                  value={description}
                  style = {{ height: 40,
                    margin: 12,
                    borderWidth: 1,
                    padding: 10,}}
                />
            </SafeAreaView>
            <View style={{padding: 20}}>
            <Button
              onPress={() => setModalVisible(!modalVisible)}>Save</Button>
            </View>
          </View>
          </View>
        </View>
        </View>
      </Modal>
      

          <Button onPress={() => setModalVisible(true)}>New List</Button>
          </Stack>
        </View> 
    </View>
  );
}



//DO NOT USE THIS SYNTAX, used any to pass eslint for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListComponent = ({ data }: any) => {
  return (
    <FlatList
      data={data}
      numColumns={1}
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginLeft: 45,
          marginRight: 45,
          marginTop: 20,
          width: "100%",
          alignItems: "stretch",
          justifyContent: "center",
        }}
        space>
       <ListCard
            name={item.name}
            description={item.description}
          />
         
        </View>
      )}

    />
  );
};



export function ListCard(props: { name: string; description: string }) {
  const { name, description } = props;
  const router = useRouter();

  return (
    <Card
      elevate
      size="4"
      width={305}
      height={120}
      bordered
    >
      <Card.Header padded>
      <Text>{name}</Text>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Text>{description}</Text>
          <Button alignSelf='center' borderRadius="$2" onPress={() => {router.push('/lists/[id]')}}>View</Button>
      </Card.Footer>
    </Card>
  );
}


