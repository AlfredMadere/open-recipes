import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "tamagui";
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
  const { authToken } = authContext;

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
      author_id: null,
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
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["name"] ? styles.error : styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          rules={{ required: true }}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["description"] ? styles.error : styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="description"
          rules={{ required: true }}
        />

        {/* Servings */}
        <Text style={styles.label}>Servings</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["default_servings"] ? styles.error : styles.input}
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
        <Text style={styles.label}>Time</Text>
        <View style={styles.ingredient}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={`Prep Time`}
                placeholderTextColor={"gray"}
                style={errors["mins_prep"] ? styles.error : styles.input}
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
                placeholder={`Cook Time`}
                placeholderTextColor={"gray"}
                style={errors["mins_cook"] ? styles.error : styles.input}
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
        <Text style={styles.label}>Tags</Text>
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
                        : styles.input
                    }
                    placeholder={`Key`}
                    placeholderTextColor={"gray"}
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
                        : styles.input
                    }
                    placeholder={`Value`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.value` as keyof Recipe}
                rules={{ required: true }}
                defaultValue=""
              />
              {/* remove tag */}
              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
                    removeTag(index);
                  }}
                  title="Remove"
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}
        {/* add tag */}
        <View style={styles.smallButton}>
          <Button
            title="Add Tag"
            color="white"
            onPress={() => {
              appendTag({ key: "", value: "" });
            }}
          />
        </View>

        {/* Ingredients */}
        <Text style={styles.label}>Ingredients</Text>
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
                        : styles.input
                    }
                    placeholder={`Quantity`}
                    placeholderTextColor={"gray"}
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
                        : styles.input
                    }
                    placeholder={`Unit`}
                    placeholderTextColor={"gray"}
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
                        : styles.input
                    }
                    placeholder={`Ingredient`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.name` as keyof Recipe}
                rules={{ required: true }}
              />
              {/* remove ingredient */}
              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
                    removeIngredient(index);
                  }}
                  title="Remove"
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}
        {/* add ingredient */}
        <View style={styles.smallButton}>
          <Button
            title="Add Ingredient"
            color="white"
            onPress={() => {
              appendIngredient({
                quantity: "",
                unit: "",
                name: "",
                storage: "",
              });
            }}
          />
        </View>

        {/* Procedure */}
        <Text style={styles.label}>Procedure</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["procedure"] ? styles.error : styles.input}
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
          title="Cancel"
          color="red"
          onPress={() => {
            reset(emptyData);
            Alert.alert("form reset");
          }}
        />

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
          title="Create"
          color="green"
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
        />
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
    color: "white",
    margin: 20,
    marginLeft: 0,
  },
  footer: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "gray",
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
    height: 40,
    backgroundColor: "gray",
    borderRadius: 4,
    justifyContent: "flex-end",
    flex: 0,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
    padding: 8,
    backgroundColor: "gray",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 4,
    padding: 10,
  },
  error: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    borderRadius: 4,
    padding: 10,
  },
});
