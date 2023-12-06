import { Button, H2, H5, Card, Paragraph, Image, Text, View, XStack } from "tamagui";
import { useRouter } from "expo-router";
import {StyleSheet} from "react-native";

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

  const styles = StyleSheet.create({
    circularView: {
      marginTop: 60,
      marginLeft:15,
      width: 200,
      height: 70,
      borderRadius: 5,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
  });

  return (
<View backgroundColor="#EBE7E0" paddingRight="$8">
<Card margin="$2" elevate size="$4" width={"100%"} height={250} bordered {...props}>
      <Card.Header padded>
        <H2 color="#4B4037">{props.name}</H2>
        <Paragraph theme="alt2">{props.description}</Paragraph>
      </Card.Header>
      <View style={styles.circularView}>
            <Image
              source={require("../../assets/recipie.png")}
              style={styles.image}
            />
          </View>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          color="#6E6055"
          hoverStyle={{color: "white", backgroundColor: "#D7783B" }} // Change color on hover
          pressStyle={{ color: "white", backgroundColor: "#D7783B" }} // Change color on press
          size="$3" 
          borderRadius="$6" // Round the corners
          onPress={() => {
            router.push(`/recipes/${props.id}`);
          }}
        >
          View
        </Button>
      </Card.Footer>
    </Card>
    </View>
    
  );
}
