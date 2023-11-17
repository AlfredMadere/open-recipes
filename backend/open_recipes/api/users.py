from fastapi import APIRouter

from typing import List, Union


from fastapi import FastAPI
from typing import Annotated, Optional
from sqlalchemy.engine import Engine
from fastapi import Depends, FastAPI
from open_recipes.models import Ingredient, Recipe, RecipeList, Review, User, PopulatedRecipe, CreateUserRequest, CreateRecipeListRequest, CreateRecipeRequest, RecipeListResponse, Tag, CreateTagRequest
from open_recipes.database import get_engine 
from sqlalchemy import text, func, distinct, case
import sqlalchemy
import uvicorn
from pydantic import BaseModel

router = APIRouter(
  prefix="/users",


)

@router.get("")
def get_users(engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
    """
    Get all users
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" ORDER BY id"""))
        rows= result.fetchall()
        return [User(id=id, name=name, email=email, phone=phone) for id, name, email, phone in rows]



@router.get('/{user_id}',response_model=User)
def get_user(user_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
    """
    Get one user
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""),{"user_id":user_id})
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

#SMOKE TESTED
@router.post('', response_model=None,status_code=201, responses={'201': {'model': User}})
def post_users(body: CreateUserRequest,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, User]:
    """
    Create a new user
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO "user" (name, email, phone)
                                    VALUES (:name, :email, :phone)
                                    RETURNING id, name, email, phone
                                   """
                                    ),{"name":body.name,"phone":body.phone,"email":body.email})
        
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

# @router.post("/{id}")
# def update_user(id: int, user : User,engine : Annotated[Engine, Depends(get_engine)]) -> User:

#     with engine.begin() as conn:
#         result = conn.execute(text(f"UPDATE users SET name = :name, email = :email, phone = :phone WHERE id = :id",{"name":user.name,"phone":user.phone,"email":user.email,"id":id}))
#         id, name, email, phone = result.fetchone()
#         return User(id=id, name=name, email=email, phone=phone)

# @router.delete("/{id}")
# def delete_user(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
#     with engine.begin() as conn:
#         result = conn.execute(text(f"""DELETE FROM "user" WHERE id = :id"""),{"id":id})
#         id, name, email, phone = result.fetchone()
#         return User(id=id, name=name, email=email, phone=phone)

@router.get("/{user_id}/ingredients/", response_model=None,status_code=200)
def get_users_inventory(user_id: int,engine : Annotated[Engine, Depends(get_engine)]  ) -> list[Ingredient]:
    with engine.begin() as conn:
        result = conn.execute(text(f"""
        SELECT id, name, type, storage, category_id
        FROM ingredient
        JOIN user_x_ingredient ON ingredient.id = user_x_ingredient.ingredient_id
        WHERE user_x_ingredient.user_id = :user_id

"""),{"user_id":user_id})
        rows = result.fetchall()
        return [Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) for id, name, type, storage, category_id in rows]

@router.post("/{user_id}/ingredients", response_model=None,status_code=201)
def update_users_inventory(body: list[Ingredient], user_id: int, engine: Annotated[Engine, Depends(get_engine)]) -> str:
    #Remove user inventory by deleting all rows in the user_x_ingredient table where user_id = user_id
    #Filter the list so there are no duplicate names
    #split up the list into those with ids and those without
    #for the ones without ids, search the database to see if there are any ingredients with that name and assign id if you find one, if you don't find an ingredient with that name, create one
    #You should now have an array of ingredients all with ids and with no duplicates
    #make entries in the user_x_ingredient table for each ingredient in the array
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM user_x_ingredient WHERE user_id = :user_id"), {'user_id': user_id})
        ingredient_dicts = [{attr: getattr(ingredient, attr) for attr in ['name', 'type', 'storage', 'category_id']} for ingredient in body]
        unique_ingredients = {ingredient_dict['name']: ingredient_dict for ingredient_dict in ingredient_dicts}
        values_clause = ", ".join(f"('{ingredient['name']}', " +
                                  f"{'NULL' if ingredient['type'] is None else repr(ingredient['type'])}, " +
                                  f"{'NULL' if ingredient['storage'] is None else repr(ingredient['storage'])}, " +
                                  f"{'NULL' if ingredient['category_id'] is None else ingredient['category_id']})"
                                  for ingredient in unique_ingredients.values())        
        upsert_query = f"""
            INSERT INTO ingredient (name, type, storage, category_id) VALUES {values_clause}
            ON CONFLICT (name) DO NOTHING
        """
        conn.execute(text(upsert_query))
        ingredient_names = list(unique_ingredients.keys())  # Use a list instead of tuple
        ingredient_ids = conn.execute(text("SELECT id FROM ingredient WHERE name = ANY(:names)"), {'names': ingredient_names}).fetchall()

        # Bulk insert into user_x_ingredient
        user_ingredients_data = [{'user_id': user_id, 'ingredient_id': id_[0]} for id_ in ingredient_ids]
        conn.execute(text("INSERT INTO user_x_ingredient (user_id, ingredient_id) VALUES (:user_id, :ingredient_id)"), user_ingredients_data)


        return "OK"

@router.post("/{user_id}/ingredients/{ingredient_id}", response_model=None,status_code=201)
def add_ingredient_to_user_inventory(user_id: int, ingredient_id: int, engine: Annotated[Engine, Depends(get_engine)]) -> str:
    with engine.begin() as conn:
        conn.execute(text(f"INSERT INTO user_x_ingredient (user_id, ingredient_id) VALUES (:user_id, :ingredient_id)"),{"user_id":user_id,"ingredient_id":ingredient_id})
        return "OK"
