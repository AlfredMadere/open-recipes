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

@router.post("/{id}")
def update_user(id: int, user : User,engine : Annotated[Engine, Depends(get_engine)]) -> User:

    with engine.begin() as conn:
        result = conn.execute(text(f"UPDATE users SET name = :name, email = :email, phone = :phone WHERE id = :id",{"name":user.name,"phone":user.phone,"email":user.email,"id":id}))
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

@router.delete("/{id}")
def delete_user(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as conn:
        result = conn.execute(text(f"""DELETE FROM "user" WHERE id = :id"""),{"id":id})
        id, name, email, phone = result.fetchone()
        return User(id=id, name=name, email=email, phone=phone)

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

@router.post("/{user_id}/ingredients/{ingredient_id}", response_model=None,status_code=201)
def add_ingredient_to_user_inventory(user_id: int, ingredient_id: int, engine: Annotated[Engine, Depends(get_engine)]) -> str:
    with engine.begin() as conn:
        conn.execute(text(f"INSERT INTO user_x_ingredient (user_id, ingredient_id) VALUES (:user_id, :ingredient_id)"),{"user_id":user_id,"ingredient_id":ingredient_id})
        return "OK"
