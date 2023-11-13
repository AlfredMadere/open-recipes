import { Button, H3, H5, Card, Paragraph, Text, View, XStack } from "tamagui";
import { useRouter } from "expo-router";

type RecipeCardProps = {
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

export default function SearchResult(props: RecipeCardProps) {
  
  const router = useRouter();

  return (
    <View style={{}}>
      <Card
        justifyContent="center"
        alignItems="center"
        padding="$5"
        margin="$4"
        elevate
        size="$4"
        onPress={() => {
          router.push(`/recipes/${props.id}`);
        }}
      >
        <H3>{props.name}</H3>
        <H5>{props.description}</H5>
        <XStack>
          <Text>Prep Time: {props.mins_prep}</Text>
          <Text>Cook Time: {props.mins_cook}</Text>
        </XStack>
      </Card>
    </View>
  );
}


