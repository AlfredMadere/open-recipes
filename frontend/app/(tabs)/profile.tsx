import { useRouter } from "expo-router";
import { Button, H1, View, Circle, Square, Stack, Card, CardProps, H2, Image, Paragraph, XStack } from "tamagui";
import {Text} from 'react-native';

export default function One() {
  const router = useRouter();

  let username = 'AlfredRocks33'
  let recipename = 'Eggs and bacon'



  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, marginVertical: 20}}>
        <View style={{alignSelf: 'center'}}>
          <Circle size={100} backgroundColor="$color" elevation="$4" />
          <Stack mx="$sm" scale={1.2} margin={10}>
            <Text>{username}</Text>
          </Stack>

        </View>

        <View style={styles.app}>
      <Row>
        <Col numRows={3}>
          <View style={{alignSelf: 'center', marginVertical: 5}}>
            <Image
              source={{
                uri: 'https://placekitten.com/200/300',
                width: 100,
                height: 100,
              }}
            />
            <Text>First column</Text>
          </View>
        </Col>
        <Col numRows={3}>
        <View style={{alignSelf: 'center', marginVertical: 5}}>
            <Image
              source={{
                uri: 'https://placekitten.com/200/300',
                width: 100,
                height: 100,
              }}
            />
            <Text>First column</Text>
          </View>
        </Col>
        <Col numRows={3}>
          <View style={{alignSelf: 'center', marginVertical: 5}}>
            <Square size={100} backgroundColor="$color" elevation="$400"  />
            <Text>First column</Text>
          </View>
        </Col>
      </Row>
      <Row>
        <Col numRows={3}>
          <View style={{alignSelf: 'center', marginVertical: 5}}>
            <Square size={100} backgroundColor="$color" elevation="$400"  />
            <Text>First column</Text>
          </View>
        </Col>
        <Col numRows={3}>
          <View style={{alignSelf: 'center', marginVertical: 5}}>
            <Square size={100} backgroundColor="$color" elevation="$400"  />
            <Text>First column</Text>
          </View>
        </Col>
        <Col numRows={3}>
          <Text>Third column</Text>
        </Col>
      </Row>
      <Row>
        <Col numRows={3}>
          <Text>First column</Text>
        </Col>
        <Col numRows={3}>
          <Text>Second column</Text>
        </Col>
        <Col numRows={3}>
          <Text>Third column</Text>
        </Col>
      </Row>
      </View>
        
      </View>
      <Button >TAMA WORKS</Button>
    </View>
  );
}

const Col = ({ numRows, children }) => {
  return  (
    <View style={styles[`${numRows}col`]}>{children}</View>
  )
}

const Row = ({ children }) => (
  <View style={styles.row}>{children}</View>
  
)

const styles = {
  app: {
    flex: 3, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 'auto',
    backgroundColor: "white"
    
  },
  row: {
    flexDirection: "row"
  },
  "3col":  {
    backgroundColor:  "lightgrey",
    borderColor:  "#fff",
    borderWidth:  10,
    flex:  3
  }
};
