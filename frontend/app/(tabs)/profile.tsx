import { useRouter } from "expo-router";
import {
  Button,
  H1,
  View,
  Circle,
  Stack,
  ScrollView,
  Card,
  Spinner,
  H2,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";
import { Text, FlatList } from "react-native";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { FlatGrid } from 'react-native-super-grid';
import axios from "axios";
import { Recipe } from "../interfaces/models";

export default function One() {
  const router = useRouter();

  const username = "AlfredRocks33"; 

  async function getRecipesFeed(): Promise<SearchResult<Recipe>> {
    const response = await axios.get(
      "https://open-recipes.onrender.com/recipes",
    );
    console.log("response.data", response.data);
    return response.data;
  }
  const query = useQuery({
    queryKey: ["authored_recipes"],
    queryFn: getRecipesFeed,
  });

  return (
    <View style={{ width: "100%" }}>
      <View style={{ alignSelf: "center" }}>
        <Stack scale={1.2} marginTop={15}>
          <Circle size={100} backgroundColor="$color" elevation="$4" />
        </Stack>
        <Stack scale={1.2} marginTop={15}>
          <Text>{username}</Text>
        </Stack>
      </View>
      <View style={{ marginLeft: 10, marginTop: 20, marginBottom: 20 }}>
        <Text>Authored Recipes:</Text>
      </View>
      {query.error && <Text>{JSON.stringify(query.error)}</Text>}
      {query.isFetching && <Spinner size="large" color="$orange10" />}
      <ScrollView style={{ width: "100%" }}>
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
          {query.data?.recipe.map((recipe) => {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          })}
        </YStack>
      </ScrollView>
    </View>
  );
}







//DO NOT USE THIS SYNTAX, used any to pass eslint for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any


type RecipeCardProps = {
  recipe: {
    name: string;
    description: string;
    id: number;
    mins_prep: number;
    mins_cook: number;
    category_id: number;
    author_id: number;
    created_at: string;
    procedure: string;
    default_servings: number;
  };
};

export function RecipeCard(props: RecipeCardProps) {
  const recipe = props.recipe;
  const router = useRouter();

  return (
    <Card size="$4" width={"45%"} height={60} bordered {...props}>
      <Button
          height={60}
          color={'#00000'}
          onPress={() => {
            router.push(`/recipes/${recipe.id}`);
          }}
        >
          {recipe.name}
        </Button>
    </Card>
  );
}

//   return (
//     <View style={{width: '100%', flex: 1}}>
//       {query.error && <Text>{JSON.stringify(query.error)}</Text>}
//       {query.isFetching && <Spinner size="large" color="$orange10" />}
//       <View style={{flex: 1, marginVertical: 20}}>
//         <View style={{alignSelf: 'center'}}>
//           <Circle size={100} backgroundColor="$color" elevation="$4" />
//           <Stack scale={1.2} marginTop={15}>
//             <Text>{username}</Text>
//           </Stack>
//         </View>
//         <View style={{marginLeft:10, marginTop:20}}>
//             <Text>Pinned Recipes:</Text>
//         </View>

//           <View style={{ flex: 1 }}>
//            <GridComponent query={query} />
//           </View>

//       </View>
//     </View>
//   );
// }

// const GridComponent = ({ query }) => {
//   return (
//     <FlatList
//       data={query}
//       numColumns={3}
//       keyExtractor={(item, index) => index.toString()}
//       renderItem={({ item }) => (

//         <View style={{ flex: 1, marginLeft: 45,
//           marginRight: 45,
//           marginTop: 20,
//           flexDirection: "column",
//           width: "100%",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//         paddingHorizontal="$4"
//         space>

//           {query.data?.recipe.map((recipe) => {
//             return <RecipeCard key={recipe.id} recipe={recipe} />;
//           })}

//         </View>
//       )}
//     />
//   );
// };

// export function RecipeCard(props: RecipeCardProps) {
//   const recipe = props.recipe
//   const router = useRouter();

//   return (
//     <Card
//       elevate
//       size="4"
//       width={120}
//       height={120}
//       bordered
//       {...props}
//     >
//       <Card.Header padded>
//         <Text>{recipe.name}</Text>
//       </Card.Header>
//       <Card.Footer padded>
//         <XStack flex={1} />
//         <Button alignSelf='center' borderRadius="$2" onPress={() => {router.push(`/recipes/${recipe.id}`)}}>View</Button>
//       </Card.Footer>
//     </Card>
//   );
// }
