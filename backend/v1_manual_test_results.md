
We did not have enough detail in our original user flows, so here is an enhanced version of one of our original ones below. 

###Use Case 1.0: Searching for a Recipe
Jim wants to browse recipes based on a name of a food he is craving, Spaghetti Carbonara.

He first sends a POST request to `/recipes/` with the following recipe data:
```json
{ "name": "Carbonara"}
```

The server processes this request, and returns all recipes containing the word Carbonara. 
```json
{
  "recipe": [
    {
      "id": 139,
      "name": "Carbonara 2",
      "mins_prep": 10,
      "mins_cook": 15,
      "description": "testing",
      "default_servings": 4,
      "created_at": null,
      "author_id": null,
      "procedure": null
    },
    {
      "id": 137,
      "name": "Spaghetti Carbonara",
      "mins_prep": 20,
      "mins_cook": 30,
      "description": null,
      "default_servings": null,
      "created_at": null,
      "author_id": null,
      "procedure": null
    }
  ],
  "next_cursor": null,
  "prev_cursor": null
}
```

Jim can now make either of these recipes, depending on which fits his needs more. 
To narrow it down further, he adds another constraint to his search, that the total time for the meal must be less than 30 minutes so he has time to make and eat it before work. 

He sends another POST request to /recipes/ with the following recipe data:
```json
{ "name": "Carbonara", "max_time": 30}
``

The server processes this new request, and returns all recipes containing the word Carbonara that has takes than 30 minutes total. 
```json
{
  "recipe": [
    {
      "id": 139,
      "name": "Carbonara 2",
      "mins_prep": 10,
      "mins_cook": 15,
      "description": "testing",
      "default_servings": 4,
      "created_at": null,
      "author_id": null,
      "procedure": null
    }
    ]}
    ```

Jim now has only one available recipe to choose from, so he selects this vague Carbonara 2 recipe and makes it and it is delicious! He is so happy he used our service. 

# Testing results

1. The curl statement called

curl -X 'GET' \
  'http://127.0.0.1:3000/recipes?name=Carbonara&cursor=0' \
  -H 'accept: application/json'

Response:

Response
 ```json
{
  "recipe": [
    {
      "id": 139,
      "name": "Carbonara 2",
      "mins_prep": 10,
      "mins_cook": 25,
      "description": "testing",
      "default_servings": 4,
      "created_at": null,
      "author_id": null,
      "procedure": null
    },
    {
      "id": 137,
      "name": "Spaghetti Carbonara",
      "mins_prep": 20,
      "mins_cook": 30,
      "description": null,
      "default_servings": null,
      "created_at": null,
      "author_id": null,
      "procedure": null
    }
  ],
  "next_cursor": null,
  "prev_cursor": null
}```

curl -X 'GET' \
  'http://127.0.0.1:3000/recipes?name=Carbonara&max_time=30&cursor=0' \
  -H 'accept: application/json'

 ```json
{
  "recipe": [
    {
      "id": 139,
      "name": "Carbonara 2",
      "mins_prep": 10,
      "mins_cook": 15,
      "description": "testing",
      "default_servings": 4,
      "created_at": null,
      "author_id": null,
      "procedure": null
    }
  ],
  "next_cursor": null,
  "prev_cursor": null
}
```


###Use Case 2.0: Using a recipe list for organization

Bob is a great baker and wants to compile his baked goods recipes so he can keep them in one place and eventually share them with his friends. He first wants to create a user on our api, so he can be recognized by name. (we have not yet implemented authentication)

1. He sends a POST request to `/user/` with the following data:

```json
 { 
  "first_name": "Bob", 
  "last_name": "Sandler", 
  "email": "bob@example.com", 
  "phone": "123-456-7890"
 }
```

The server processes the request and creates a new user account with a generated unique user_id.

The server responds with the created user data, including the user_id.

```json
{ 
  "id": 1,
  "first_name": "Bob", 
  "last_name": "Sandler", 
  "email": "bob@example.com", 
  "phone": "123-456-7890"
}
```

He now has his user activated so that he can continue to create a recipeList. He wants this recipe list to contain all of his best baked goods in one easy-access location for himself and eventually the rest of the world. 

2. He now sends a POST request to `/recipe_lists/` with the following recipe data:

```json
{ 
  "name": "My s tier baked goods", 
  "description": "A one stop shop for all for all my fans to make my bakery items"
}
```

The server processes the request and creates a new RecipeList with an assigned id in our database.

The server responds with the created RecipeList, including the id.

```json
{ 
  "id": 123,
  "name": "My s tier baked goods",
  "description": "A one stop shop for all for all my fans to make my bakery items"
}
```

This is now stored in our database, so Bob can access it, add recipes to it, and eventually share it with the world. 

3. Finally he wants to add his first recipe to his list "My s tier baked goods"

He first sends a POST request to `/recipe/` with the following recipe data:

```json
{
  "name": "Secret Cake Recipe",
  "mins_prep": 20,
  "mins_cook": 30,
  "description": "A delicious and secret cake recipe.",
  "default_servings": 4,
  "procedure": "Step 1: Mix ingredients... Step 2: Bake...",
  "author_id": 1
}
```
The server processes the request and creates a new recipe with an assigned id in our database.

The server responds with the created recipe data, including the id.

```json
{
  "id": 123456,
  "name": "Secret Cake Recipe",
  "mins_prep": 20,
  "mins_cook": 30,
  "description": "A delicious and secret cake recipe.",
  "default_servings": 4,
  "procedure": "Step 1: Mix ingredients... Step 2: Bake...",
  "author_id": 1
}
```

4. He then adds this recipe to his recipeList "My s tier baked goods." He makes a post request to `/recipes/{recipe_id}/recipe-lists/{recipe_list_id}` with the following data:

```json
{
  "recipe_id": 123456,
  "recipe_list_id": 123
}
```

This is now stored in the database, so Bob can access it, and eventually share it. Note that the list that Bob created is not yet associated with him because we haven't implemented sessions. This is still a useful feature.

# Testing results

1. The curl statement called. You can find this in the /docs site for your 
API under each endpoint. For example, for my site the /catalogs/ endpoint 
curl call looks like:

curl -X 'POST' \
  'https://open-recipe.onrender.com/users' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d ' { 
  "name": " Bob Sandler", 
  "email": "bob@example.com", 
  "phone": "123-456-7890"
 }
'

Response:

Response
 ```json
{
  "id": 4,
  "name": " Bob Sandler",
  "email": "bob@example.com",
  "phone": "123-456-7890"
}```

curl -X 'POST' \
  'https://open-recipe.onrender.com/recipe-lists' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "name": "My s tier baked goods", 
  "description": "A one stop shop for all for all my fans to make my bakery items"
}'

 ```json
{ 
  "name": "My s tier baked goods", 
  "description": "A one stop shop for all for all my fans to make my bakery items"
}
```

Response

```json
{
  "id": 1,
  "name": "My s tier baked goods",
  "description": "A one stop shop for all for all my fans to make my bakery items"
}
```

curl -X 'POST' \
  'https://open-recipe.onrender.com/recipes' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Secret Cake Recipe",
  "mins_prep": 20,
  "mins_cook": 30,
  "description": "A delicious and secret cake recipe.",
  "default_servings": 4,
  "procedure": "Step 1: Mix ingredients... Step 2: Bake...",
  "author_id": 4
}'

{
  "id": 1,
  "name": "Secret Cake Recipe",
  "mins_prep": 20,
  "mins_cook": 30,
  "description": "A delicious and secret cake recipe.",
  "default_servings": 4,
  "created_at": null,
  "author_id": "4",
  "procedure": "Step 1: Mix ingredients... Step 2: Bake..."
}


curl -X 'POST' \
  'https://open-recipe.onrender.com/recipes/1/recipe-lists/1' \
  -H 'accept: application/json' \
  -d ''

"OK"





###Use Case 3: Retrieving Recipe Ingredients

Carol wants to view the ingredients required for the "Secret Cake Recipe" that Bob recently posted, because she heard its absolutely delicious. 

Assuming she already has her user created, She first sends a GET request to /recipe/137/ingredient/ where 137 is the "Secret Cake Recipe" id.
```json
{"id": 137}
```

The server processes the request and retrieves the recipe instructions from our database

```json
{  "id": 137,
  "name": "Secret Cake Recipe",
  "mins_prep": 20,
  "mins_cook": 30,
  "description": "A delicious and secret cake recipe",
  "default_servings": 4,
  "created_at": "string",
  "author_id": 1,
  "procedure": "Step 1: Mix ingredients... Step 2: Bake..."
}
```

She then gets the ingredients necessary for this recipe, using the same recipe id (137) #TODO Complete


# Testing results

curl -X 'GET' \
  'http://127.0.0.1:3000/recipes/137' \
  -H 'accept: application/json'

Response:
Response
 ```json
{
  "id": 137,
  "name": "Secret Cake Recipe",
  "mins_prep": 20,
  "mins_cook": 30,
  "description": "A delicious and secret cake recipe",
  "default_servings": 4,
  "created_at": "string",
  "author_id": 1,
  "procedure": "Step 1: Mix ingredients... Step 2: Bake..."
}```

#TODO put gets ingredients from recipe in here