/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/prop-types */
import {
  Button,
  Input,
  SizeTokens,
  XStack,
  YStack,
  View,
  ScrollView,
} from "tamagui";
import { Alert } from "react-native";
import SearchResult from "../SearchResult/SearchResult";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
//import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

async function getValueFor(key: string) {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    //alert("🔐 Here's your value 🔐 \n" + result);
    return result;
  } else {
    //alert("No values stored under that key.");
  }
}

type InputTextProps = {
  size: SizeTokens;
  searchText: string;
  setSearchText: Function;
  onPressGoButton: Function;
};

type RecipeProps = {
  id: number;
  name: string;
  mins_prep: number;
  mins_cook: number;
  description: string;
  default_servings: number;
  created_at: string;
  author_id: string;
  procedure: string;

  next_cursor: 0;
  prev_cursor: 0;
};
type onPressButtonProps = {
  key: string;
  value: string;
  id: number;
};

type tagProps = {
  id: number;
  key: string;
  value: string;
};

type runQueryProps = {
  req: string;
  setPress: Function;
  setInventory: Function;
  inventory: boolean;
  searchText: String;
  filterKey: String;
  filterValue: String;
};

export default function SearchScreen() {
  //const router = useRouter();
  //const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [pressed, setPressed] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(-1); // New state to track the selected filter

  const onPressButton = (props: onPressButtonProps) => {
    // Code for the first action

    if (selectedFilter === props.id) {
      // If the tapped filter is already selected, deselect it
      setFilterKey("");
      setFilterValue("");
      setInventory(false);
      setSelectedFilter(-1);
    } else {
      // Otherwise, select the filter
      setFilterKey(props.key);
      setFilterValue(props.value);
      setInventory(false);
      setSelectedFilter(props.id);
    }
  };

  function onUseInventory() {
    setPressed(false);
    setInventory(true);
    setSelectedFilter(-1);
  }

  const req =
    "https://open-recipes.onrender.com/recipes?name=" +
    searchText +
    "&tag_key=" +
    filterKey +
    "&tag_value=" +
    filterValue;

  async function getFilters() {
    const response = await axios.get(
      "https://open-recipes.onrender.com/tags?cursor=0&key=meal-type&page_size=10"
    );

    return response.data;
  }

  const query1 = useQuery({
    queryKey: ["tags"],
    queryFn: getFilters,
  });

  return (
    <YStack
      width={400}
      minHeight={250}
      overflow="hidden"
      space="$2"
      margin="$3"
      padding="$2"
    >
      <InputText
        size="$4"
        searchText={searchText}
        setSearchText={setSearchText}
        onPressGoButton={setPressed}
      />
      <ScrollView horizontal={true}>
        <XStack space="$2">
          {query1.data?.tags.map((tag: tagProps) => {
            return (
              <Button
                themeInverse
                size="$3"
                key={tag.id}
                onPress={() => onPressButton(tag)}
                // Apply different styles based on whether the button is selected
                style={{
                  backgroundColor:
                    tag.id === selectedFilter ? "grey" : "black",
                }}
              >
                {tag.value}
              </Button>
            );
          })}
          <Button themeInverse size="$3" onPress={() => onUseInventory()}>
            Use Inventory!
          </Button>
        </XStack>
      </ScrollView>

      <ScrollView>
        {((pressed && searchText.length > 0) ||
          (filterKey.length > 0 && filterValue.length > 0) ||
          inventory) && (
          <ComputeResults
            searchText={searchText}
            filterKey={filterKey}
            filterValue={filterValue}
            inventory={inventory}
            setInventory={setInventory}
            setPress={setPressed}
            req={req}
          />
        )}
      </ScrollView>
    </YStack>
  );
}

function ComputeResults(props: runQueryProps) {
  //Alert.alert("we have reached the function");
  // Alert.alert("Request: " + props.req);
  async function getInventoryResults() {
    // alert("in get inventory results");
    const authToken = await getValueFor("authtoken");
    const userId = await getValueFor("userId");

    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes?cursor=0&use_inventory_of=" +
        userId,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    );
    //alert("response.data" + response.data);
    return response.data;
  }

  async function getSearchResults() {
    const authToken = await getValueFor("authtoken");

    //alert("inside of get results");
    const response = await axios.get(props.req, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });
    console.log("response.data", response.data);
    const datares = JSON.stringify(response.data, null, 2);
    //Alert.alert("response.data: " + datares);
    return response.data;
  }

    async function getTagResults() {
      const authToken = await getValueFor("authtoken");
      //alert("HI" + props.filterKey);
      //alert("inside of get results");
      const response = await axios.get("https://open-recipes.onrender.com/recipes?cursor=0&tag_key=meal-type&tag_value=" + props.filterValue + "&order_by=name", 
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });
      console.log("response.data for Tag: ", response.data);
      const datares = JSON.stringify(response.data, null, 2);
      //Alert.alert("response.data: " + datares);
      return response.data;
    }

    async function getNameResults() {
      const authToken = await getValueFor("authtoken");
      //alert("HI" + props.searchText);
      //alert("inside of get results");
      const response = await axios.get(
        "https://open-recipes.onrender.com/recipes?name=" + props.searchText + "&cursor=0&order_by=name",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );
      console.log("response.data for Tag: ", response.data);
      const datares = JSON.stringify(response.data, null, 2);
      //Alert.alert("response.data: " + datares);
      return response.data;
    }

  const query2 = useQuery({
    queryKey: ["recipe", props.searchText, props.filterKey, props.filterValue],
    queryFn: getSearchResults,
  });
  const query3 = useQuery({
    queryKey: ["inventory_results"],
    queryFn: getInventoryResults,
  });

  const query4 = useQuery({
    queryKey: ["recipe", props.filterKey, props.filterValue],
    queryFn: getTagResults,
  });

  const query5 = useQuery({
    queryKey: ["recipe", props.searchText],
    queryFn: getNameResults,
  });

  let query;

  if (props.inventory == true) {
    query = query3;
  } else if (props.filterKey.length != 0 && props.searchText.length == 0) {
    query = query4;
  }
  else if (props.filterKey.length == 0 && props.searchText.length != 0) {
    query = query5;
  }
  else {
    query = query2;
  }

  let result = [];

  result = query.data?.recipe.map((recipe: RecipeProps) => {
    return (
      <SearchResult
        key={recipe.id} // Use a combination of recipe.id and index
        name={recipe.name}
        id={recipe.id}
        mins_prep={recipe.mins_cook}
        mins_cook={recipe.mins_cook}
        description={recipe.description}
        default_servings={recipe.default_servings}
        created_at={""}
        author_id={""}
        procedure={""}
        next_cursor={recipe.next_cursor}
        prev_cursor={recipe.next_cursor}
      ></SearchResult>
    );
  });

  return result;
}

function InputText(props: InputTextProps) {
  return (
    <View>
      <XStack alignItems="center" space="$2" padding="$2">
        <Input
          flex={1}
          size={props.size}
          placeholder={`Search Recipe...`}
          value={props.searchText}
          onChangeText={(value) => props.setSearchText(value)}
        />

        <Button onPress={() => props.onPressGoButton(true)} size={props.size}>
          Go
        </Button>
      </XStack>
    </View>
  );
}
