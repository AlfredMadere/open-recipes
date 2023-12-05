export type PopulatedRecipe = {
  name: string;
  description: string;
  id: number;
  mins_prep: number;
  mins_cook: number;
  category_id: number;
  author_id: number;
  created_at: string;
  procedure: string;
  default_servings: number;
  ingredients: Ingredient[];
  tags: Tag[];
};

export type Ingredient = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
};

export type Tag = {
  id: number;
  key: string;
  value: number;
};