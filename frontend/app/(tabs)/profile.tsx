// import { useRouter } from "expo-router";
// import {
//   Button,
//   H1,
//   View,
//   Circle,
//   Stack,
//   ScrollView,
//   Card,
//   Spinner,
//   H2,
//   Paragraph,
//   XStack,
//   YStack,
// } from "tamagui";
import { Text, View } from "react-native";
// import { useQueryClient, useQuery } from "@tanstack/react-query";

// import axios from "axios";
// import { Recipe } from "../interfaces/models";
// import { removeDuplicateIds } from "../../helpers";
// import * as SecureStore from "expo-secure-store";
// import { useState } from "react";



// async function getValueFor(key: string) {
//     const result = await SecureStore.getItemAsync(key);
//     if (result) {
//       alert("🔐 Here's your value 🔐 \n" + result);
//       return result;
//     } else {
//       alert("No values stored under that key.");
//     }
//   }
// export default async function One() {
//   const router = useRouter();
//   const username = "AlfredRocks33";
  
//   //console.log("the authToken is: " + authToken);
  

//   async function getRecipesFeed(): Promise<SearchResult<Recipe>> {
//       const authToken = await getValueFor("authtoken");
//     const response = await axios.get(
//       "https://open-recipes.onrender.com/recipes",
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           Accept: "application/json",
//         },
//       }
//     );
//     return response.data;
//   }
//   const query = useQuery({
//     queryKey: ["authored_recipes"],
//     queryFn: getRecipesFeed,
//   });

//   const recipes = removeDuplicateIds(query.data?.recipe || []);

//   return (
//     <View style={{ width: "100%" }}>
//       <View style={{ alignSelf: "center" }}>
//         <Stack scale={1.2} marginTop={15}>
//           <Circle size={100} backgroundColor="$color" elevation="$4" />
//         </Stack>
//         <Stack scale={1.2} marginTop={15}>
//           <Text>{username}</Text>
//         </Stack>
//       </View>
//       <View style={{ marginLeft: 10, marginTop: 20, marginBottom: 20 }}>
//         <Text>Authored Recipes:</Text>
//       </View>
//       {query.error && <Text>{JSON.stringify(query.error)}</Text>}
//       {query.isFetching && <Spinner size="large" color="$orange10" />}
//       <ScrollView style={{ width: "100%" }}>
//         <YStack
//           $sm={{
//             flexDirection: "column",
//             width: "100%",
//             flex: 1,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           paddingHorizontal="$4"
//           space
//         >
//           {recipes.map((recipe) => {
//             return <RecipeCard key={recipe.id} recipe={recipe} />;
//           })}
//         </YStack>
//       </ScrollView>
//     </View>
//   );
// }

// //DO NOT USE THIS SYNTAX, used any to pass eslint for testing
// // eslint-disable-next-line @typescript-eslint/no-explicit-any

// type RecipeCardProps = {
//   recipe: {
//     name: string;
//     description: string;
//     id: number;
//     mins_prep: number;
//     mins_cook: number;
//     category_id: number;
//     author_id: number;
//     created_at: string;
//     procedure: string;
//     default_servings: number;
//   };
// };

// export function RecipeCard(props: RecipeCardProps) {
//   const recipe = props.recipe;
//   const router = useRouter();

//   return (
//     <Card elevate size="$4" width={"100%"} height={70} bordered {...props}>
//       <Card.Header padded>
//         <Text>{recipe.name}</Text>
//         <Paragraph theme="alt2">{recipe.description}</Paragraph>
//       </Card.Header>
//       <Card.Footer padded>
//         <XStack flex={1} />
//         <Button
//           borderRadius="$10"
//           onPress={() => {
//             router.push(`/recipes/${recipe.id}`);
//           }}
//         >
//           View
//         </Button>
//       </Card.Footer>
//     </Card>
//   );
// }


export default function Profile () {
  return (
    <View>
      <Text>Im on the profile</Text>
    </View>
  );
}