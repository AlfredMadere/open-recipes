import { useRouter } from "expo-router";
import { Button, H1, View, Circle, Square, Stack, Card, CardProps, H2, Image, Paragraph, XStack, YStack } from "tamagui";
import {Text, FlatList} from 'react-native';

export default function One() {
  const router = useRouter();

  let username = 'AlfredRocks33'

  let recipes = [
    {
      name: "Epic Recipe 1",
      description: "Super delicious recipe",
      id: 1,
      mins_prep: 20,
      mins_cook: 30,
      category_id: 1,
      author_id: 1,
      created_at: "2022-01-01 00:00:00",
      procedure: "Make it",
      default_servings: 1,
    },{
      name: "Epic Recipe 2",
      description: "ANOTHER AMAXZONG Super delicious recipe",
      id: 2,
      mins_prep: 20,
      mins_cook: 30,
      category_id: 1,
      author_id: 1,
      created_at: "2022-01-01 00:00:00",
      procedure: "Make it",
      default_servings: 1,
    },
    {
      name: "Epic Recipe 3",
      description: "Super delicious recipe",
      id: 3,
      mins_prep: 20,
      mins_cook: 30,
      category_id: 1,
      author_id: 1,
      created_at: "2022-01-01 00:00:00",
      procedure: "Make it",
      default_servings: 1,
    },
    {
      name: "Epic Recipe 4",
      description: "Super delicious recipe",
      id: 1,
      mins_prep: 20,
      mins_cook: 30,
      category_id: 1,
      author_id: 1,
      created_at: "2022-01-01 00:00:00",
      procedure: "Make it",
      default_servings: 1,
    },
    {
      name: "Epic Recipe 5",
      description: "Super delicious recipe",
      id: 1,
      mins_prep: 20,
      mins_cook: 30,
      category_id: 1,
      author_id: 1,
      created_at: "2022-01-01 00:00:00",
      procedure: "Make it",
      default_servings: 1,
    },
    {
      name: "Epic Recipe 6",
      description: "Super delicious recipe",
      id: 1,
      mins_prep: 20,
      mins_cook: 30,
      category_id: 1,
      author_id: 1,
      created_at: "2022-01-01 00:00:00",
      procedure: "Make it",
      default_servings: 1,
    },
  ];
  return (
    <View style={{width: '100%', flex: 1}}>
      <View style={{flex: 1, marginVertical: 20}}>
        <View style={{alignSelf: 'center'}}>
          <Circle size={100} backgroundColor="$color" elevation="$4" />
          <Stack scale={1.2} marginTop={15}>
            <Text>{username}</Text>
          </Stack>
        </View> 
        <View style={{marginLeft:10, marginTop:20}}>
            <Text>Pinned Recipes:</Text>
        </View> 

          <View style={{ flex: 1 }}>
           <GridComponent data={recipes} />
          </View>
      
      </View>
    </View>
  );
}
const GridComponent = ({ data }) => {
  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginLeft: 45,
          marginRight: 45,
          marginTop: 20,
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        paddingHorizontal="$4"
        space>
          {data.map((recipe) => {
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                    />
                  );
                })
              }
        </View>
      )}
    />
  );
};

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
  const recipe = props.recipe
  const router = useRouter();

  return (
    <Card
      elevate
      size="4"
      width={120}
      height={120}
      bordered
      {...props}
    >
      <Card.Header padded>
        <Text>{recipe.name}</Text>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button alignSelf='center' borderRadius="$2" onPress={() => {router.push(`/recipes/${recipe.id}`)}}>View</Button>
      </Card.Footer>
    </Card>
  );
}
