import {View, Text, ScrollView, StyleSheet} from 'react-native';

type Recipe = {
  id: number;
  name: string;
  mins_prep: number;
  mins_cook: number;
  description: string;
  default_servings: number;
  created_at: string;
  author_id: number;
  procedure: string;
};

function TableHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerCell}>id</Text>
      <Text style={styles.headerCell}>name</Text>
      <Text style={styles.headerCell}>mins_prep</Text>
      <Text style={styles.headerCell}>mins_cook</Text>
      <Text style={styles.headerCell}>description</Text>
      <Text style={styles.headerCell}>default_servings</Text>
      <Text style={styles.headerCell}>created_at</Text>
      <Text style={styles.headerCell}>author_id</Text>
      <Text style={styles.headerCell}>procedure</Text>
    </View>
  );
}

function TableBody(props: { recipeData: Recipe[] }) {
  return (
    <View>
      {props.recipeData.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{row.id}</Text>
          <Text style={styles.cell}>{row.name}</Text>
          <Text style={styles.cell}>{row.mins_prep}</Text>
          <Text style={styles.cell}>{row.mins_cook}</Text>
          <Text style={styles.cell}>{row.description}</Text>
          <Text style={styles.cell}>{row.default_servings}</Text>
          <Text style={styles.cell}>{row.created_at}</Text>
          <Text style={styles.cell}>{row.author_id}</Text>
          <Text style={styles.cell}>{row.procedure}</Text>
        </View>
      ))}
    </View>
  );
  }


  function Table (props: { recipeData: Recipe[] }) {
    return (
      <ScrollView>
        <View style={styles.table}>
          <TableHeader />
          <TableBody recipeData={props.recipeData} />
        </View>
      </ScrollView>
    );
    }

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#000',
  },
  header: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    padding: 10,
  },
});

export default Table;