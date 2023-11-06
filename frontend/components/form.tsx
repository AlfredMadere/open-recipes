import React, {useState, ChangeEvent} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function Form () {
  const [newRecipe, setNewRecipe] = useState(
    {
      name: "",
      description: "",
      id: "",
      mins_prep: "",
      mins_cook: "",
      category_id: "",
      author_id: "",
      created_at: "",
      procedure: "",
      default_servings: ""
    }
  );

  function handleChange(name: string, value: string) {
    if (name === "name")
      setNewRecipe ({
        ...newRecipe,
        ["name"]: value
      })
    else if (name === "description")
      setNewRecipe ({
        ...newRecipe,
        ["description"]: value
      })
    else if (name === "id")
      setNewRecipe ({
        ...newRecipe,
        ["id"]: value
      })
    else if (name === "mins_prep")
      setNewRecipe ({
        ...newRecipe,
        ["mins_prep"]: value
      })
    else if (name === "mins_cook")
      setNewRecipe ({
        ...newRecipe,
        ["mins_cook"]: value
      })  
    else if (name === "category_id")
      setNewRecipe ({
        ...newRecipe,
        ["category_id"]: value
      })
    else if (name === "author_id")
      setNewRecipe ({
        ...newRecipe,
        ["author_id"]: value
      })
    else if (name === "created_at")
      setNewRecipe ({
        ...newRecipe,
        ["created_at"]: value
      })
    else if (name === "procedure")
      setNewRecipe ({
        ...newRecipe,
        ["procedure"]: value
      })
    else if (name === "default_servings")
      setNewRecipe ({
        ...newRecipe,
        ["default_servings"]: value
      })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Name</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.name}
          onChangeText={(value) => handleChange("name", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Description</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.description}
          onChangeText={(value) => handleChange("description", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Minutes to Prepare</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.mins_prep}
          onChangeText={(value) => handleChange("mins_prep", value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Minutes to Cook</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.mins_cook}
          onChangeText={(value) => handleChange("mins_cook", value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Category ID</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.category_id}
          onChangeText={(value) => handleChange("category_id", value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Author ID</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.author_id}
          onChangeText={(value) => handleChange("author_id", value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Created At</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.created_at}
          onChangeText={(value) => handleChange("created_at", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Procedure</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.procedure}
          onChangeText={(value) => handleChange("procedure", value)}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Default Servings</Text>
        <TextInput
          style={styles.input}
          value={newRecipe.default_servings}
          onChangeText={(value) => handleChange("default_servings", value)}
          keyboardType="numeric"
        />
      </View>
    </ScrollView>
  );
};
  
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    height: 40,
    padding: 8,
  },
});