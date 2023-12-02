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
      alert("🔐 Here's your value 🔐 \n" + result);
      return result;
    } else {
      alert("No values stored under that key.");
    }
  }

export default function SearchScreen() {
  //const router = useRouter();
  //const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [results, setResults] = useState([]);
  const [pressed, setPressed] = useState(false);

  type onPressButtonProps = {
    key: string;
    value: string;
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

  type tagProps = {
    id: number;
    key: string;
    value: string;
  };

  const onPressButton = (props: onPressButtonProps) => {
    // Code for the first action
    setFilterKey(props.key);
    setFilterValue(props.value);
  };

  function onUseInventory() {
    // let result = [];
    // query3.refetch();
    // result = query2.data?.recipe.map((recipe: RecipeProps) => {
    //   Alert.alert("HEY7");
    //   return (
    //     <SearchResult
    //       key={recipe.id}
    //       name={recipe.name}
    //       id={recipe.id}
    //       mins_prep={recipe.mins_cook}
    //       mins_cook={recipe.mins_cook}
    //       description={recipe.description}
    //       default_servings={recipe.default_servings}
    //       created_at={""}
    //       author_id={""}
    //       procedure={""}
    //       next_cursor={recipe.next_cursor}
    //       prev_cursor={recipe.next_cursor}
    //     ></SearchResult>
    //   );
    // });
    // setResults(result);
  }

  // function onPressGoButton() {
  //   let result = [];

  //   if (searchText.length > 0 && filterKey.length > 0 && filterValue.length) {

  //     result = query2.data?.recipe.map((recipe: RecipeProps) => {

  //       return (
  //         <SearchResult
  //           key={recipe.id} // Use a combination of recipe.id and index
  //           name={recipe.name}
  //           id={recipe.id}
  //           mins_prep={recipe.mins_cook}
  //           mins_cook={recipe.mins_cook}
  //           description={recipe.description}
  //           default_servings={recipe.default_servings}
  //           created_at={""}
  //           author_id={""}
  //           procedure={""}
  //           next_cursor={recipe.next_cursor}
  //           prev_cursor={recipe.next_cursor}
  //         ></SearchResult>
  //       );
  //     });
  //   }

  //     // Remove null values from the result array

  //   setResults(result);
  // }
  async function getInventoryResults() {
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes?cursor=0&use_inventory_of=1",
    );
    return response.data;
  }

  const query3 = useQuery({
    queryKey: ["inventory_results"],
    queryFn: getInventoryResults,
    enabled: false,
  });

  const req =
    "https://open-recipes.onrender.com/recipes?name=" +
    searchText +
    "&tag_key=" +
    filterKey +
    "&tag_value=" +
    filterValue;

  // async function getSearchResults() {
  //   const response = await axios.get(req);

  //   console.log("response.data", response.data);
  //   const datares = JSON.stringify(response.data, null, 2);
  //   Alert.alert("response.data: " + datares);
  //   return response.data;
  // }

  // const query2 = useQuery({
  //   queryKey: ["recipe"],
  //   queryFn: getSearchResults,
  //   enabled: false,
  // });

  async function getFilters() {
    const response = await axios.get(
      "https://open-recipes.onrender.com/tags?cursor=0&key=meal-type&page_size=10",
    );

    return response.data;
  }

  const query1 = useQuery({
    queryKey: ["tags"],
    queryFn: getFilters,
  });

  // const filters = query1.data?.tags.map((tag: tagProps) => {
  //   return (
  //     <Button
  //       themeInverse
  //       size="$3"
  //       key={tag.id}
  //       onPress={() => onPressButton(tag)}
  //     >
  //       {tag.value}
  //     </Button>
  //   );
  // });

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
        {pressed &&
          searchText.length > 0 &&
          filterKey.length > 0 &&
          filterValue.length > 0 && (
            <ComputeResults setPress={setPressed} req={req} />
          )}
      </ScrollView>
    </YStack>
  );
}

type runQueryProps = {
  req: string;
  setPress: Function;
};

function ComputeResults(props: runQueryProps) {
  //Alert.alert("we have reached the function");
  Alert.alert("Request: " + props.req);

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

  async function getSearchResults() {
    const authToken = await getValueFor("authtoken");

    alert("inside of get results");
    const response = await axios.get(props.req,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

    console.log("response.data", response.data);
    const datares = JSON.stringify(response.data, null, 2);

    Alert.alert("response.data: " + datares);
    return response.data;
  }

  const query2 = useQuery({
    queryKey: ["recipe"],
    queryFn: getSearchResults,
  });
  let result = [];

  result = query2.data?.recipe.map((recipe: RecipeProps) => {
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

type InputTextProps = {
  size: SizeTokens;
  searchText: string;
  setSearchText: Function;
  onPressGoButton: Function;
};

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
