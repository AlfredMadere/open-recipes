import requests
import os
import pytest
import dotenv
from fastapi.testclient import TestClient
dotenv.load_dotenv()
# base_route = "http://127.0.0.1:8000"
from .server import app
from .database import get_engine
from sqlalchemy import create_engine, text
client = TestClient(app)



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
        #conn.execute(text('TRUNCATE "user CASCADE'))
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

@pytest.fixture(scope="session", autouse=True)
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
    

@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_recipe_list():
    # Send a POST request to create a recipe list
    response = client.post(f'/recipe-lists', json={'name': 'My Recipes', 'description': 'My favorite recipes'})
    assert response.status_code == 201

    # Get the recipe list ID from the response
    recipe_list_id = response.json()['id']

    # Send a GET request to verify the recipe list was created
    response = client.get("/recipe-lists/{recipe_list_id}")
    assert response.status_code == 200
    assert response.json()['name'] == 'My Recipes'

@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_recipe():
    # Send a POST request to create a recipe
    response = client.post(f'/recipes', json={'name': 'Spaghetti Carbonara', 'procedure': 'Cook spaghetti, fry bacon, mix with eggs and cheese'})
    assert response.status_code == 201

    # Get the recipe ID from the response
    recipe_id = response.json()['id']

    # Send a GET request to verify the recipe was created
    response = client.get(f'/recipes/{recipe_id}')
    assert response.status_code == 200
    assert response.json()['name'] == 'Spaghetti Carbonara'
    assert response.json()['procedure'] == 'Cook spaghetti, fry bacon, mix with eggs and cheese'

@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_add_recipe_to_recipe_list():
    # Create a recipe
    response = client.post(f'/recipes', json={'name': 'Spaghetti Carbonara', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese'})
    recipe_id = response.json()['id']

    # Create a recipe list
    response = client.post(f'/recipe-lists', json={'name': 'My Recipes'})
    recipe_list_id = response.json()['id']

    # Add the recipe to the recipe list
    response = client.post(f'/recipes/{recipe_id}/recipe-lists/{recipe_list_id}')
    assert response.status_code == 201

    # Send a GET request to verify the recipe was added to the recipe list
    response = client.get(f'/recipe-lists/{recipe_list_id}')
    assert response.status_code == 200
    assert len(response.json()['recipes']) == 1
    assert response.json()['recipes'][0]['name'] == 'Spaghetti Carbonara'
