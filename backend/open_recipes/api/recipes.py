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
  prefix="/recipes",


)

class SearchResults(BaseModel):
    recipe: List[Recipe]
    next_cursor: Optional[int]
    prev_cursor: Optional[int]


@router.get('', response_model=SearchResults)
def get_recipes(engine : Annotated[Engine, Depends(get_engine)], name: str | None = None, max_time : int | None = None, cursor: int = 0, tag_key: str | None = None, tag_value: str | None = None, use_inventory_of: int | None = None) -> SearchResults:
    """
    Get all recipes
    """

    print("Name:", name)  # Debug: Print the value of name
    print("Max Time:", max_time)  # Debug: Prin
    #

    metadata_obj = sqlalchemy.MetaData()
    recipe = sqlalchemy.Table("recipe", metadata_obj, autoload_with=engine)
    recipe_x_tag = sqlalchemy.Table("recipe_x_tag", metadata_obj, autoload_with=engine)
    recipe_tag = sqlalchemy.Table("recipe_tag", metadata_obj, autoload_with=engine)
    recipe_ingredients= sqlalchemy.Table("recipe_ingredients", metadata_obj, autoload_with=engine)
    user_x_ingredient= sqlalchemy.Table("user_x_ingredient", metadata_obj, autoload_with=engine)
    page_size = 10

    stmt = (
        sqlalchemy.select(
            recipe.c.id,
            recipe.c.name,
            recipe.c.mins_prep,
            recipe.c.category_id,
            recipe.c.mins_cook,
            recipe.c.description,
            recipe.c.author_id,
            recipe.c.default_servings,
            recipe.c.procedure
        )
        .outerjoin(recipe_x_tag, recipe.c.id == recipe_x_tag.c.recipe_id)
        .outerjoin(recipe_tag, recipe_x_tag.c.tag_id == recipe_tag.c.id)
        
    )

    if name is not None:
        stmt = stmt.where(recipe.c.name.ilike(f"%{name}%"))
    if max_time is not None:
        stmt = stmt.where(recipe.c.mins_cook + recipe.c.mins_prep <= max_time)
    if tag_key is not None:
        stmt = stmt.where(recipe_tag.c.key == tag_key)
    if tag_value is not None:
        stmt = stmt.where(recipe_tag.c.value == tag_value)
    if use_inventory_of is not None:
       stmt = (stmt
            .join(recipe_ingredients, recipe_ingredients.c.recipe_id == recipe.c.id)
            .outerjoin(user_x_ingredient, 
                       (recipe_ingredients.c.ingredient_id == user_x_ingredient.c.ingredient_id) & 
                       (user_x_ingredient.c.user_id == use_inventory_of))
            .group_by(
                recipe.c.id,
                recipe.c.name,
                recipe.c.mins_prep,
                recipe.c.category_id,
                recipe.c.mins_cook,
                recipe.c.description,
                recipe.c.author_id,
                recipe.c.default_servings,
                recipe.c.procedure
            )
            .having(
                func.count(distinct(recipe_ingredients.c.ingredient_id)) == 
                func.count(distinct(case((user_x_ingredient.c.ingredient_id != None, recipe_ingredients.c.ingredient_id),)))
            )
    )

    stmt = (stmt.limit(page_size + 1)
        .offset(cursor)
        .order_by(recipe.c.name)
    )


    print('statement', stmt)
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        rows = result.fetchall()

    recipes_result = [Recipe(id=id, name=name, mins_prep=mins_prep, category_id=category_id, mins_cook=mins_cook, description=description, author_id=author_id, default_servings=default_servings, procedure=procedure) for id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure in rows]

    next_cursor = None if len(recipes_result) <= page_size else cursor + page_size
    prev_cursor = cursor - page_size if cursor > 0 else None
    
    search_result = SearchResults(
        prev_cursor= prev_cursor,
        next_cursor= next_cursor,
        recipe= recipes_result 
    )

    return search_result


#SMOKE TESTED
#FIXME: increment created at in database
@router.post('', response_model=None, status_code=201, responses={'201': {'model': CreateRecipeRequest}})
def post_recipes(body: CreateRecipeRequest,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Recipe]:
    """
    Create a new recipe
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO recipe (name, mins_prep, mins_cook, description, default_servings, author_id, procedure)
                                   VALUES (
                                   :name,
                                   :mins_prep,
                                   :mins_cook,
                                   :description,
                                   :default_servings,
                                   :author_id,
                                   :procedure)
                                   RETURNING id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure"""
                                   
            ), {"name":body.name,
             "author_id":body.author_id,
             "mins_prep":body.mins_prep,
             "mins_cook":body.mins_cook
             ,"description":body.description,
             "default_servings":body.default_servings,
             "procedure":body.procedure})
        id,name,mins_prep,mins_cook,description,default_servings,author_id,procedure = result.fetchone()
        recipe = Recipe(id=id,name=name,mins_prep=mins_prep,mins_cook=mins_cook,description=description,default_servings=default_servings,author_id=author_id, procedure=procedure)
        return recipe

#SMOKE TESTED
@router.get('/{id}', response_model=Recipe)
def get_recipe(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
    """
    Get a recipe by id
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure FROM recipe WHERE id = :id"""),{"id":id})
        id, name, mins_prep,mins_cook,description,default_servings,author_id,procedure = result.fetchone()
        return Recipe(id=id,name=name,mins_prep=mins_prep,mins_cook=mins_cook,description=description,default_servings=default_servings,author_id=author_id, procedure=procedure)

@router.post("/{id}", status_code=201, response_model=None)
def update_recipe(id: int, recipe : Recipe,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
    pass

@router.delete("/{id}")
def delete_recipe(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    pass

@router.post('/{recipe_id}/recipe-lists/{recipe_list_id}', status_code=201, response_model=None)
def add_recipe_to_recipe_list(recipe_id: int, recipe_list_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        conn.execute(text(f"INSERT INTO recipe_x_recipe_list (recipe_id, recipe_list_id) VALUES (:recipe_id, :recipe_list_id)"),{"recipe_id":recipe_id,"recipe_list_id":recipe_list_id})
        return "OK"

@router.post('/{recipe_id}/tags/{tag_id}', status_code=201, response_model=None)
def add_recipe_tag(recipe_id: int, tag_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        conn.execute(text(f"INSERT INTO recipe_x_tag (recipe_id, tag_id) VALUES (:recipe_id, :tag_id)"),{"recipe_id":recipe_id,"tag_id":tag_id})
        return "OK"

@router.get('/{recipe_id}/tags', response_model=List[Tag])
def get_recipe_tags(recipe_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[Tag]:
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT rt.id, rt.key, rt.value 
                                   FROM recipe_x_tag rxt
                                   JOIN recipe_tag rt on rxt.tag_id = rt.id 
                                   WHERE rxt.recipe_id = :recipe_id"""),{"recipe_id":recipe_id})
        rows = result.fetchall()
        return [Tag(id=id, key=key, value=value) for id, key, value in rows]

@router.post('/{recipe_id}/ingredients/{ingredient_id}', status_code=201, response_model=None)
def add_ingredient_to_recipe(recipe_id: int, ingredient_id: int, engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        #FIXME: add ability to specify quantity and unit
        conn.execute(text(f"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (:recipe_id, :ingredient_id, :quantity)"),{"recipe_id":recipe_id,"ingredient_id":ingredient_id, "quantity":1})
        return "OK"

@router.get('/{recipe_id}/ingredients', response_model=List[Ingredient])
def get_recipe_ingredients(recipe_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[Ingredient]:
    with engine.begin() as conn:
        result = conn.execute(text(f"""SELECT ri.id, ri.name, ri.type, ri.storage, ri.category_id 
                                   FROM recipe_ingredients rix
                                   JOIN ingredient ri on rix.ingredient_id = ri.id 
                                   WHERE rix.recipe_id = :recipe_id"""),{"recipe_id":recipe_id})
        rows = result.fetchall()
        return [Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) for id, name, type, storage, category_id in rows]

@router.get('/reviews', response_model=List[Review])
def get_reviews(engine : Annotated[Engine, Depends(get_engine)]) -> List[Review]:
    """
    Get all reviews
    """
    with engine.begin() as conn:
        result = conn.execute(text(f"SELECT id, stars, author_id, content, recipe_id, FROM reviews ORDER BY created_at"))
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)