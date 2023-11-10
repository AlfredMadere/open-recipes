import { Button, H3, H5, Card, Paragraph, Text, View } from "tamagui";

//DO NOT USE THIS SYNTAX, used any to pass eslint for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SearchResult(props: any) {
  return (
    <View style={{}}>
      <Card
        justifyContent="center"
        alignItems="center"
        
        padding="$5"
        margin="$4"
        elevate
        size="$4"
      >
        <H3>{props.title}</H3>
       <H5>Description!!</H5>
      </Card>
    </View>
  );
}
