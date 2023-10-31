

#Create user by calling /users POST
#Verify user created by calling /users/{id} GET
#Create recipe list by calling /recipe-lists POST
#Verify recipe list created by calling /recipe-lists/{id} GET
#Create recipe by calling /recipes POST
#Verify recipe created by calling /recipes/{id} GET
#Add recipe to recipe list by calling recipe/{recipe_id}/recipe-lists/{id} POST
#Verify recipe added to recipe list by calling /recipe-lists/{id} GET and see that the recipe we created is there

#write 2 - 5 tests that fully test the functionality of the API
import json
import requests
import os
import pytest

base_route = "http://127.0.0.1:3000"
headers = {'Access_token': f'{os.environ.get("API_KEY")}'}


def call_reset(): 
  endpoint = "/admin/reset/"
  url = base_route + endpoint
  response = requests.post(url, headers=headers)
  return response.status_code == 200

@pytest.mark.skipif(os.environ.get('ENV') != 'DEV', reason="Only run in dev")
def test_create_cart():
  assert call_reset()
  endpoint = "/carts/"
  url = base_route + endpoint
  request_body = load_fixture("carts/create_cart_req.json")
  customer_str =  json.loads(request_body)["customer"]
  response = requests.post(url, headers=headers, data=request_body)
  response_obj = json.loads(response.content)
  assert response.status_code == 200, "Should return status code 200"
  assert response_obj["cart_id"] != None, "Should return a cart_id"
  created_cart = Cart.find(response_obj["cart_id"])
  created_customer = Customer.find(created_cart.customer_id)
  assert created_customer != None
  assert created_customer.str == customer_str, "Should create customer with correct str"