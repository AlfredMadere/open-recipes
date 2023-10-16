# Example flows
Create at least three distinct examples flows of how your endpoints will be called to satisfy some of the use cases described in the User Stories you created in the last deliverable. A single flow should look something like


###Use Case 1: Creating a New User
Alice wants to create a new user account in the application, because she desperately wants to be able to use our project. Therefore, she sends a POST request to /user/ with the following data:
{ "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice@example.com",
    "phone": 123-456-7890 }

The server processes the request and creates a new user account with an assigned user_id.

The server responds with the created user data, including the user_id.

{ "id": 12345, 
"first_name": "Alice", 
"last_name": "Johnson", 
"email": "alice@example.com", 
"phone": 123-456-7890 }

She now has her user activated so that she can continue to browse. 


###Use Case 2: Creating a New Recipe

Bob wants to share his secret recipe with other people, so everyone knows he is a good cook. He first sends a POST request to /recipe/ with the following recipe data:

{ "name": "Secret Cake Recipe", 
"description": "A delicious and secret cake recipe.", 
"procedure": "Step 1: Mix ingredients... Step 2: Bake...", 
"author_id": 54321 
} 

The server processes the request and creates a new recipe with an assigned recipe_id in our database. 

The server responds with the created recipe data, including the recipe_id.

{ "id": 98765, "name": "Secret Cake Recipe", 
"description": "A delicious and secret cake recipe.", 
"procedure": "Step 1: Mix ingredients... Step 2: Bake...", "author_id": 54321 } 

This is now stored in our database, so Bob can access it. 

###Use Case 3: Retrieving Recipe Ingredients

Carol wants to view the ingredients required for the "Secret Cake Recipe" that Bob recently posted. She sends a GET request to /recipe/98765/ingredient/ where 98765 is the "Secret Cake Recipe" id. 

The server processes the request and retrieves a list of ingredients for the recipe from our database. 

The server responds with the ingredient data for the recipe, including their names and quantities.

[ 
{ "ingredient_id": 111, 
"name": "Flour", 
"quantity": "2 cups" }, 

{  "ingredient_id": 222,
"name": "Sugar", 
"quantity": "1 cup" }, 
{ 
"ingredient_id": 333, 
"name": "Eggs", 
"quantity": "3" } 
] 

Carol now has the necessary information to bake her own Secret Cake Recipe!