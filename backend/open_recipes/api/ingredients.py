from typing import Annotated, List, Union

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import exc, text
from sqlalchemy.engine import Engine

from open_recipes.database import get_engine
from open_recipes.models import Ingredient

from .auth import TokenData, get_current_user

router = APIRouter(
  prefix="/ingredients",
)

#returns list of all available ingredients
@router.get('')
def get_ingredients(engine : Annotated[Engine, Depends(get_engine)], current_user: TokenData = Depends(get_current_user), cursor :int = 0):
    """
    Get all ingredients
    """
    # if user_id is None:
    user_id = current_user.id
    try:
        page_size = 10
        with engine.begin() as conn:
            result = conn.execute(text("""SELECT id, name, type, storage, category_id 
                                    FROM ingredient
                                JOIN user_x_ingredient ON ingredient.id = user_x_ingredient.ingredient_id
                                WHERE user_x_ingredient.user_id = :user
                                    ORDER BY id LIMIT :page_size OFFSET :cursor"""), {"user": user_id, "page_size":page_size + 1,"cursor": cursor})
            rows = result.fetchall()

            next_cursor = None if len(rows) <= page_size else cursor + page_size
            prev_cursor = cursor - page_size if cursor > 0 else None

            ingredients = [Ingredient(id=row.id, name=row.name, type=row.type, storage=row.storage, category_id=row.category_id) for row in rows]

            return {
                "prev_cursor": prev_cursor,
                "next_cursor": next_cursor,
                "ingredients": ingredients
            }
        
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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
    # return ingredients÷

#returns single ingredient with given ingredient_id
@router.get('/{ingredient_id}', response_model=Ingredient)
def get_ingredient_by_id(ingredient_id : int | None,engine : Annotated[Engine, Depends(get_engine)]) -> Ingredient:
    """
    Get an ingredient by id
    """
    try:
        with engine.begin() as conn:
            result = conn.execute(text("""SELECT id, name, type, storage, category_id 
                                    FROM ingredient
                                    WHERE id = :id"""),{"id":ingredient_id})
            id, name, storage, type, category_id = result.fetchone()
            return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id) 
    except exc.SQLAlchemyError as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
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
def create_ingredients(body: Ingredient, engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Ingredient]:
    """
    Create a new ingredient
    """
    try:
        with engine.begin() as conn:
            result = conn.execute(text("""INSERT INTO ingredient (name, type, storage, category_id)
                                        VALUES (:name, :type, :storage, :category_id)
                                        RETURNING id, name, type, storage, category_id
                                    """
                                        ), {"name":body.name, "type":body.type, "storage":body.storage, "category_id":body.category_id})
            id, name, type, storage, category_id = result.fetchone()
            print(id, name, storage, type, category_id)

            return Ingredient(id=id, name=name, type=type, storage=storage, category_id=category_id)
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    