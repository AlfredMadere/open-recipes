from typing import Annotated, List, Literal, Optional

import sqlalchemy
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ValidationError
from sqlalchemy import exc, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError

from open_recipes.api.auth import TokenData, get_current_user
from open_recipes.database import (get_engine, recipe, recipe_ingredients,
                                   recipe_tag, recipe_x_tag, user_x_ingredient)
from open_recipes.models import (AuthorResponseUser,
                                 CreateIngredientWithAmount,
                                 CreateRecipeRequest, Ingredient,
                                 IngredientWithAmount, PopulatedRecipe, Recipe,
                                 Tag)

router = APIRouter(
    prefix="/recipes",
)


class SearchResults(BaseModel):
    recipe: List[Recipe]
    next_cursor: Optional[int]
    prev_cursor: Optional[int]


# gets all recipes, is our search functionality
@router.get("", response_model=SearchResults)
def get_recipes(
    engine: Annotated[Engine, Depends(get_engine)],
    name: str | None = None,
    max_time: int | None = None,
    cursor: int = 0,
    tag_key: str | None = None,
    tag_value: str | None = None,
    authored_by: int | None = None,
    use_inventory_of: int | None = None,
    current_user: TokenData = Depends(get_current_user),
    order_by: Literal["calories"] | Literal["name"] = "name",
) -> SearchResults:
    """
    Get all recipes
    """
   
    try:
        page_size = 10

        if use_inventory_of:
            use_inventory_of = current_user.id

        stmt = sqlalchemy.select(
            recipe.c.id,
            recipe.c.name,
            recipe.c.mins_prep,
            recipe.c.category_id,
            recipe.c.mins_cook,
            recipe.c.description,
            recipe.c.author_id,
            recipe.c.default_servings,
            recipe.c.procedure,
            recipe.c.calories,
        ).distinct()

        if name is not None:
            stmt = stmt.where(recipe.c.name.ilike(f"%{name}%"))
        if max_time is not None:
            stmt = stmt.where(recipe.c.mins_cook + recipe.c.mins_prep <= max_time)
        if tag_key or tag_value:
            stmt = stmt.outerjoin(
                recipe_x_tag, recipe.c.id == recipe_x_tag.c.recipe_id
            ).outerjoin(recipe_tag, recipe_x_tag.c.tag_id == recipe_tag.c.id)
        if tag_key is not None:
            stmt = stmt.where(recipe_tag.c.key == tag_key)
        if tag_value is not None:
            stmt = stmt.where(recipe_tag.c.value == tag_value)
        if authored_by is not None:
            stmt = stmt.where(recipe.c.author_id == authored_by)
        if use_inventory_of is not None:
            # print("using inventory of user with id", use_inventory_of)
            # stmt = (
            #     stmt.join(
            #         recipe_ingredients, recipe_ingredients.c.recipe_id == recipe.c.id
            #     )
            #     .outerjoin(
            #         user_x_ingredient,
            #         (
            #             recipe_ingredients.c.ingredient_id
            #             == user_x_ingredient.c.ingredient_id
            #         )
            #         & (user_x_ingredient.c.user_id == use_inventory_of),
            #     )
            #     .group_by(
            #         recipe.c.id,
            #         recipe.c.name,
            #         recipe.c.mins_prep,
            #         recipe.c.category_id,
            #         recipe.c.mins_cook,
            #         recipe.c.description,
            #         recipe.c.author_id,
            #         recipe.c.default_servings,
            #         recipe.c.procedure,
            #         recipe.c.calories,
            #     )
            #     .distinct()
            #     .outerjoin(recipe_x_tag, recipe.c.id == recipe_x_tag.c.recipe_id)
            #     .outerjoin(recipe_tag, recipe_x_tag.c.tag_id == recipe_tag.c.id)
            # )

            stmt = stmt.outerjoin(
                recipe_ingredients, recipe_ingredients.c.recipe_id == recipe.c.id
            ).filter(
                ~sqlalchemy.exists()
                .where(
                    (recipe_ingredients.c.recipe_id == recipe.c.id)
                    & ~sqlalchemy.exists()
                    .where(
                        (
                            user_x_ingredient.c.ingredient_id
                            == recipe_ingredients.c.ingredient_id
                        )
                        & (user_x_ingredient.c.user_id == use_inventory_of)
                    )
                    .correlate(recipe_ingredients)
                )
                .correlate(recipe)
            )

        if order_by == "calories":
            stmt = stmt.limit(page_size + 1).offset(cursor).order_by(recipe.c.calories)
        else:
            stmt = stmt.limit(page_size + 1).offset(cursor).order_by(recipe.c.name)

        with engine.connect() as conn:
            result = conn.execute(stmt)
            rows = result.fetchall()
        recipes_result = [
            Recipe(
                id=id,
                name=name,
                mins_prep=mins_prep,
                category_id=category_id,
                mins_cook=mins_cook,
                description=description,
                author_id=author_id,
                default_servings=default_servings,
                procedure=procedure,
                calories=calories,
            )
            for id, name, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure, calories in rows
        ]

        next_cursor = None if len(recipes_result) <= page_size else cursor + page_size
        prev_cursor = cursor - page_size if cursor > 0 else None
        search_result = SearchResults(
            prev_cursor=prev_cursor, next_cursor=next_cursor, recipe=recipes_result
        )
        return search_result

    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# SMOKE TESTED
# FIXME: increment created at in database
@router.post("", status_code=201)
def create_recipes(
    body: CreateRecipeRequest,
    engine: Annotated[Engine, Depends(get_engine)],
    current_user: TokenData = Depends(get_current_user),
):
    #     """
    #     Create a new recipe
    #     """

    try:
        user_id = current_user.id
        with engine.begin() as conn:
            # try:

            for i, tag_dict in enumerate(body.tags):
                try:
                    tag = Tag.parse_obj(tag_dict)
                    body.tags[i] = tag  # Attempt to parse the dictionary as a Tag
                except ValidationError:
                    raise TypeError(
                        "Expected 'tag_dict' to have the same attributes as 'Tag', but it doesn't"
                    )

                # verify that its of type Tag, throw type error if not
                result = conn.execute(
                    text(
                        """INSERT INTO recipe_tag (key, value) VALUES (:key, :value) 
                                    ON CONFLICT (key, value) DO NOTHING"""
                    ),
                    {
                        "key": tag.key,
                        "value": tag.value,
                    },
                )

            result = conn.execute(
                text(
                    "SELECT id from recipe_tag where key = ANY(:keys) and value = ANY(:values)"
                ),
                {
                    "keys": [tag.key for tag in body.tags],
                    "values": [tag.value for tag in body.tags],
                },
            ).fetchall()

            tag_ids = [id[0] for id in result]

            result = conn.execute(
                text(
                    """INSERT INTO recipe (name, mins_prep, mins_cook, description, default_servings, author_id, procedure,calories)
                                    VALUES (
                                    :name,
                                    :mins_prep,
                                    :mins_cook,
                                    :description,
                                    :default_servings,
                                    :author_id,
                                    :procedure,
                                    :calories)
                                    RETURNING id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure, calories"""
                ),
                {
                    "name": body.name,
                    "author_id": user_id,
                    "mins_prep": body.mins_prep,
                    "mins_cook": body.mins_cook,
                    "description": body.description,
                    "default_servings": body.default_servings,
                    "procedure": body.procedure,
                    "calories": body.calories,
                },
            )
            (
                id,
                name,
                mins_prep,
                mins_cook,
                description,
                default_servings,
                author_id,
                procedure,
                calories,
            ) = result.fetchone()

            # Convert ingredient dict to Model and insert missing ingredients

            for i, ingredient_dict in enumerate(body.ingredients):
                try:
                    ingredient = CreateIngredientWithAmount.parse_obj(ingredient_dict)
                    body.ingredients[
                        i
                    ] = ingredient  # Attempt to parse the dictionary as a Tag
                except ValidationError:
                    raise TypeError(
                        "Expected 'ingredient_dict' to have the same attributes as 'CreateIngredientRequest', but it doesn't"
                    )

                # FIXME: there will be many ingredients so if this is low, build a values clause and do it in one query
                upsert_query = """
                INSERT INTO ingredient (name, type, storage, category_id) VALUES (:name, :type, :storage, :category_id)
                ON CONFLICT (name) DO NOTHING
                """
                conn.execute(
                    text(upsert_query),
                    {
                        "name": ingredient.name,
                        "type": ingredient.type,
                        "storage": ingredient.storage,
                        "category_id": ingredient.category_id,
                    },
                )

            # Get ids of all ingrients to associate with recipe

            ingredient_ids_result = conn.execute(
                text("SELECT id, name from ingredient where name = ANY(:names)"),
                {
                    "names": [ingredient.name for ingredient in body.ingredients],
                },
            ).fetchall()
            # print("ingredients result", ingredient_ids_result)
            ingredients = [
                {"id": element[0], "name": element[1]}
                for element in ingredient_ids_result
            ]
            # print("ingredients", ingredients)
            sorted_ingredients_w_id = sorted(ingredients, key=lambda x: x["name"])
            sorted_ingredients_w_quantity = sorted(
                body.ingredients, key=lambda x: x.name
            )

            for i, ingredient in enumerate(sorted_ingredients_w_id):
                # print(f"sorted ingredients ingredient: {sorted_ingredients_w_quantity[i]}")
                conn.execute(
                    text(
                        """INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (:recipe_id, :ingredient_id, :quantity, :unit)"""
                    ),
                    {
                        "recipe_id": id,
                        "ingredient_id": ingredient["id"],
                        "quantity": sorted_ingredients_w_quantity[i].quantity,
                        "unit": sorted_ingredients_w_quantity[i].unit,
                    },
                )

            for tag_id in tag_ids:
                conn.execute(
                    text(
                        """INSERT INTO recipe_x_tag (recipe_id, tag_id) VALUES (:recipe_id, :tag_id)"""
                    ),
                    {"recipe_id": id, "tag_id": tag_id},
                )

            recipe = Recipe(
                id=id,
                name=name,
                mins_prep=mins_prep,
                mins_cook=mins_cook,
                description=description,
                default_servings=default_servings,
                author_id=author_id,
                procedure=procedure,
                calories=calories,
            )
            return recipe
    except TypeError as e:
        print("There was a type error:", e)
        raise HTTPException(status_code=400, detail="Type error, probably your fault")
    except SQLAlchemyError as e:
        print("There was a database error:", e)
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        print("There was an unexpected error:", e)
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


# SMOKE TESTED
# returns recipe with given id
@router.get("/{recipe_id}", response_model=PopulatedRecipe)
def get_recipe_by_id(
    recipe_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> PopulatedRecipe:
    """
    Get a recipe by id
    """
    try:
        with engine.begin() as conn:
            recipe_result = conn.execute(
                text(
                    """SELECT id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure, calories 
                                       FROM recipe 
                                       WHERE id = :id"""
                ),
                {"id": recipe_id},
            )

            ingredients_result = conn.execute(
                text(
                    """SELECT i.id, i.name, i.type, i.storage, i.category_id, rix.quantity, rix.unit 
                                                   FROM ingredient i 
                                                   JOIN recipe_ingredients rix on i.id = rix.ingredient_id
                                                   WHERE rix.recipe_id = :id 
                                                   """
                ),
                {"id": recipe_id},
            )
            tags_result = conn.execute(
                text(
                    """SELECT t.id, t.key, t.value 
                                            FROM recipe_tag t
                                            JOIN recipe_x_tag rxt on t.id = rxt.tag_id
                                            WHERE rxt.recipe_id = :id
                                            """
                ),
                {"id": recipe_id},
            )
            author_result = conn.execute(
                text(
                    """
                                            SELECT u.id, u.name
                                            FROM "user" u
                                            JOIN recipe r on u.id = r.author_id
                                            WHERE r.id = :id
                                            """
                ),
                {"id": recipe_id},
            )
            author_row = author_result.fetchone()
            author = None
            if author_row:
                author_id, author_name = author_row
                author = AuthorResponseUser(id=author_id, name=author_name)
            tags = [
                Tag(id=id, key=key, value=value)
                for id, key, value in tags_result.fetchall()
            ]
            ingredients = [
                IngredientWithAmount(
                    id=ingredient_id,
                    name=ingredient_name,
                    type=ingredient_type,
                    storage=ingredient_storage,
                    category=ingredient_category_id,
                    quantity=ingredient_quantity,
                    unit=ingredient_unit,
                )
                for ingredient_id, ingredient_name, ingredient_type, ingredient_storage, ingredient_category_id, ingredient_quantity, ingredient_unit in ingredients_result.fetchall()
            ]
            row = recipe_result.fetchone()
            if row is None:
                raise Exception("Recipe not found")
            (
                id,
                name,
                mins_prep,
                mins_cook,
                description,
                default_servings,
                author_id,
                procedure,
                calories,
            ) = row
            return PopulatedRecipe(
                id=id,
                name=name,
                mins_prep=mins_prep,
                mins_cook=mins_cook,
                description=description,
                default_servings=default_servings,
                author_id=author_id,
                procedure=procedure,
                calories=calories,
                ingredients=ingredients,
                tags=tags,
                author=author,
            )
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/{id}", status_code=201, response_model=None)
# def update_recipe(id: int, recipe : Recipe,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
#     pass


@router.delete("/{id}")
def delete_recipe(
    id: int,
    engine: Annotated[Engine, Depends(get_engine)],
    current_user: TokenData = Depends(get_current_user),
) -> None:
    user_id = current_user.id
    try:
        with engine.begin() as conn:
            result = conn.execute(
                text(
                    """DELETE FROM recipe 
                                   WHERE id = :id AND author_id = :user_id
                                   RETURNING id"""
                ),
                {"id": id, "user_id": user_id},
            )
            if result.fetchall() == []:
                raise Exception("Recipe not found, you likely aren't the owner")
        return "OK"
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# adds a recipe to a given recipe_list when both exist already
@router.post(
    "/{recipe_id}/recipe-lists/{recipe_list_id}", status_code=201, response_model=None
)
def add_recipe_to_recipe_list(
    recipe_id: int, recipe_list_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> None:
    try:
        with engine.begin() as conn:
            # check if recipe exists
            result = conn.execute(
                text("""SELECT id FROM recipe WHERE id = :recipe_id"""),
                {"recipe_id": recipe_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe does not exist")
            # check if recipe list exists
            result = conn.execute(
                text("""SELECT id FROM recipe_list WHERE id = :recipe_list_id"""),
                {"recipe_list_id": recipe_list_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe list does not exist")

            conn.execute(
                text(
                    "INSERT INTO recipe_x_recipe_list (recipe_id, recipe_list_id) VALUES (:recipe_id, :recipe_list_id)"
                ),
                {"recipe_id": recipe_id, "recipe_list_id": recipe_list_id},
            )
            return "OK"
    except exc.SQLAlchemyError as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))


# creates a tag for a recipe
@router.post("/{recipe_id}/tags/{tag_id}", status_code=201, response_model=None)
def add_recipe_tag(
    recipe_id: int, tag_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> None:
    try:
        with engine.begin() as conn:
            # check if recipe exists
            result = conn.execute(
                text("""SELECT id FROM recipe WHERE id = :recipe_id"""),
                {"recipe_id": recipe_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe does not exist")
            # check if recipe tag exists
            result = conn.execute(
                text("""SELECT id FROM recipe_tag WHERE id = :tag_id"""),
                {"tag_id": tag_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe tag does not exist")

            conn.execute(
                text(
                    "INSERT INTO recipe_x_tag (recipe_id, tag_id) VALUES (:recipe_id, :tag_id)"
                ),
                {"recipe_id": recipe_id, "tag_id": tag_id},
            )
            return "OK"
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# returns all recipe tags in a list
@router.get("/{recipe_id}/tags", response_model=List[Tag])
def get_recipe_tags(
    recipe_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> List[Tag]:
    try:
        with engine.begin() as conn:
            # check if recipe exists
            result = conn.execute(
                text("""SELECT id FROM recipe WHERE id = :recipe_id"""),
                {"recipe_id": recipe_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe does not exist")

            result = conn.execute(
                text(
                    """SELECT rt.id, rt.key, rt.value 
                                    FROM recipe_x_tag rxt
                                    JOIN recipe_tag rt on rxt.tag_id = rt.id 
                                    WHERE rxt.recipe_id = :recipe_id"""
                ),
                {"recipe_id": recipe_id},
            )
            rows = result.fetchall()
            return [Tag(id=id, key=key, value=value) for id, key, value in rows]
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# associates ingredients with a given recipe
@router.post(
    "/{recipe_id}/ingredients/{ingredient_id}", status_code=201, response_model=None
)
def add_ingredient_to_recipe(
    recipe_id: int, ingredient_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> None:
    try:
        with engine.begin() as conn:
            # FIXME: add ability to specify quantity and unit
            # check if recipe exists
            result = conn.execute(
                text("""SELECT id FROM recipe WHERE id = :recipe_id"""),
                {"recipe_id": recipe_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe does not exist")
            # check if ingredient exists
            result = conn.execute(
                text("""SELECT id FROM ingredient WHERE id = :ingredient_id"""),
                {"ingredient_id": ingredient_id},
            )
            if result.fetchone() is None:
                raise Exception("Ingredient does not exist")

            conn.execute(
                text(
                    "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (:recipe_id, :ingredient_id, :quantity)"
                ),
                {"recipe_id": recipe_id, "ingredient_id": ingredient_id, "quantity": 1},
            )
            return "OK"
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# returns a list of all ingredients with a given recipe
@router.get("/{recipe_id}/ingredients", response_model=List[Ingredient])
def get_recipe_ingredients(
    recipe_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> List[Ingredient]:
    try:
        with engine.begin() as conn:
            # check if recipe exists
            result = conn.execute(
                text("""SELECT id FROM recipe WHERE id = :recipe_id"""),
                {"recipe_id": recipe_id},
            )
            if result.fetchone() is None:
                raise Exception("Recipe does not exist")
            result = conn.execute(
                text(
                    """SELECT ri.id, ri.name, ri.type, ri.storage, ri.category_id 
                                    FROM recipe_ingredients rix
                                    JOIN ingredient ri on rix.ingredient_id = ri.id 
                                    WHERE rix.recipe_id = :recipe_id"""
                ),
                {"recipe_id": recipe_id},
            )
            rows = result.fetchall()
            return [
                Ingredient(
                    id=id,
                    name=name,
                    type=type,
                    storage=storage,
                    category_id=category_id,
                )
                for id, name, type, storage, category_id in rows
            ]
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
