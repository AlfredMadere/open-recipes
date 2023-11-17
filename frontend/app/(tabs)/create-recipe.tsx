import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "tamagui";

export default function Page() {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      servings: "",
      mins_prep: "",
      mins_cook: "",
      fieldArray: [],
      fieldArray2: [],
      instructions: "",
    },
    // defaultValues: {
    //   value1: [{ email: "Bill", password: "Luo" }],
    // },
  });

  const {
    fields: fields1,
    append: append1,
    remove: remove1,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "fieldArray", // unique name for your Field Array
  });
  const {
    fields: fields2,
    append: append2,
    remove: remove2,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "fieldArray2", // unique name for your Field Array
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log("Form Data: ", data);

    const items = getValues("fieldArray2");
    console.log(items);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          rules={{ required: true }}
        />

        <Text style={styles.label}>Description</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="description"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Servings</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="servings"
          rules={{ required: true }}
        />

        <Text style={styles.label}>Time</Text>
        <View style={styles.ingredient}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={`Prep Time`}
                placeholderTextColor={"gray"}
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
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
                style={styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="mins_cook"
            rules={{ required: true }}
          />
        </View>

        <Text style={styles.label}>Tags</Text>
        {fields1.map((field, index) => (
          <View key={field.id} style={styles.container}>
            <View style={styles.ingredient}>
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={`Key`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                )}
                name={`key[${index}].value`}
                defaultValue=""
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={`Value`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                )}
                name={`value[${index}].value`}
                defaultValue=""
              />

              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
                    setValue(`key[${index}].value`, "");
                    setValue(`value[${index}].value`, "");
                    remove1(index);
                  }}
                  title="Remove"
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}
        <View style={styles.smallButton}>
          <Button
            title="Add Tag"
            color="white"
            onPress={() => {
              append1({ value: "" });
            }}
          />
        </View>

        <Text style={styles.label}>Ingredients</Text>
        {fields2.map((field, index) => (
          <View key={field.id} style={styles.container}>
            <View style={styles.ingredient}>
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={`Quantity`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                )}
                name={`quantity[${index}].value`}
                defaultValue=""
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={`Units`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                )}
                name={`units[${index}].value`}
                defaultValue=""
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={`Ingredient`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={field.value}
                  />
                )}
                name={`ingredients[${index}].value`}
                defaultValue=""
              />

              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
                    setValue(`ingredients[${index}].value`, "");
                    setValue(`units[${index}].value`, "");
                    setValue(`quantity[${index}].value`, "");
                    remove2(index);
                  }}
                  title="Remove"
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}

        <View style={styles.smallButton}>
          <Button
            title="Add Ingredient"
            color="white"
            onPress={() => {
              append2({ value: "" });
            }}
          />
        </View>
        <Text style={styles.label}>Instructions</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="instructions"
          rules={{ required: true }}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Cancel"
          color="red"
          onPress={() => {
            reset({
              name: "",
              description: "",
            });
          }}
        />
        <Button title="Create" color="green" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}
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
});
