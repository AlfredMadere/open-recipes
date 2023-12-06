from typing import Annotated, Union

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import exc, text
from sqlalchemy.engine import Engine

from open_recipes.database import get_engine
from open_recipes.models import CreateUserRequest, Ingredient, User

from .auth import get_current_active_user

router = APIRouter(
    prefix="/users",
)


@router.get("")
def get_users(engine: Annotated[Engine, Depends(get_engine)], cursor: int = 0):
    """
    Get all users
    """
    try:
        page_size = 10
        with engine.begin() as conn:
            result = conn.execute(
                text(
                    """SELECT id, name, email, phone FROM "user" ORDER BY id LIMIT :page_size OFFSET :cursor"""
                ),
                {"page_size": page_size + 1, "cursor": cursor},
            )
            rows = result.fetchall()

            next_cursor = None if len(rows) <= page_size else cursor + page_size
            prev_cursor = cursor - page_size if cursor > 0 else None

            return {
                "prev_cursor": prev_cursor,
                "next_cursor": next_cursor,
                "users": [
                    User(id=id, name=name, email=email, phone=phone)
                    for id, name, email, phone in rows
                ],
            }
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}", response_model=User)
def get_user_by_id(
    user_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> User:
    """
    Get one user
    """
    with engine.begin() as conn:
        try:
            result = conn.execute(
                text(
                    """SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""
                ),
                {"user_id": user_id},
            )
            row = result.fetchone()
            if row is None:
                raise Exception("No user found with that given id")
            id, name, email, phone = row
            return User(id=id, name=name, email=email, phone=phone)
        except Exception as e:
            if e.args[0]:
                raise HTTPException(status_code=400, detail=e.args[0])
            else:
                raise HTTPException(status_code=500, detail="Unknown Error Occurred")


# SMOKE TESTED
@router.post(
    "", response_model=None, status_code=201, responses={"201": {"model": User}}
)
def create_users(
    body: CreateUserRequest, engine: Annotated[Engine, Depends(get_engine)]
) -> Union[None, User]:
    """
    Create a new user
    """
    try:
        with engine.begin() as conn:
            # check if email already exists
            result = conn.execute(
                text(
                    """SELECT id, name, email, phone FROM "user" WHERE email = :email"""
                ),
                {"email": body.email},
            )
            row = result.fetchone()
            if row is not None:
                raise Exception("Email already exists")

            result = conn.execute(
                text(
                    """INSERT INTO "user" (name, email, phone)
                                        VALUES (:name, :email, :phone)
                                        RETURNING id, name, email, phone
                                    """
                ),
                {"name": body.name, "phone": body.phone, "email": body.email},
            )

            id, name, email, phone = result.fetchone()
            return User(id=id, name=name, email=email, phone=phone)
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/ingredients/", response_model=None, status_code=200)
def get_users_inventory(
    user_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> list[Ingredient]:
    try:
        with engine.begin() as conn:
            # check if user exists
            result = conn.execute(
                text(
                    """SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""
                ),
                {"user_id": user_id},
            )
            row = result.fetchone()
            if row is None:
                raise Exception("User does not exist")

            result = conn.execute(
                text(
                    """
            SELECT id, name, type, storage, category_id
            FROM ingredient
            JOIN user_x_ingredient ON ingredient.id = user_x_ingredient.ingredient_id
            WHERE user_x_ingredient.user_id = :user_id

    """
                ),
                {"user_id": user_id},
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


@router.post("/{user_id}/ingredients", response_model=None, status_code=201)
def update_users_inventory(
    body: list[Ingredient], user_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> str:
    # Remove user inventory by deleting all rows in the user_x_ingredient table where user_id = user_id
    # Filter the list so there are no duplicate names
    # split up the list into those with ids and those without
    # for the ones without ids, search the database to see if there are any ingredients with that name and assign id if you find one, if you don't find an ingredient with that name, create one
    # You should now have an array of ingredients all with ids and with no duplicates
    # make entries in the user_x_ingredient table for each ingredient in the array
    try:
        with engine.begin() as conn:
            # check if user exists
            result = conn.execute(
                text(
                    """SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""
                ),
                {"user_id": user_id},
            )
            row = result.fetchone()
            if row is None:
                raise Exception("User does not exist")
            conn.execute(
                text("DELETE FROM user_x_ingredient WHERE user_id = :user_id"),
                {"user_id": user_id},
            )
            ingredient_dicts = [
                {
                    attr: getattr(ingredient, attr)
                    for attr in ["name", "type", "storage", "category_id"]
                }
                for ingredient in body
            ]
            unique_ingredients = {
                ingredient_dict["name"]: ingredient_dict
                for ingredient_dict in ingredient_dicts
            }
            values_clause = ", ".join(
                f"('{ingredient['name']}', "
                + f"{'NULL' if ingredient['type'] is None else repr(ingredient['type'])}, "
                + f"{'NULL' if ingredient['storage'] is None else repr(ingredient['storage'])}, "
                + f"{'NULL' if ingredient['category_id'] is None else ingredient['category_id']})"
                for ingredient in unique_ingredients.values()
            )
            upsert_query = f"""
                INSERT INTO ingredient (name, type, storage, category_id) VALUES {values_clause}
                ON CONFLICT (name) DO NOTHING
            """
            conn.execute(text(upsert_query))
            ingredient_names = list(
                unique_ingredients.keys()
            )  # Use a list instead of tuple
            ingredient_ids = conn.execute(
                text("SELECT id FROM ingredient WHERE name = ANY(:names)"),
                {"names": ingredient_names},
            ).fetchall()

            # Bulk insert into user_x_ingredient
            user_ingredients_data = [
                {"user_id": user_id, "ingredient_id": id_[0]} for id_ in ingredient_ids
            ]
            conn.execute(
                text(
                    "INSERT INTO user_x_ingredient (user_id, ingredient_id) VALUES (:user_id, :ingredient_id)"
                ),
                user_ingredients_data,
            )
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return "OK"


@router.post(
    "/{user_id}/ingredients/{ingredient_id}", response_model=None, status_code=201
)
def add_ingredient_to_user_inventory(
    user_id: int, ingredient_id: int, engine: Annotated[Engine, Depends(get_engine)]
) -> str:
    try:
        with engine.begin() as conn:
            # check if user exists
            result = conn.execute(
                text(
                    """SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""
                ),
                {"user_id": user_id},
            )
            row = result.fetchone()
            if row is None:
                raise Exception("User does not exist")

            # check if ingredient exists
            result = conn.execute(
                text(
                    """SELECT id, name, type, storage, category_id FROM ingredient WHERE id = :ingredient_id"""
                ),
                {"ingredient_id": ingredient_id},
            )
            row = result.fetchone()
            if row is None:
                raise Exception("Ingredient does not exist")

            conn.execute(
                text(
                    "INSERT INTO user_x_ingredient (user_id, ingredient_id) VALUES (:user_id, :ingredient_id)"
                ),
                {"user_id": user_id, "ingredient_id": ingredient_id},
            )
            return "OK"
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user
