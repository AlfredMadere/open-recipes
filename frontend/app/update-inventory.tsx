import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { Button, Input } from "tamagui";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";

type Ingredient = {
  id: number | null;
  name: string;
};

type Form = {
  ingredients: Ingredient[];
};

const UpdateInventory = () => {
  //FIXME: hardcoded user id for now to demo functionality
  const user_id = 2;

  const updateInventoryMutation = useMutation({
    mutationFn: (newInventory: Ingredient[]) =>
      axios.post(
        `https://open-recipes.onrender.com/users/${user_id}/ingredients`,
        newInventory
      ),
    onSuccess: () => {
      // Handle successful update
      console.log("Inventory updated successfully");
    },
    onError: (error) => {
      // Handle error
      console.error("Error updating inventory", error);
    },
  });

  const onSubmit = (data: Form) => {
    console.log("Form Data: ", data);
    // updateInventoryMutation.mutate(data.ingredients);
  };
  const { control, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      ingredients: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "ingredients",
    keyName: "temp_id",
  });

  const getInventoryQuery = useQuery({
    queryKey: ["inventory", user_id],
    queryFn: () =>
      axios.get(
        `https://open-recipes.onrender.com/users/${user_id}/ingredients`
      ),
  });

  useEffect(() => {
    if (getInventoryQuery.data) {
      reset({ ingredients: getInventoryQuery.data.data });
    }
  }, [getInventoryQuery.data, reset]);

  //POST /users/{user_id}/inventory - update inventory. Should send an array of ingredients
  //GET /users/{user_id}/inventory - get inventory. Should be an array of ingredients

  //TODO: upon load of this component, get the inventory and update the react-hook-form state.
  //Allow users to delete ingredients from the form state or add ingredients to the form state
  //When the user clicks the update button, send a POST request to the backend to update the inventory
  // use react-hook-form useFieldArray for form management.

  return (
    <View style={{padding : 10, display: "flex", flexDirection: "column", gap: 10, alignItems: "center"}}>
      <Button onPress={() => getInventoryQuery.refetch()} bordered style={{width: "50%"}} >
        Refresh
      </Button>
      <View style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        {fields.map((field, index) => (
          <IngredientItem
            key={field.id || field.temp_id}
            ingredient={field}
            index={index}
            update={update}
            remove={remove}
          />
        ))}
        <View style={{ display: "flex", alignItems: "flex-end", flexDirection: "row" }}>
          <Button bordered onPress={() => append({ id: null, name: "" })}>
            Add Ingredient{" "}
          </Button>
        </View>
      </View>
      <Button onPress={handleSubmit(onSubmit)} bordered > Update Inventory</Button>
    </View>
  );
};

export default UpdateInventory;

interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
  update: (index: number, newValue: Ingredient) => void;
  remove: (index: number) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  index,
  update,
  remove,
}) => {
  return (
    <View
      key={ingredient.id}
      style={{ display: "flex", gap: 10, flexDirection: "row" }}
    >
      {ingredient.id ? (
        <Text style={{ width: "70%" }}>{ingredient.name}</Text>
      ) : (
        <Input
          placeholder="Ingredient Name"
          value={ingredient.name}
          onChangeText={(text) => update(index, { ...ingredient, name: text })}
          style={{ width: "70%" }}
        />
      )}
      <Button onPress={() => remove(index)} bordered style={{ color: "red" }}>
        Remove{" "}
      </Button>
    </View>
  );
};
