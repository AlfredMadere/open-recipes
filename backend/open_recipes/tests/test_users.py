import os

import dotenv
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from open_recipes.database import get_engine
# base_route = "http://127.0.0.1:8000"
from open_recipes.server import app

client = TestClient(app)
dotenv.load_dotenv()



def get_test_engine():
    dotenv.load_dotenv()
    test_uri = os.environ.get("TEST_POSTGRES_URI")
    print("test uri", test_uri)
    return create_engine(test_uri, pool_pre_ping=True)

def setup():
    # subprocess.run(f"pg_dump -U {os.environ.get('DB_USER')} -d {os.environ.get('DB_NAME')} --schema-only -f table_schema.sql", shell=True)
    # subprocess.run(f"psql -U {os.environ.get('DB_NAME')} -d {os.environ.get('DB_NAME')} -f table_schema.sql", shell=True)
    # subprocess.run("rm table_schema.sql", shell=True)
    # subprocess.run("rm tablget_engine]
    engine = get_test_engine()

    with engine.begin() as conn:
        #drop all values from all tables
        conn.execute(text('TRUNCATE "user" CASCADE'))
        conn.execute(text("TRUNCATE recipe_list CASCADE"))
        conn.execute(text("TRUNCATE recipe CASCADE"))
        conn.execute(text("TRUNCATE recipe_tag CASCADE"))
        conn.execute(text("TRUNCATE recipe_ingredients CASCADE"))
        conn.execute(text("TRUNCATE ingredient CASCADE"))
        conn.execute(text("TRUNCATE review CASCADE"))
        conn.execute(text("TRUNCATE user_x_recipe_list CASCADE"))
        conn.execute(text("TRUNCATE recipe_x_tag CASCADE"))

    app.dependency_overrides[get_engine] = get_test_engine
    pass

def teardown():
    # print("teardown")
    app.dependency_overrides = {}
    pass

@pytest.fixture( autouse=True)
def before_and_after_all():
    setup()
    yield
    teardown()
    
@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_user():
    # Send a POST request to create a user

    response = client.post("/users", json={'name': 'John Doe', 'email': 'john.doe@example.com'})
    assert response.status_code == 201 # this will fail

    # Get the user ID from the response
    user_id = response.json()['id']

    # Send a GET request to verify the user was created
    response = client.get(f'/users/{user_id}')
    assert response.status_code == 200
    assert response.json()['name'] == 'John Doe'
    assert response.json()['email'] == 'john.doe@example.com'
    response = client.get('/users')
    assert response.status_code == 200
    assert len(response.json()) == 1


