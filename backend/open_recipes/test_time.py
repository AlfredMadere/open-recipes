import random
import uuid
from fastapi.testclient import TestClient
from open_recipes.models import UserInDB
from open_recipes.database import get_engine
from open_recipes.api.auth import get_current_user
from open_recipes.server import app  # Replace with your FastAPI app module
import time
from sqlalchemy import text


client = TestClient(app)
def get_user_test(username: str):
    engine = get_engine()
    with engine.connect() as conn:
        result = conn.execute(text("""SELECT email, phone, name, id, hashed_password FROM "user" WHERE email = :username"""), {"username": username})
        user_record = result.fetchone()
        if user_record:
            # Assuming the record is a RowProxy, which acts like a dict
            email, phone, name, id, hashed_password = user_record
            return UserInDB(email=email, phone=phone, name=name, hashed_password="gvgyvgy", id=id)
        return None

def get_current_user_test ():
    return get_user_test("juliebright@example.net")
app.dependency_overrides[get_current_user] = get_current_user_test
def time_endpoint(method, url, data):
    start_time = time.time()
    if method == 'get':
        response = client.get(url.format(**data), params=data, headers={'Bearer': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWxpZWJyaWdodDFAZXhhbXBsZS5uZXQiLCJleHAiOjE3MDE3MDc4Mzl9.Ytz4irnOXO2mvJFN5ME7RZrrRbjAoBUIMrkQQvJlkX4"})
    elif method == 'post':
        response = client.post(url.format(**data), json=data.get('json', {}))
    elif method == 'delete':
        response = client.delete(url.format(**data), params=data)
    # Add conditions for other HTTP methods if needed
    end_time = time.time()
    assert response.status_code in [200, 201, 204]  # Update as per your API's expected responses
    return end_time - start_time

def test_endpoint_performance():
    # Endpoints extracted from the OpenAPI specification

    endpoints = [
        ('get', '/users', {}),
        ('post', '/users', {'json': {"name": "example", "email": str(uuid.uuid4()), "phone": "sdc"}}),
        ('get', '/users/{user_id}', {'user_id': '5'}),
        ('get', '/users/{user_id}/ingredients/', {'user_id': '5'}),
        # ('post', '/users/{user_id}/ingredients', {'user_id': '5', 'json': [{
        #     "name": str(uuid.uuid4()),
        #     "type": "example",
        #     "storage": "example",
        #     "category_id": 5
        # }]}),
        # ('post', '/users/{user_id}/ingredients/{ingredient_id}', {'user_id': '5', 'ingredient_id': '4'}),
        # ('get', '/users/me/', {}),
        ('get', '/recipes', {"cursor": 0, "order_by": "name"}),
        ('post', '/recipes', {'json': {
            "name": str(uuid.uuid4()),
            "description": "example",
            "calories": 5
        }}),
        ('get', '/recipes/{recipe_id}', {'recipe_id': 7}),
        # ('delete', '/recipes/{id}', {'id': }),
        ('post', '/recipes/{recipe_id}/recipe-lists/{recipe_list_id}', {'recipe_id': random.randint(1,10000), 'recipe_list_id': random.randint(1,10000)}),
        ('post', '/recipes/{recipe_id}/tags/{tag_id}', {'recipe_id': 4, 'tag_id': 4}),
        ('get', '/recipes/{recipe_id}/tags', {'recipe_id': 4}),
        ('post', '/recipes/{recipe_id}/ingredients/{ingredient_id}', {'recipe_id':4, 'ingredient_id': 4}),
        ('get', '/recipes/{recipe_id}/ingredients', {'recipe_id': 4}),
        ('get', '/ingredients', {}),
        ('post', '/ingredients', {'json': {"name":str(uuid.uuid4()), "type": "example", "storage": "FREEZER", "category_id": 5}}),
        ('get', '/ingredients/{ingredient_id}', {'ingredient_id': 5}),
        ('get', '/tags', {}),
        ('post', '/tags', {'json': {
            "key": str(uuid.uuid4()),
            "value": "example"
        }}),
        ('get', '/tags/{tag_id}', {'tag_id': 7}),
        # ('post', '/auth/token', {'json': {}}),
        # ('post', '/auth/sign-up', {'json': {}}),
        ('get', '/recipe-lists', {}),
        ('post', '/recipe-lists', {'json': {
            "name": str(uuid.uuid4()),
            "description": "example"
        }}),
        ('post', '/recipe-lists/{recipe_list_id}/recipe/{recipe_id}', {'recipe_list_id': random.randint(1,10000), 'recipe_id': random.randint(1,10000)}),
        ('get', '/recipe-lists/{id}', {'id': 1}),
        # ('delete', '/recipe-lists/{id}', {'id': 'example'}),
        # ('get', '/', {}),
        # ('post', '/test-post', {'json': {}}),
    ]

    for method, url, data in endpoints:
        duration = time_endpoint(method, url, data)
        print(f"{method.upper()} {url}: {duration} seconds")
        # assert duration < 2  # Set your acceptable duration threshold here

# Optionally, you can add more specific tests for each endpoint
