import { useRouter } from "expo-router";
import {
  Button,
  Card,
  CardProps,
  H1,
  H2,
  Image,
  Paragraph,
  ScrollView,
  View,
  XStack,
  YStack,
} from "tamagui";



export default function Feed() {
  const router = useRouter();
  const recipes = [
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
    },
    {
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
      name: "Epic Recipe",
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
  ];
  return (
    <View style={{ width: "100%" }}>
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
          {
            recipes.map((recipe) => {
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  
                />
              );
            })
          }
          
        </YStack>
      </ScrollView>
    </View>
  );
}

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

  return (
    <Card
      elevate
      size="$4"
      width={"100%"}
      height={300}
      bordered
      {...props}
    >
      <Card.Header padded>
        <H2>{recipe.name}</H2>
        <Paragraph theme="alt2">{recipe.description}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button borderRadius="$10">View</Button>
      </Card.Footer>
    </Card>
  );
}
