import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Text, View, StyleSheet, TextInput, Alert } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { ScrollView, Button} from "tamagui";
import axios from "axios";
import {
  Recipe,
  FormattedRecipe,
  emptyData,
  sampleData,
} from "../../components/create-recipe-types/create-recipe-helper";
import { getValueFor } from "../../helpers/auth";
import { AuthContext } from "../AuthContext";

export default function Page() {

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { authToken, userId } = authContext;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Recipe>({
    defaultValues: emptyData,
  });

  const {
    // fieldArray for Tags section
    fields: fieldsTag,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    name: "tags",
    control,
  });

  const {
    // fieldArray for Ingredients section
    fields: fieldsIngredient,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  async function postData(data: FormattedRecipe) {
    axios
      .post("https://open-recipes.onrender.com/recipes", data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      })
      .then(function (response) {
        console.log(response, null, 2);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const onSubmit = (data: Recipe) => {
    const currentDateTime = Date().toLocaleString();
    const formattedData = {
      ...data,
      default_servings: parseInt(data.default_servings),
      mins_prep: parseInt(data.mins_prep),
      mins_cook: parseInt(data.mins_cook),
      author_id: userId,
      created_at: currentDateTime,
      ingredients: data.ingredients.map((ingredient) => {
        return {
          ...ingredient,
          quantity: parseInt(ingredient.quantity),
          storage: "FRIDGE", // set storage to FRIDGE for all ingredients
        };
      }),
    };
    //console.log(formattedData);
    postData(formattedData);
    reset(emptyData);
    Alert.alert("recipe created");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        {/* Name */}
          <Text style={styles.label}>Recipe Name:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={`Enter here...`}
              style={errors["name"] ? styles.error : styles.regular_input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          rules={{ required: true }}
        />

        {/* Description */}
        <Text style={styles.label}>Description:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={`Enter here...`}
              style={errors["description"] ? styles.error : styles.regular_input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="description"
          rules={{ required: true }}
        />

        {/* Servings */}
        <Text style={styles.label}>Servings:                Times:         </Text>
        <View style={styles.ingredient}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={`Servings...`}
              style={errors["default_servings"] ? styles.error : styles.regular_input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="default_servings"
          rules={{ required: true }}
        />

       
        {/* Prep and Cooking Time */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={`Prep Time...`}
                style={errors["mins_prep"] ? styles.error : styles.regular_input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                keyboardType="numeric"
              />
            )}
            name="mins_prep"
            rules={{ required: true }}
          />
     
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={`Cook Time...`}
                style={errors["mins_cook"] ? styles.error : styles.regular_input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                keyboardType="numeric"
              />
            )}
            name="mins_cook"
            rules={{ required: true }}
          />
          </View>
       


        {/* Tags */}
        <Text style={styles.label}>Tags:</Text>
        {fieldsTag.map((field, index) => (
          <View key={field.id} style={styles.container}>
            <View style={styles.ingredient}>
              {/* key */}
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["tags"]?.[index]?.["key"]
                        ? styles.error
                        : styles.regular_input
                    }
                    placeholder={`Key...        `}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.key` as keyof Recipe}
                rules={{ required: true }}
              />
              {/* value */}
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["tags"]?.[index]?.["value"]
                        ? styles.error
                        : styles.regular_input
                    }
                    placeholder={`Value...        `}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.value` as keyof Recipe}
                rules={{ required: true }}
                defaultValue=""
              />
              {/* remove tag */}
              <Ionicons.Button name="remove" size={30} color="red" backgroundColor="#EBE7E0" onPress={() => {
                    removeTag(index);
                  }}/>
            </View>
          </View>
        ))}
        <View style={{flexDirection: "row",
                flex: 1,
                justifyContent: "flex-end",
                margin: 0,
                padding: 0,}}>
             
        {/* add tag */}
        <Ionicons.Button name="md-add" size={30} color="green" backgroundColor="#EBE7E0" onPress={() => {
                    appendTag({ key: "", value: "" });
         }}/>
        </View>

        
        {/* Ingredients */}
        <Text style={styles.label}>Ingredients:</Text>
        {fieldsIngredient.map((field, index) => (
          <View key={field.id} style={styles.container}>
            <View style={styles.ingredient}>
              {/* quantity */}
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["ingredients"]?.[index]?.["quantity"]
                        ? styles.error
                        : styles.regular_input
                    }
                    placeholder={`Quantity...`}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.quantity` as keyof Recipe}
                rules={{ required: true }}
              />
              {/* unit */}
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["ingredients"]?.[index]?.["unit"]
                        ? styles.error
                        : styles.regular_input
                    }
                    placeholder={`Unit...`}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.unit` as keyof Recipe}
                rules={{ required: true }}
              />
              {/* name */}
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["ingredients"]?.[index]?.["name"]
                        ? styles.error
                        : styles.regular_input
                    }
                    placeholder={`Ingredient...`}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.name` as keyof Recipe}
                rules={{ required: true }}
              />
              {/* remove ingredient */}
              <Ionicons.Button name="remove" size={30} color="red" backgroundColor="#EBE7E0" onPress={() => {
                    removeIngredient(index);
                  }}
                  />
            </View>
          </View>
        ))}

        <View style={{flexDirection: "row",
                flex: 1,
                justifyContent: "flex-end",
                margin: 0,
                padding: 0,}}>
             
        {/* add ingredient */}
        <Ionicons.Button name="md-add" size={30} color="green" backgroundColor="#EBE7E0" onPress={() => {
                    appendIngredient({
                      quantity: "",
                      unit: "",
                      name: "",
                      storage: "",
                    });
         }}/>
        </View>

        {/* Procedure */}
        <Text style={styles.label}>Procedure:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["procedure"] ? styles.large_error : styles.large_input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="procedure"
          rules={{ required: true }}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
      <Button
            size="$3" // Adjust the size
            backgroundColor="$red10" // Set the button color
            color="white"
            borderRadius="$4" // Round the corners
            // shadowColor="$shadow" // Add a shadow
            shadowRadius={10} // Shadow radius
            elevation={2} // Elevation for a 3D effect
            hoverStyle={{ backgroundColor: "red" }} // Change color on hover
            pressStyle={{ backgroundColor: "red" }} // Change color on press
            fontFamily="$body" // Set the font family
            fontSize="$4" // Set the font size
            fontWeight="bold" // Make the text bold
            onPress={() => {reset(emptyData);
              Alert.alert("form reset");}
            }
          >
            Cancel
          </Button>


        {/* Button for testing, populates form with sample data */}
        {/*         
        <Button
          title="Fill Form - Test"
          color="blue"
          onPress={() => {
            reset(sampleData);
          }}
        /> 
    */}

        <Button
            size="$3" // Adjust the size
            backgroundColor="$green10" // Set the button color
            color="white"
            borderRadius="$4" // Round the corners
            // shadowColor="$shadow" // Add a shadow
            shadowRadius={10} // Shadow radius
            elevation={2} // Elevation for a 3D effect
            hoverStyle={{ backgroundColor: "green" }} // Change color on hover
            pressStyle={{ backgroundColor: "green" }} // Change color on press
            fontFamily="$body" // Set the font family
            fontSize="$4" // Set the font size
            fontWeight="bold" // Make the text bold
            onPress={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Create Recipie
          </Button>

       
      </View>
    </View>
  );
}

// Formatting
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  label: {
    color: "#4B4037",
    fontWeight: "500",
    fontSize: 16,
    marginTop: 10,
    margin: 20,
    marginLeft: 0,
  },
  footer: {
    marginTop: 40,
    color: "white",
    height: 40,
    //backgroundColor: "gray",
    borderRadius: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ingredient: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    margin: 0,
    padding: 0,
  },
  smallButton: {
    marginTop: 0,
    color: "white",
    height: 30,
    width: 50,
    backgroundColor: "green",
    borderRadius: 4,
    justifyContent: "center",
    flex: 0,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 10,
    padding: 8,
    backgroundColor: "#EBE7E0",
  },
  regular_input: {
    backgroundColor: "white",
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    color:"#6E6055",
    borderColor: "#4B4037",
  },
  small_input: {
    backgroundColor: "white",
    height: 40,
    width: 80,
    borderRadius: 4,
    padding: 10,
  },
  large_input: {
    textAlignVertical: 'top',
    textAlign: "left",
    backgroundColor: "white",
    height: 400,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#6E6055",
  },
  error: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    borderRadius: 4,
    padding: 10,
  },
  large_error: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "white",
    height: 400,
    borderRadius: 4,
    padding: 10,
  },
});
