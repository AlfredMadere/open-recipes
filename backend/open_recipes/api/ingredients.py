from fastapi import APIRouter

from typing import List, Union

from fastapi import FastAPI
from typing import Annotated, Optional
from sqlalchemy.engine import Engine
from fastapi import Depends
from open_recipes.models import Ingredient, Recipe, RecipeList, Review, User, PopulatedRecipe, CreateUserRequest, CreateRecipeListRequest, CreateRecipeRequest, RecipeListResponse, Tag, CreateTagRequest
from open_recipes.database import get_engine 
from sqlalchemy import text, func, distinct, case
import sqlalchemy
import uvicorn
from pydantic import BaseModel

router = APIRouter(
  prefix="/ingredients",


)

#returns list of all available ingredients
@router.get('', response_model=List[Ingredient])
def get_ingredients(engine : Annotated[Engine, Depends(get_engine)]) -> List[Ingredient]:
    """
    Get all ingredients
    """
    # if user_id is None:
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, type, storage, category_id 
                                FROM ingredient
                                ORDER BY id"""))
        rows = result.fetchall()
        ingredients = [Ingredient(id=row.id, name=row.name, type=row.type, storage=row.storage, category_id=row.category_id) for row in rows]
    # else:
    #     pass
    #     with engine.begin() as conn:
    #         result = conn.execute(text(f"""SELECT id, name, type, storage, category_id 
    #                                 FROM ingredient
    #                                 JOIN user_x_ingredient ON ingredient.id = user_x_ingredient.ingredient_id
    #                                 JOIN user ON user.id = user_x_ingredient.user_id
    #                                 WHERE user.id = :user
    #                                 ORDER BY id"""),{"user":user_id})
    #         rows = result.fetchall()
    #         ingredients = [Ingredient(id=row.id, name=row.name, type=row.type, storage=row.storage, category_id=row.category_id) for row in rows]
    return ingredients

#returns single ingredient with given ingredient_id
@router.get('/{id}', response_model=Ingredient)
def get_ingredient_by_id(id : int | None,engine : Annotated[Engine, Depends(get_engine)]) -> Ingredient:
    """
    Get an ingredient by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, type, storage, category_id 
                                   FROM ingredient
                                   WHERE id = :id"""))
        id, name, storage, type, category_id = result.fetchone()
        return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) 

# @router.post("/{id}")
# def update_ingredient(id: int | None, ingredient : Ingredient ,engine : Annotated[Engine, Depends(get_engine)]) -> Ingredient:
#     """
#     Update an ingredient by id 
#     """
#     query_string = f"""UPDATE ingredient 
#                                     SET name = :name, type = :type, storage = :storage, category_id = :category_id
#                                     WHERE id = :id"""
#     with engine.begin() as conn:
#         result = conn.execute(text(query_string,{"name":ingredient.name, "type":ingredient.type, "storage": ingredient.storage, "category_id": ingredient.category_id}))
#         id, name, type, storage, category_id = result.fetchone()
#         return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) 

        

# @router.delete("/ingredient/{id}")
# def delete_ingredient(id: int,user : int | None,engine : Annotated[Engine, Depends(get_engine)]) -> str:
#     with engine.begin() as conn:
#         conn.execute(text(f"""DELETE FROM ingredient
#                             WHERE id = :id""",{"id":id}))
#         return "OK" 
 
 #creates a new ingredient
@router.post('', response_model=None, status_code=201, responses={'201': {'model': Ingredient}})
def post_ingredients(body: Ingredient, engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Ingredient]:
    """
    Create a new ingredient
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO ingredient (name, type, storage, category_id)
                                    VALUES (:name, :type, :storage, :category_id)
                                    RETURNING id, name, type, storage, category_id
                                   """
                                    ), {"name":body.name, "type":body.type, "storage":body.storage, "category_id":body.category_id})
        id, name, type, storage, category_id = result.fetchone()
        #print(id, name, storage, type, category_id)

        return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id)
    
    