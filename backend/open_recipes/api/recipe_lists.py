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
  prefix="/recipe-lists",
)

class SearchResults(BaseModel):
    tags: List[Tag]
    next_cursor: Optional[int]
    prev_cursor: Optional[int]

metadata_obj = sqlalchemy.MetaData()
@router.get('', response_model=List[RecipeList])
def get_recipe_lists(engine : Annotated[Engine, Depends(get_engine)]) -> List[RecipeList]:
    """
    Get all recipe lists
    """
    recipeListAll = []
    with engine.begin() as conn:
        result = conn.execute(text(f"SELECT id, name, description FROM recipe_list ORDER BY id"))
        rows = result.fetchall()
        for row in rows: 
            id, name, description = row
            recipe = RecipeList(id=id, name=name, description=description)
            recipeListAll.append(recipe)
        return recipeListAll
@router.post(
    '', response_model=None, status_code=201, responses={'201': {'model': RecipeList}}
)
def post_recipe_lists(body: CreateRecipeListRequest,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, RecipeList]:
    """
    Create a new recipe list
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO recipe_list (name, description)
                                    VALUES (:name, :description)
                                    RETURNING id, name, description 
                                   """
                                    ),{"name":body.name,"description":body.description})
        
        id, name, description= result.fetchone()
        #print(id, name, description)
        return RecipeList(id=id, name=name, description=description)

@router.post('/{recipe_list_id}/recipe/{recipe_id}',status_code=201, response_model=Recipe)
def post_recipe_to_list(recipe_id: int, recipe_list_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
    """
    Add a recipe to a recipe list
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO recipe_x_recipe_list (recipe_id, recipe_list_id)
                                    VALUES (:recipe_id, :recipe_list_id)
                                    RETURNING recipe_id, recipe_list_id 
                                   """
                                    ),{"recipe_id":recipe_id,"recipe_list_id":recipe_list_id})
        
        recipe_id, recipe_list_id = result.fetchone()
        return Recipe(recipe_id=recipe_id, recipe_list_id=recipe_list_id)

#SMOKE TESTED
@router.get('/{id}', response_model=RecipeListResponse)
def get_recipe_list(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> RecipeList:
    """
    Get a recipe list by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, description FROM recipe_list WHERE id = :recipe_id"""),{"recipe_id": id})
        id, name, description = result.fetchone()
        result = conn.execute(text(f"""SELECT id, name, description, mins_prep, mins_cook, default_servings, author_id, procedure
                                        FROM recipe
                                        JOIN recipe_x_recipe_list AS rl ON rl.recipe_id = recipe.id
                                        WHERE rl.recipe_list_id = :list_id"""),{"list_id": id})
        rows = result.fetchall()
        recipes = [Recipe(id=row.id, name=row.name, description=row.description, mins_prep=row.mins_prep, mins_cook=row.mins_cook, default_servings=row.default_servings, author_id=row.author_id, procedure=row.procedure) for row in rows]
        #print(recipes)
        return RecipeListResponse(id=id, name=name, description= description, recipes=recipes)

# @router.post("/{id}")
# def update_recipe_list(id: int, recipe_list : RecipeList, engine : Annotated[Engine, Depends(get_engine)]) -> RecipeList:
#     with engine.begin() as conn:
#         result = conn.execute(text(f"""UPDATE recipe_list 
#                                    SET name = :name, description = :description
#                                    WHERE id = :id""",{"name":recipe_list.name, "description":recipe_list.description, "id":id}))
#         id, name, description = result.fetchone()
#         return RecipeList(id=id, name=name, description=description)

@router.delete("/{id}")
def delete_recipe_list(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        result = conn.execute(text(f"""DELETE FROM recipe_list 
                                   WHERE id = :id"""),{"id":id})
    return "OK"
       