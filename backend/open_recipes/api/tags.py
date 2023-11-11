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
  prefix="/tags",


)

class SearchResults(BaseModel):
    tags: List[Tag]
    next_cursor: Optional[int]
    prev_cursor: Optional[int]

metadata_obj = sqlalchemy.MetaData()


@router.get("", response_model=None)
def get_tags(engine : Annotated[Engine, Depends(get_engine)], cursor: int = 0, key: str | None = None, value: str | None = None, page_size: int = 10) -> Union[None, Tag]:
    recipe_tag = sqlalchemy.Table("recipe_tag", metadata_obj, autoload_with=engine)
    stmt = (
            sqlalchemy.select(
                recipe_tag.c.id,
                recipe_tag.c.key,
                recipe_tag.c.value
            )
        )
    if key is not None:
        stmt = stmt.where(recipe_tag.c.key == key)
    if value is not None:
        stmt = stmt.where(recipe_tag.c.value == value)

    with engine.connect() as conn:
        result = conn.execute(stmt)
        rows = result.fetchall()

    tags_result = [Tag(id=id, key=key, value=value) for id, key, value in rows]

    next_cursor = None if len(tags_result) <= page_size else cursor + page_size
    prev_cursor = cursor - page_size if cursor > 0 else None
    
    search_result = SearchResults(
        prev_cursor= prev_cursor,
        next_cursor= next_cursor,
        tags= tags_result 
    )

    return search_result



@router.post("", response_model=None,status_code=201, responses={'201': {'model': Tag}})
def create_tag(tag: CreateTagRequest ,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Tag]:
    with engine.begin() as conn:
        result = conn.execute(text(f"""INSERT INTO recipe_tag (key, value) VALUES (:key, :value) RETURNING id, key, value"""),{"key":tag.key,"value":tag.value})
        id, key, value = result.fetchone()
        return Tag(id=id, key=key, value=value)


@router.get('/{id}', response_model=List[Tag])
def get_tags(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[Tag]:
    with engine.begin() as conn:
        

        result = conn.execute(text(f"""SELECT id, key, value FROM "recipe_tag" WHERE id = :id"""),{"id":id})
        id, key, value = result.fetchone()
        return Tag(id=id, key=key, value=value)