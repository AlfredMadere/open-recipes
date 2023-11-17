import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import {
  useForm,
  useFieldArray,
  Controller,
  UseFieldArrayReturn,
} from "react-hook-form";
import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "tamagui";

interface FormValues {
  name: string;
  description: string;
  servings: string;
  mins_prep: string;
  mins_cook: string;
  instructions: string;
  tags: { category: string; value: string }[];
  ingredients: { quantity: string; units: string; value: string }[];
}

export default function Page() {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      servings: "",
      mins_prep: "",
      mins_cook: "",
      instructions: "",
      tags: [{ category: "", value: "" }],
      ingredients: [{ quantity: "", units: "", value: "" }],
    },
    // defaultValues: {
    //   value1: [{ email: "Bill", password: "Luo" }],
    // },
  });
  // const name = watch("name");
  // console.log("name: ", name);

  const {
    fields: fields1,
    append: append1,
    remove: remove1,
  } = useFieldArray({
    name: "tags",
    control, // control props comes from useForm (optional: if you are using FormContext)
  });
  const {
    fields: fields2,
    append: append2,
    remove: remove2,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log("Form Data: ", JSON.stringify(data));

    // const items = getValues("fieldArray2");
    // console.log(items);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
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
        <Text style={styles.label}>Servings</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["servings"] ? styles.error : styles.input}
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
                style={errors["mins_prep"] ? styles.error : styles.input}
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
                style={errors["mins_cook"] ? styles.error : styles.input}
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
                    style={
                      errors[`tags.${index}.category` as keyof FormValues]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Category`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.category` as keyof FormValues}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors[`tags.${index}` as keyof FormValues]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Value`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.value` as keyof FormValues}
                rules={{ required: true }}
                defaultValue=""
              />

              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
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
              append1({ category: "", value: "" });
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
                    style={
                      errors[`ingredients.${index}` as keyof FormValues]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Quantity`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.quantity` as keyof FormValues}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors[`ingredients.${index}` as keyof FormValues]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Units`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.units` as keyof FormValues}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors[`ingredients.${index}` as keyof FormValues]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Ingredient`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.value` as keyof FormValues}
                rules={{ required: true }}
              />

              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
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
              append2({ quantity: "", units: "", value: "" });
            }}
          />
        </View>
        <Text style={styles.label}>Instructions</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["instructions"] ? styles.error : styles.input}
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
        <Button
          title="Create"
          color="green"
          onPress={() => {
            console.log("on press");
            console.log("form errors", errors);
            handleSubmit(onSubmit)();
          }}
        />
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
  error: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    borderRadius: 4,
    padding: 10,
  },
});

// type FieldArray1Props = {
//   methods: UseFieldArrayReturn<{
//     name: string;
//     description: string;
//     servings: string;
//     mins_prep: string;
//     mins_cook: string;
//     instructions: string;
// }, never, "id">
// }
// function FieldArray1 ({methods} : FieldArray1Props) {
//   return {
//     <View>
//     {fields1.map((field, index) => (
//           <View key={field.id} style={styles.container}>
//             <View style={styles.ingredient}>
//               <Controller
//                 control={control}
//                 render={({ field }) => (
//                   <TextInput
//                     style={styles.input}
//                     placeholder={`Key`}
//                     placeholderTextColor={"gray"}
//                     onChangeText={field.onChange}
//                     value={field.value}
//                   />
//                 )}
//                 name={`key[${index}].value`}
//                 defaultValue=""
//               />
//               <Controller
//                 control={methods.control}
//                 render={({ field }) => (
//                   <TextInput
//                     style={styles.input}
//                     placeholder={`Value`}
//                     placeholderTextColor={"gray"}
//                     onChangeText={field.onChange}
//                     value={field.value}
//                   />
//                 )}
//                 name={`value[${index}].value`}
//                 defaultValue=""
//               />

//               <View style={styles.smallButton}>
//                 <Button
//                   onPress={() => {
//                     setValue(`key[${index}].value`, "");
//                     setValue(`value[${index}].value`, "");
//                     remove1(index);
//                   }}
//                   title="Remove"
//                   color="white"
//                 />
//               </View>
//             </View>
//           </View>}

//         </View>
//         )
//   };

// }
