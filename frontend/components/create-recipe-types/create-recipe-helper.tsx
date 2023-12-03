// type declarations and data for create-recipe page
export type Recipe = {
  name: string;
  mins_prep: string;
  mins_cook: string;
  description: string;
  default_servings: string;
  procedure: string;
  created_at: string;
  author_id: string;
  tags: { key: string; value: string }[];
  ingredients: {
    quantity: string;
    unit: string;
    name: string;
    storage: string;
  }[];
};

export type FormattedRecipe = {
  name: string;
  mins_prep: number;
  mins_cook: number;
  description: string;
  default_servings: number;
  procedure: string;
  created_at: string;
  author_id: string | null;
  tags: { key: string; value: string }[];
  ingredients: {
    quantity: number;
    unit: string;
    name: string;
    storage: string;
  }[];
};

// Empty Form Data
export const emptyData = {
  name: "",
  mins_prep: "",
  mins_cook: "",
  description: "",
  default_servings: "",
  procedure: "",
  created_at: "",
  author_id: "",
  tags: [
    {
      key: "",
      value: "",
    },
  ],
  ingredients: [
    {
      name: "",
      storage: "",
      quantity: "",
      unit: "",
    },
  ],
};

// EXAMPLE DATA - used in "Fill Form - Test" button
export const sampleData = {
  name: "PB&J",
  mins_prep: "5",
  mins_cook: "0",
  description: "a classic peanut butter and jelly sandwich",
  default_servings: "1",
  procedure:
    "First, spread peanut butter on one piece of bread. Next, spread jam on the other piece of bread. Finally, combine the two halves of the sandwich. Cut to preference and serve.",
  created_at: "",
  author_id: "",
  tags: [
    {
      key: "Difficulty",
      value: "Easy",
    },
  ],
  ingredients: [
    {
      name: "bread",
      storage: "FRIDGE",
      quantity: "2",
      unit: "slices",
    },
    {
      name: "peanut butter",
      storage: "FRIDGE",
      quantity: "2",
      unit: "tbsp",
    },
    {
      name: "strawberry jam",
      storage: "FRIDGE",
      quantity: "2",
      unit: "tbsp",
    },
  ],
};
