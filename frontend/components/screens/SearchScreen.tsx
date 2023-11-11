import {
  Button,
  Input,
  SizeTokens,
  TextArea,
  XStack,
  YStack,
  View,
  ScrollView,
} from "tamagui";
import SearchResult from "../SearchResult/SearchResult";
import React, { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import axios from "axios";
import { Recipe } from "../../app/interfaces/models";

export default function SearchScreen() {

  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const [filterValue, setFilterValue] = useState("");

  type onPressButtonProps = {
    key: string;
    value: string;
  };

  const onPressButton = (props : onPressButtonProps) => {
    // Code for the first action
    setFilterKey(props.key);
    setFilterValue(props.value);

  };




  async function getFilters() {
    // const data = [
    //   {
    //     id: "0",
    //     description: "Super delicious recipe",
    //     name: "Easy Dinners",
    //     mins_prep: 20,
    //     mins_cook: 30,
    //     category_id: 1,
    //     author_id: 1,
    //     created_at: "2022-01-01 00:00:00",
    //     procedure: "Make it",
    //     default_servings: 1,
    //   },
    //   {
    //     id: "1",
    //     description: "Super delicious recipe",
    //     name: "Quick Snacks",
    //     mins_prep: 20,
    //     mins_cook: 30,
    //     category_id: 1,
    //     author_id: 1,
    //     created_at: "2022-01-01 00:00:00",
    //     procedure: "Make it",
    //     default_servings: 1,
    //   },
    //   {
    //     id: "2",
    //     description: "Super delicious recipe",
    //     name: "Breakfast Foods",
    //     mins_prep: 20,
    //     mins_cook: 30,
    //     category_id: 1,
    //     author_id: 1,
    //     created_at: "2022-01-01 00:00:00",
    //     procedure: "Make it",
    //     default_servings: 1,
    //   },
    //   {
    //     id: "3",
    //     description: "Super delicious recipe",
    //     name: "Dinners for 1 :(",
    //     mins_prep: 20,
    //     mins_cook: 30,
    //     category_id: 1,
    //     author_id: 1,
    //     created_at: "2022-01-01 00:00:00",
    //     procedure: "Make it",
    //     default_servings: 1,
    //   },
    //   {
    //     id: "4",
    //     description: "Super delicious recipe",
    //     name: "Dinners for 2 ;)",
    //     mins_prep: 20,
    //     mins_cook: 30,
    //     category_id: 1,
    //     author_id: 1,
    //     created_at: "2022-01-01 00:00:00",
    //     procedure: "Make it",
    //     default_servings: 1,
    //   },
    //   {
    //     id: "5",
    //     description: "Super delicious recipe",
    //     name: "Dinners for Hubby",
    //     mins_prep: 20,
    //     mins_cook: 30,
    //     category_id: 1,
    //     author_id: 1,
    //     created_at: "2022-01-01 00:00:00",
    //     procedure: "Make it",
    //     default_servings: 1,
    //   },
    // ];

    const response = await axios.get("https://open-recipes.onrender.com/tags");
    console.log("response.data", response.data);
    return response.data;
  }

  async function getSearchResults(
    searchText: string,
    filterKey: string,
    filterValue: string
  ) {
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes?name={searchText}&tag_key={filterKey}&tag_value={filterValue}"
    );
    console.log("response.data", response.data);
    console.log(
      "Getting Recipes with name:",
      searchText,
      "with key:",
      filterKey,
      "with value: " + filterValue
    );
    return response.data;
  }

  type getSearchResultsProps = {
    searchText: Function,
    filterKey: string,
    filterValue: string,

  }

  
    const query1 = useQuery({
      queryKey: ["tags"],
      queryFn: getFilters,
    });

    const query2 = useQuery({
      queryKey: ["recipes", searchText, filterKey, filterValue],
      queryFn: () => getSearchResults(searchText, filterKey, filterValue),
    })


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
    
      const rows = query2.data?.map((recipe : RecipeProps) => {
        return (
          <SearchResult
            key={recipe.id}
            name={recipe.name}
            id={recipe.id} mins_prep={0} mins_cook={0} description={""} default_servings={0} created_at={""} author_id={""} procedure={""} next_cursor={0} prev_cursor={0}          ></SearchResult>
        );
      });

      type tagProps = {
        
          id: number;
          key: string;
          value: string;
        
      };

    

    const filters = query1.data?.map((tag : tagProps) => {
      return (
        <Button
          themeInverse
          size="$2"
          key={tag.id}
          onPress={() => onPressButton(tag)}
        >
          {tag.value}
        </Button>
      );
    });

  // object with search term and filters
  // filters should have a state
  // when selected the state should be true, give it a different color

  return (
    <YStack
      width={400}
      minHeight={250}
      overflow="hidden"
      space="$2"
      margin="$3"
      padding="$2"
    >
      <InputText size="$4" searchText={searchText} setSearchText={setSearchText}/>
      <XStack space="$2">
       {filters}
      </XStack>
      <ScrollView>{rows}</ScrollView>
    </YStack>
  );
}

type InputTextProps = {
  size: SizeTokens;
  searchText: string;
  setSearchText: Function;

  }


function InputText(props : InputTextProps) {
  

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

        <Button size={props.size}>Go</Button>
      </XStack>
    </View>
  );
}



