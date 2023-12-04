import os

import dotenv
from sqlalchemy import create_engine
import sqlalchemy 


def database_connection_url():
    dotenv.load_dotenv()
    return os.environ.get("POSTGRES_URI")
print(database_connection_url())

engine = None

def get_engine():
    global engine
    if engine is None:
        engine = create_engine(database_connection_url(), pool_pre_ping=True, echo=True)
    return engine

metadata_obj = sqlalchemy.MetaData()
recipe = sqlalchemy.Table("recipe", metadata_obj, autoload_with=get_engine())
recipe_x_tag = sqlalchemy.Table("recipe_x_tag", metadata_obj, autoload_with=get_engine())
recipe_tag = sqlalchemy.Table("recipe_tag", metadata_obj, autoload_with=get_engine())
recipe_ingredients= sqlalchemy.Table("recipe_ingredients", metadata_obj, autoload_with=get_engine())
user_x_ingredient= sqlalchemy.Table("user_x_ingredient", metadata_obj, autoload_with=get_engine())