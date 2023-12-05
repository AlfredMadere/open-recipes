from typing import Annotated, List, Optional, Union

import sqlalchemy
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import exc, text
from sqlalchemy.engine import Engine

from open_recipes.database import get_engine, recipe_tag
from open_recipes.models import CreateTagRequest, Tag

router = APIRouter(
  prefix="/tags",
)

class SearchResults(BaseModel):
    tags: List[Tag]
    next_cursor: Optional[int]
    prev_cursor: Optional[int]

metadata_obj = sqlalchemy.MetaData()

#returns list of all available tags
@router.get("", response_model=None)
def get_tags(engine : Annotated[Engine, Depends(get_engine)], cursor: int = 0, key: str | None = None, value: str | None = None, page_size: int = 10) -> Union[None, Tag]:
    try:
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
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error "  + e._message())

    try:
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
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error "  + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return search_result


#creates a new tag option
@router.post("", response_model=None,status_code=201, responses={'201': {'model': Tag}})
def create_tag(tag: CreateTagRequest ,engine : Annotated[Engine, Depends(get_engine)]) -> Union[None, Tag]:
    try:
        with engine.begin() as conn:
            result = conn.execute(text("""INSERT INTO recipe_tag (key, value) VALUES (:key, :value) RETURNING id, key, value"""),{"key":tag.key,"value":tag.value})
            id, key, value = result.fetchone()
            return Tag(id=id, key=key, value=value)
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error "  + e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/{tag_id}')
def get_tag_by_id(tag_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Tag:
    try:
        with engine.begin() as conn:
            result = conn.execute(text("""SELECT id, key, value FROM "recipe_tag" WHERE id = :id"""),{"id":tag_id})
            id, key, value = result.fetchone()
            print(id, key, value)
            return Tag(id=id, key=key, value=value)
        
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error " +  e._message())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))