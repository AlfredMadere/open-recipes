import { Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { Button, Input, Spinner, getFontSize } from "tamagui";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Control, Controller, useFieldArray, useForm } from "react-hook-form";
import { AuthContext } from "./AuthContext";
import { Ionicons, Foundation} from "@expo/vector-icons";

type Ingredient = {
  id: number | null;
  name: string;
  category_id: string | null;
  type: string | null;
  storage: string | null;
};

type Form = {
  ingredients: Ingredient[];
};

const UpdateInventory = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userId } = authContext;

  const updateInventoryMutation = useMutation({
    mutationFn: (newInventory: Ingredient[]) => {
      if (userId === null) {
        throw new Error("User ID is null");
      }
      return axios.post(
        `https://open-recipes.onrender.com/users/${userId}/ingredients`,
        newInventory
      );
    },
    onSuccess: () => {
      // Handle successful update
      console.log("Inventory updated successfully");
    },
    onError: (error) => {
      // Handle error
      console.error("Error updating inventory", error);
    },
  });

  const onSubmit = async (data: Form) => {
    await updateInventoryMutation.mutateAsync(data.ingredients);
    await getInventoryQuery.refetch();
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

  const getInventoryQuery = useQuery<Ingredient[], Error>({
    queryKey: ["inventory", userId],
    queryFn: async () => {
      try {
         if (userId === null) {
           throw new Error("User ID is null");
         }
        const result = await axios.get<Ingredient[]>(
          `https://open-recipes.onrender.com/users/${userId}/ingredients/`
        );
        return result.data;
      } catch (error) {
        console.error("Error fetching inventory", error);
        return [];
      }
    },
  });

  useEffect(() => {
    if (getInventoryQuery.data) {
      reset({ ingredients: getInventoryQuery.data });
    }
  }, [getInventoryQuery.data, reset]);

  //POST /users/{user_id}/inventory - update inventory. Should send an array of ingredients
  //GET /users/{user_id}/inventory - get inventory. Should be an array of ingredients

  //TODO: upon load of this component, get the inventory and update the react-hook-form state.
  //Allow users to delete ingredients from the form state or add ingredients to the form state
  //When the user clicks the update button, send a POST request to the backend to update the inventory
  // use react-hook-form useFieldArray for form management.

  return (
    <View
      width={"100%"} 
      height={"100%"}
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        backgroundColor: "#EBE7E0",
        
      }}
    >

      <View style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        {fields.map((field, index) => (
          <IngredientItem
            key={field.id || field.temp_id}
            ingredient={field}
            index={index}
            update={update}
            remove={remove}
            control={control}
          />
        ))}
        <View
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "row",
          }}
        >
          <Button
            bordered
            size="$3" theme="active"
            hoverStyle={{ color: "white", backgroundColor: "green" }} // Change color on hover
            pressStyle={{ color: "white", backgroundColor: "green" }} // Change color on press
            color="white"
             backgroundColor="$green10"
            onPress={() =>
              append({
                id: null,
                name: "",
                type: null,
                storage: null,
                category_id: null,
              })
            }
          >
            Add Ingredient
          </Button>

        </View>
      </View>

      <Text>  </Text>
      <Button shadowRadius={10} // Shadow radius
          elevation={2} // Elevation for a 3D effect
          color="#6E6055"
          hoverStyle={{color: "white", backgroundColor: "#D7783B" }} // Change color on hover
          pressStyle={{ color: "white", backgroundColor: "#D7783B" }} // Change color on press
          size="$3" 
          borderRadius="$6" // Round the corners
          onPress={handleSubmit(onSubmit)}>
        Update Inventory
        {getInventoryQuery.isFetching ||
        updateInventoryMutation.status === "pending" ? (
          <Spinner size="small" color="$green10" />
        ) : (
          ""
        )}

      </Button>
      <Foundation name="refresh" size={24} color="#4B4037" onPress={() => {
          getInventoryQuery.refetch();
        }}/>
    </View>
  );
};

export default UpdateInventory;

interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
  update: (index: number, newValue: Ingredient) => void;
  remove: (index: number) => void;

  control: Control<Form, unknown>;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  index,
  remove,
  control,
}) => {
  return (
    <View
      key={ingredient.id}
      style={{ display: "flex", gap: 10, flexDirection: "row" }}
    >
      {ingredient.id ? (
        <Text style={{ width: "70%", fontSize: 15,
        fontWeight: 'bold'}}> • {ingredient.name}</Text>
        
      ) : (
        <Controller
          control={control}
          name={`ingredients.${index}.name`}
          defaultValue={ingredient.name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Ingredient Name..."
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={{ width: "70%", backgroundColor:"white"}}
            />
          )}
        />
      )}
      
      <Ionicons.Button name="remove" size={26} color="red" backgroundColor="#EBE7E0" onPress={() => remove(index)}/>
    </View>
  );
};
