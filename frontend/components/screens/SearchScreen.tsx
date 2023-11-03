import { Button, Input, SizeTokens, TextArea, XStack, YStack, View, ScrollView } from "tamagui";
import SearchResult from "../SearchResult/SearchResult";


export default function SearchScreen() {

  const data = {
    list_data: [
      {
        id: "0",
        title: "Easy Dinners",
      },
      {
        id: "1",
        title: "Quick Snacks",
      },
      {
        id: "2",
        title: "Breakfast Foods",
      },
      {
        id: "3",
        title: "Dinners for 1 :(",
      },
      {
        id: "4",
        title: "Dinners for 2 ;)",
      },
      {
        id: "5",
        title: "Dinners for Hubby",
      },
    ],
  };

  const rows = data.list_data.map((row, index) => {
    return <SearchResult key={index} title={row.title}></SearchResult>;
  });

// object with search term and filters
//filters should have a state
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
      <InputDemo size="$4" />
      <XStack space="$2">
        <Button themeInverse size="$2">
          Breakfasts
        </Button>
        <Button themeInverse size="$2">
          Lunches
        </Button>
        <Button themeInverse size="$2">
          Dinner
        </Button>
        <Button themeInverse size="$2">
          Quick Snacks
        </Button>
        <Button themeInverse size="$2">
          Smoothies!
        </Button>
      </XStack>
      <ScrollView >
        {rows}
      </ScrollView>
    </YStack>
  );
}
function InputDemo(props: { size: SizeTokens }) {
  return (
    <View>
      <XStack alignItems="center" space="$2" padding="$2">
        <Input flex={1} size={props.size} placeholder={`Search Recipe...`} />

        <Button size={props.size}>Go</Button>
      </XStack>

    </View>
  );
}
