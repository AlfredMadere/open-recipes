
We did not have enough detail in our original user flows, so here is an enhanced version of one of our original ones below. 

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

2. He first sends a POST request to `/recipe_lists/` with the following recipe data:

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
<Repeated for each step of the workflow>
1. The curl statement called. You can find this in the /docs site for your 
API under each endpoint. For example, for my site the /catalogs/ endpoint 
curl call looks like:
curl -X 'GET' \
  'https://centralcoastcauldrons.vercel.app/catalog/' \
  -H 'accept: application/json'
2. The response you received in executing the curl statement.