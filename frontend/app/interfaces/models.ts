export type Recipe = {
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
};
