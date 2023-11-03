from sqlalchemy import text
# from database import engine

class EntityTracker:
  users = []
  recipes = []
  recipe_lists = []
  reviews = []
  ingredients = []
  def __init__(self) -> None:
    pass

  def add_user(self, user_id):
    self.users.append(user_id)

  def add_recipe(self, recipe_id):
    self.recipes.append(recipe_id)
  
  def remove_all(self):
    with engine.begin() as conn:
      print("deleting everything")
      conn.execute(text(f"""DELETE FROM recipe_list"""))
      conn.execute(text(f"""DELETE FROM recipe"""))
      conn.execute(text(f"""DELETE FROM "user" """))
      # conn.execute(text(f"DELETE FROM recipes WHERE id IN ({','.join([str(recipe_id) for recipe_id in self.recipes])})"))
      # conn.execute(text(f"DELETE FROM recipe_lists WHERE id IN ({','.join([str(recipe_list_id) for recipe_list_id in self.recipe_lists])})"))
      # conn.execute(text(f"DELETE FROM reviews WHERE id IN ({','.join([str(review_id) for review_id in self.reviews])})"))
      # conn.execute(text(f"DELETE FROM ingredients WHERE id IN ({','.join([str(ingredient_id) for ingredient_id in self.ingredients])})"))
      # conn.execute(text(f"DELETE FROM recipe_ingredients WHERE recipe_id IN ({','.join([str(recipe_id) for recipe_id in self.recipes])})"))
      # conn.execute(text(f"DELETE FROM recipe_x_tag WHERE recipe_id IN ({','.join([str(recipe_id) for recipe_id in self.recipes])})"))
      # conn.execute(text(f"DELETE FROM recipe_x_recipe_list WHERE recipe_id IN ({','.join([str(recipe_id) for recipe_id in self.recipes])})"))
      # conn.execute(text(f"DELETE FROM recipe_x_recipe_list WHERE recipe_list_id IN ({','.join([str(recipe_list_id) for recipe_list_id in self.recipe_lists])})"))
      # conn.execute(text(f"DELETE FROM recipe_x_tag WHERE tag_id IN ({','.join([str(tag_id) for tag_id in self.tags])})"))
      # conn.execute(text(f"DELETE FROM tags WHERE id IN ({','.join([str(tag_id) for tag_id in self.tags])})"))