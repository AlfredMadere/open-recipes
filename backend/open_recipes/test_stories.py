import requests
import os
import pytest
import dotenv
from fastapi.testclient import TestClient
dotenv.load_dotenv()
# base_route = "http://127.0.0.1:8000"
from open_recipes.server import app
from open_recipes.database import get_engine
from sqlalchemy import create_engine, text
client = TestClient(app)

#post user, #get user, #get users
#post recipe-list, #get recipe-list, #get recipe-lists
#post recipe, #get recipe
#post recipe to recipe_list, #get recipe from recipe_list
#search by name, time, name and time (#get_recipes)
#post tag, #get tag, #get tags?, #search by tag
#post ingredients, #get ingredient, #get incredients
#get user inventory, #add ingredient to user inventory

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


#Follow the format below to create tests for every useful endpoint on the /docs page. If an endpoint is not in a user story, just manually test it by going to /docs and making sure it works
#For all endpoints used in user stories create tests that make sure they work, if they don't work, fix em.
#look up how to skip tests in pytest and skip all tests you aren't working on so it does take years to run OR comment everything out that you aren't running but this is sus
#after all tests are running, create the curl stories as shown in v1....manuletestsf.md, ACTUALLY RUN the curl commands to make sure they work
#make sure all user stories line up with our curl tests and that our functionality will work when peer reviewed

#marked
@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_user():
    # Send a POST request to create a user

    response = client.post("/users", json={'name': 'John Doe', 'email': 'john.doe@example.com'})
    response2 = client.post("/users", json={'name': 'Bob Doe', 'email': 'bob.doe@example.com'})

    assert response.status_code == 201 # this will fail

    # Get the user ID from the response
    user_id = response.json()['id']

    # Send a GET request to verify the user was created
    response = client.get(f'/users/{user_id}')
    assert response.status_code == 200
    assert response.json()['name'] == 'John Doe'
    assert response.json()['email'] == 'john.doe@example.com'

    # Send a GET request to get a list of users and verify that works
    response = client.get('/users/')
    assert response.status_code == 200
    # Verify the response contains a list of users
    users = response.json()
    assert isinstance(users, list)
    assert len(users) == 2

    
#marked
@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_recipe_list():
    # Send a POST request to create a recipe list
    response = client.post(f'/recipe-lists', json={'name': 'My Recipes', 'description': 'My favorite recipes'})
    assert response.status_code == 201
    response2 = client.post(f'/recipe-lists', json={'name': 'My Recipes 2', 'description': 'My almost favorite recipes'})
    assert response.status_code == 201

    # Get the recipe list ID from the response
    recipe_list_id = response.json()['id']

    # Send a GET request to verify the recipe list was created
    response = client.get(f'/recipe-lists/{recipe_list_id}')
    assert response.status_code == 200
    assert response.json()['name'] == 'My Recipes'

     # Send a GET request to get a list of recipe-lists and verify that works
    response = client.get('/recipe-lists/')
    assert response.status_code == 200
    # Verify the response contains a list of users
    recipe_lists = response.json()
    assert isinstance(recipe_lists, list)
    assert len(recipe_lists) == 2

#marked
@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_recipe():
    # Send a POST request to create a recipe
    response = client.post(f'/recipes', json={'name': 'Spaghetti Carbonara', 'procedure': 'Cook spaghetti, fry bacon, mix with eggs and cheese'})
    assert response.status_code == 201

    response2 = client.post(f'/recipes', json={'name': 'Spaghetti Carbonara 2', 'procedure': 'Cook spaghetti, fry bacon, mix with eggs and cheese but do it twice'})
    assert response.status_code == 201

    # Get the recipe ID from the response
    recipe_id = response.json()['id']

    # Send a GET request to verify the recipe was created
    response = client.get(f'/recipes/{recipe_id}')
    assert response.status_code == 200
    assert response.json()['name'] == 'Spaghetti Carbonara'
    assert response.json()['procedure'] == 'Cook spaghetti, fry bacon, mix with eggs and cheese'

#marked
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


recipe_1_popo = {'name': 'Spaghetti Carbonara', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese', "mins_prep": 20, "mins_cook": 30}
recipe_2_popo = {'name': 'Pho', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese', "mins_prep": 10, "mins_cook": 9}
recipe_3_popo = {'name': 'Spaghetti meatballs', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese', "mins_prep": 10, "mins_cook": 9}
recipe_4_popo = {'name': 'pho 2', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese', "mins_prep": 10, "mins_cook": 9}
tag_1_popo = {'key': 'Cuisine', 'value': 'Italian'}
tag_2_popo = {'key': 'Cuisine', 'value': 'Vietnamese'}


@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_search():
    # Create a recipe
    response = client.post(f'/recipes', json=recipe_1_popo)
    recipe_id_0 = response.json()['id']

@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_search():
    # Create a recipe
    response = client.post(f'/recipes', json=recipe_1_popo)
    recipe_id_0 = response.json()['id']
    response = client.post(f'/recipes', json=recipe_2_popo)
    recipe_id_1 = response.json()['id']

    response = client.get(f'/recipes')
    assert response.status_code == 200
    assert len(response.json()['recipe']) == 2
    assert response.json()['recipe'][0]['name'] == 'Pho'
    assert response.json()['recipe'][1]['name'] == 'Spaghetti Carbonara'

    #Search for recipe by time
    response = client.get(f"/recipes?max_time=20")
    assert response.status_code == 200
    assert len(response.json()['recipe']) == 1
    assert response.json()['recipe'][0]['name'] == 'Pho'

    #Search by time and name
    response = client.get(f"/recipes?name={'Carbonara'}&max_time=20")
    assert response.status_code == 200
    assert len(response.json()['recipe']) == 0

    #Search by name
    response = client.get(f"/recipes?name={'Carbonara'}")
    assert response.status_code == 200
    assert len(response.json()['recipe']) == 1


@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_tag():
    
    # Create a recipe
    response = client.post(f'/recipes', json=recipe_1_popo)
    recipe_id = response.json()['id']

    tag_create_response1 = client.post(f'/tags', json=tag_1_popo)
    tag_create_response2 = client.post(f'/tags', json=tag_2_popo)

    assert tag_create_response1.status_code == 201
    assert tag_create_response2.status_code == 201

    # Create a tag
    response = client.post(f'/recipes/{recipe_id}/tags/{tag_create_response1.json()["id"]}')
    assert response.status_code == 201

    # Send a GET request to verify the tag was created
    response = client.get(f'/recipes/{recipe_id}/tags')
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['key'] == 'Cuisine'
    assert response.json()[0]['value'] == 'Italian'

@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_filter_tag():
    # Create recipes
    response1 = client.post(f'/recipes', json=recipe_1_popo)
    response2 = client.post(f'/recipes', json=recipe_2_popo)
    response3 = client.post(f'/recipes', json=recipe_3_popo)
    response4 = client.post(f'/recipes', json=recipe_4_popo)

    tag_create_response1 = client.post(f'/tags', json=tag_1_popo)
    tag_create_response2 = client.post(f'/tags', json=tag_2_popo)

    #Create tags
    tag_response1 = client.post(f'/recipes/{response1.json()["id"]}/tags/{tag_create_response1.json()["id"]}', json=tag_1_popo)
    tag_response2 = client.post(f'/recipes/{response2.json()["id"]}/tags/{tag_create_response2.json()["id"]}', json=tag_2_popo)
    tag_response3 = client.post(f'/recipes/{response3.json()["id"]}/tags/{tag_create_response1.json()["id"]}', json=tag_1_popo)
    tag_response4 = client.post(f'/recipes/{response4.json()["id"]}/tags/{tag_create_response2.json()["id"]}', json=tag_2_popo)

    #/recipes/{recipe_id}/tags/{tag_id}

    #Search for recipe by name

    #Search for recipe by time
    response = client.get(f"/recipes?max_time=20")
    assert response.status_code == 200
    assert len(response.json()['recipe']) == 3
    assert response.json()['recipe'][0]['name'] == 'Pho'

    #Search by time and name
    response = client.get(f"/recipes?name={'Carbonara'}&max_time=20")
    assert response.status_code == 200
    assert len(response.json()['recipe']) == 0

    #Search by tag
    response = client.get(f"/recipes?tag_key=Cuisine&tag_value=Italian")
    assert response.status_code == 200
    print(response.json())
    assert len(response.json()['recipe']) == 2
    assert response.json()['recipe'][0]['name'] == 'Spaghetti Carbonara'
    assert response.json()['recipe'][1]['name'] == 'Spaghetti meatballs'

#marked
@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_ingredient():

    # create ingreadient with user
    user_response = client.post("/users", json={'name': 'John Doe', 'email': 'john@doe.com'})
    user_id = user_response.json()['id']

    response = client.post(f'/ingredients', json={'name': 'Spaghetti',"type":"pasta","storage":"PANTRY"})

    assert response.status_code == 201

    #associcate ingredient with user
    response = client.post(f'/users/{user_id}/ingredients/{response.json()["id"]}')

    assert response.status_code == 201

    # get all ingredients for user
    response = client.get(f'/users/{user_id}/ingredients')
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['name'] == 'Spaghetti'


    response = client.post(f'/ingredients', json={'name': 'other_ingredient',"type":"pasta","storage":"FRIDGE"})
    assert response.status_code == 201
    #associcate ingredient with user
    response = client.post(f'/users/{user_id}/ingredients/{response.json()["id"]}')
    assert response.status_code == 201
    # get all ingredients for user
    response = client.get(f'/users/{user_id}/ingredients')
    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_user_inventory_search():
    # create ingreadient with user
    user_response = client.post("/users", json={'name': 'John Doe', 'email': 'john@dioe.com'})
    assert user_response.status_code == 201

    user_id = user_response.json()['id']

    response1 = client.post(f'/ingredients', json={'name': 'Spaghetti',"type":"pasta","storage":"PANTRY"})
    response2 = client.post(f'/ingredients', json={'name': 'Bacon',"type":"meat","storage":"FRIDGE"})
    response3 = client.post(f'/ingredients', json={'name': 'Eggs',"type":"dairy","storage":"FRIDGE"})
    response4 = client.post(f'/ingredients', json={'name': 'Parmesan',"type":"dairy","storage":"FRIDGE"})
    assert response1.status_code == 201
    assert response2.status_code == 201
    assert response3.status_code == 201
    assert response4.status_code == 201

    # add pho ingredients not to user
    response5 = client.post(f'/ingredients', json={'name': 'Noodles',"type":"noodles","storage":"PANTRY"})
    response6 = client.post(f'/ingredients', json={'name': 'Beef',"type":"meat","storage":"FRIDGE"})
    response7 = client.post(f'/ingredients', json={'name': 'Cinnamon',"type":"spice","storage":"PANTRY"})
    assert response5.status_code == 201
    assert response6.status_code == 201
    assert response7.status_code == 201


    response = client.post(f'/users/{user_id}/ingredients/{response1.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/users/{user_id}/ingredients/{response2.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/users/{user_id}/ingredients/{response3.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/users/{user_id}/ingredients/{response4.json()["id"]}')
    assert response.status_code == 201

    # create recipe
    response_recipe1 = client.post(f'/recipes', json=recipe_1_popo)
    assert response_recipe1.status_code == 201
    recipe_id1 = response_recipe1.json()['id']

    response_recipe2 = client.post(f'/recipes', json=recipe_2_popo)
    assert response_recipe2.status_code == 201
    recipe_id2 = response_recipe2.json()['id']

    # add ingredients to recipe
    response = client.post(f'/recipes/{recipe_id1}/ingredients/{response1.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id1}/ingredients/{response2.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id1}/ingredients/{response3.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id1}/ingredients/{response4.json()["id"]}')
    assert response.status_code == 201

    response = client.post(f'/recipes/{recipe_id2}/ingredients/{response5.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id2}/ingredients/{response6.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id2}/ingredients/{response7.json()["id"]}')
    assert response.status_code == 201

    # search for recipes with user ingredients
    response = client.get(f'/recipes?use_inventory_of={user_id}')
    assert response.status_code == 200

    assert len(response.json()['recipe']) == 1
    assert response.json()['recipe'][0]['name'] == 'Spaghetti Carbonara'



#marked
@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_get_ingredients_from_recipe():
    # Create a recipe
    response = client.post(f'/recipes', json={'name': 'Spaghetti Carbonara', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese'})
    recipe_id1 = response.json()['id']
    # Create another recipe
    response2 = client.post(f'/recipes', json={'name': 'Penne and Butter', 'instructions': 'Cook penne, add butter'})
    recipe_id2 = response2.json()['id']
    #add ingredients for recipe1
    response1 = client.post(f'/ingredients', json={'name': 'Spaghetti',"type":"pasta","storage":"PANTRY"})
    response2 = client.post(f'/ingredients', json={'name': 'Bacon',"type":"meat","storage":"FRIDGE"})
    assert response1.status_code == 201
    assert response2.status_code == 201
    #add ingredients for recipe2
    response3 = client.post(f'/ingredients', json={'name': 'Penne',"type":"pasta","storage":"PANTRY"})
    response4 = client.post(f'/ingredients', json={'name': 'Butter',"type":"dairy","storage":"FRIDGE"})
    response5 = client.post(f'/ingredients', json={'name': 'Bacon',"type":"meat","storage":"FRIDGE"})
    assert response3.status_code == 201
    assert response4.status_code == 201
    assert response5.status_code == 201
    # add ingredients to recipe1
    response = client.post(f'/recipes/{recipe_id1}/ingredients/{response1.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id1}/ingredients/{response2.json()["id"]}')
    assert response.status_code == 201
    # add ingredients to recipe2
    response = client.post(f'/recipes/{recipe_id2}/ingredients/{response3.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id2}/ingredients/{response4.json()["id"]}')
    assert response.status_code == 201
    response = client.post(f'/recipes/{recipe_id2}/ingredients/{response5.json()["id"]}')
    assert response.status_code == 201
    #check length and name of ingredients in one
    response = client.get(f'/recipes/{recipe_id1}/ingredients')
    assert response.status_code == 200
    assert len(response.json()) == 2
    # assert response.json()[0]['name'] == 'Spaghetti'
    # assert response.json()[0]['name'] == 'Bacon'
    #check length and name of ingredients in two
    response = client.get(f'/recipes/{recipe_id2}/ingredients')
    assert response.status_code == 200
    assert len(response.json()) == 3
    # assert response.json()[0]['name'] == 'Penne'
    # assert response.json()[0]['name'] == 'Butter'
    # assert response.json()[0]['name'] == 'Bacon'



def test_flow_2():
    # Create a user
    response = client.post("/users", json={'name': 'Bob Sandler', 'email': 'bob@sandler.com'})
    assert response.status_code == 201

    response = client.post("/recipe-lists", json={'name': 'My Recipes', 'description': 'My favorite recipes'})
    assert response.status_code == 201
    recipe_list_id = response.json()['id']
    # Create a recipe
    response = client.post("/recipes", json={'name': 'Spaghetti Carbonara', 'instructions': 'Cook spaghetti, fry bacon, mix with eggs and cheese'})
    assert response.status_code == 201

    # Get the recipe ID from the response
    recipe_id = response.json()['id']
    print(recipe_id,recipe_list_id)
    # Add the recipe to the recipe list
    response = client.post(f'/recipe-lists/{recipe_list_id}/recipe/{recipe_id}')
    assert response.status_code == 201

    # Send a GET request to verify the recipe was added to the recipe list
    response = client.get(f'/recipe-lists/{recipe_list_id}')
    assert response.status_code == 200
    assert len(response.json()['recipes']) == 1
    assert response.json()['recipes'][0]['name'] == 'Spaghetti Carbonara'