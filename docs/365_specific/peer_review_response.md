##Code Review Comments
Daiwik Swaminathan Code Review: 
1. I would personally combine these two functions (merge get_user into get_users) because their functionalities are so similar
 @router.get("")
 def get_users(engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
     """
     Get all users
     """
     with engine.begin() as conn:
         result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" ORDER BY id"""))
         rows= result.fetchall()
         return [User(id=id, name=name, email=email, phone=phone) for id, name, email, phone in rows]
 
 @router.get('/{user_id}',response_model=User)
 def get_user(user_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
     """
     Get one user
     """
     with engine.begin() as conn:
         result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""),{"user_id":user_id})
         id, name, email, phone = result.fetchone()
         return User(id=id, name=name, email=email, phone=phone)
- while this is true, they serve different purposes and it is better to keep them separate for readability and for the design of our project. They work as is, and we are worried about making changes to the endpoints themselves in this late stage.
2. Why is id allowed to be None? This to me seems like a minor copy/paste error but if it is not I'm not too sure how the database will react seeing None as input
def get_ingredient(id : int | None,
- will be resolved, you're right this is a mistake
3. Similar to the first suggestion, I would integrate this function into the bigger GET function for recipes
@router.get('/{id}', response_model=Recipe)
def get_recipe(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
- while this is true, they serve different purposes and it is better to keep them separate for readability for the design of our project. Espescially because get_recipes is our search functionality. 
4. If you decide not to implement the third suggestion, I would recommend updating the URL of this endpoint, specifically changing {id} to {recipe_id} for clarity and consistency
- resolved, changing name to recipe_id in the function
@router.get('/{id}', response_model=Recipe)
def get_recipe(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> Recipe:
5. Why is this function returning a User object instead of a list of Reviews as specified by the type annotation?
@router.get('/reviews', response_model=List[Review])
def get_reviews(engine : Annotated[Engine, Depends(get_engine)]) -> List[Review]:
 """
 Get all reviews
 """
 with engine.begin() as conn:
     result = conn.execute(text(f"SELECT id, stars, author_id, content, recipe_id, FROM reviews ORDER BY created_at"))
     id, name, email, phone = result.fetchone()
     return User(id=id, name=name, email=email, phone=phone)
- get_reviews should have been commented out, we are not going to implement the reviews so that was a copy paste error. 
6. @router.get('/{id}', response_model=List[Tag])
def get_tags(id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[Tag]:
 with engine.begin() as conn:
     result = conn.execute(text(f"""SELECT id, key, value FROM "recipe_tag" WHERE id = :id"""),{"id":id})
     id, key, value = result.fetchone()
     return Tag(id=id, key=key, value=value)
- resolved, changing function name to get_tag
7. If the passed-in user_id is not in the database, then fetchone will return None, which would cause a TypeError because you cannot deconstruct None. I would suggest adding a check here verifying that result.fetchone() is not null
@router.get('/{user_id}',response_model=User)
def get_user(user_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
 """
 Get one user
 """
 with engine.begin() as conn:
     result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""), 
                                           {"user_id":user_id})
     id, name, email, phone = result.fetchone()
     return User(id=id, name=name, email=email, phone=phone)
- adding error handling to numerous functions, thank you. also added a check to make sure the fetchone() call is not none. 
8. This is what would be known as a magic number. Although functionality-wise this is fine, it is better practice to avoid the use of such hard-coded values in the middle of the code. I would suggest moving page_size to be a default parameter value like how it is in the tags search/GET endpoint
@router.get('', response_model=SearchResults)
def get_recipes(engine : Annotated[Engine, Depends(get_engine)], name: str | None = None, max_time : int | None = 
None, cursor: int = 0, tag_key: str | None = None, tag_value: str | None = None, use_inventory_of: int | None = None) -> 
SearchResults:
 """
 Get all recipes
 """

 [... some proceeding code here ...]

 page_size = 10
- we dont feel as though this is a necessary change at this late stage, if we were to scale this for large consumer use we would implement it. 
9. Type annotation seems incorrect here, as it should not be -> List[User] but rather a single User object. Also, you might want to add a similar check of whether result.fetchone() is None or instead of assuming it is not.
@router.get('/{user_id}',response_model=User)
def get_user(user_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[User]:
 """
 Get one user
 """
 with engine.begin() as conn:
     result = conn.execute(text(f"""SELECT id, name, email, phone FROM "user" WHERE id = :user_id"""), 
                                           {"user_id":user_id})
     id, name, email, phone = result.fetchone()
     return User(id=id, name=name, email=email, phone=phone)
- correct, changed to just User instead of List[User]
10. The functions post_ingredients and create_tag are both POST functions. It might be nice to standardize your python function naming so that these functions are consistent by starting with "post" or "create" but this is more of a style aspect more so than functionality.
- changed them both to post, thank you
11. This is a more general comment speaking on the documentation aspect of the code. I personally feel that there could be more comments (even the briefest ones) with every function and/or internally in the functions so that someone can understand/follow the code faster.
- added comments to code. 
12. Again, this is a more general comment, but I think that a lot of these endpoints could benefit from some exception handling to make it more robust. I know that it probably isn't needed but it would be a nice touch/addition.
- so true, error handling implemented. 
13. This is probably the smallest/most minor comment but you have some imports which are unnecessarily re-imported. Consider this example in tags.py:
from fastapi import FastAPI
from typing import Annotated, Optional
from sqlalchemy.engine import Engine
from fastapi import Depends, FastAPI
As you can see, FastAPI ends up getting imported twice even though it does not need to.
- some imports have been removed, once code is finalized all unnecessary ones will be removed but we dont want to get rid of a bunch right now just to have to add them back later. 


Ian Loo Code Review: 
1. Add comments to api endpoints for readability
- done, thank you 
2. Get rid of commented out and unused code
- this is  going to get resolved as we fully complete the project, but for now we want to keep it in case we need to use it later as we have been refrencing a lot of the comments throughout this process. 
3.Catch 500 server errors and return a tailored error response
- adding error handling. 
4. Remove unused import statements
- will get resolved as we fully complete the project, just dont want to delete out anything we may need later yet. 
5. You could use better function names like instead of get_review you could do get_review_by_id to make it more clear because get_review looks like get_reviews
- got rid of all reviews, fixed this in other files. 
6. You could have a reviews.py file for all the reviews endpoints instead of putting it in the recipes.py file
- we got rid of this endpoint, it was in there by mistake so it is gone
7. There are some discrepancies in the styling for example no spaces between commas and then spaces between commas, maybe getting some styler extension could help
- this is not our priority at this stage as we feel like all the code is fully readable at this point even with comma discrepencies. 
8. There’s also a lot of random blank lines that could be deleted
- these are often intenional for spacing and readability, but if they are in the way they have been deleted. 
9. Sometimes you return an object for example the get_recipe endpoint, other times you set the object equal to a variable and then return the variable. You should pick one way and implement it like that for all the endpoints that return objects
- there are intentional readability reasons for these differences, and we don't feel as though they impact the readability or usability of our project and code so will leave them for now. 
10. The get_recipes function is huge and it could probably be broken down into smaller methods that are responsible for specific parts of the logic.
- this would overcomplicate our system as it already works as is in this late stage. 
11. Instead of hardcoding the page_size you could make it an environment variable to make the application easily configurable
- this does not feel necessary right now as we are not making it for widescale use at this point in time, but we would do this if necessary when scaling later. 
12. Remove unnecessary print statements used for debugging. If you still want debug info consider using logging
- they have been commented out, will be fully removed once we complete the code entirely.

Bryan Nguyen Code Review: 
1. def get_user(user_id: int,engine : Annotated[Engine, Depends(get_engine)]) -> List[User] has an incorrect type annotation as you are actually returning a single user rather than a list of users
- fixed!
2. You should also check in get_user() if result is None, as the deconstructing in the next line will error if it is None, leading to a 500 server error. You should properly return a 404 user not found error instead.
- check added, thank you. 
3. Naming of functions should be more clear and accurate. For example, there are 2 functions called get_tags(), one of which actually only returns a singular tag based on an id. Also consider how the naming of post_recipes() implies that you are inserting multiple recipes, while in actuality you're only inserting one.
- function names have been changed
4. The page_size variable inside get_recipes() isn't configurable, while the one in get_tags() is, so you should add page_size() as a parameter inside get_recipes() to improve consistency.
- this does not feel necessary right now as we are not making it for widescale use at this point in time, but we would do this when scaling later. 
5. get_tag() and get_ingredient(), similarly to get_user(), also don't account for result being none, possibly leading to a server errors while deconstructing.
- will be caught now that we have better error handling, so resolved. 
6. def get_ingredient(id : int | None,engine : Annotated[Engine, Depends(get_engine)]) -> Ingredient allows for None to be passed in as an id, which will inevitably lead to a server error
- resolved with error handling. given the nature of the project, this should not happen though
7. Consider creating variables to hold the text for SQL queries instead of putting it straight into the conn.execute() for better readability
- while this may make it more readable to an outside user, this is the way that the three of us as developers prefer and undestand. If we made this into a widescale project we could consider outside readers, but for now we are primarily concerned with ourselves and our personal readability. 
8. Add more error handling
- added! 
9. Be more consistent with the styling of your code (consider using a code formatter such as Prettier)
- this is not a main priority right now, but if we have time later we will worry about the visual effect of our code. 
10. Remove all commented-out code, duplicate imports, random/unnecessary lines, and print statements used for debugging
- once we are fully complete with the assignment we will do this, but want to leave it all for now until everything is implemented in case we need anything at a later point. 
11. Add some comments to make code functionality more clear, especially in bigger functions such as get_recipes()
- done!
12. Some of the lines of code are fairly long, so possibly consider making them multi-line to improve readability.
- done!










##Schema/API Comments
daiwik-swaminathan 
1. I might be wrong about this, but as far as I could tell, allergies seem to not be accounted for. For example, if I have a dairy allergy, is this something that I can enter in as information about my account when signing up? This would be helpful when a user were to lookup a recipe and they would be clearly alerted to the fact that this recipe contains dairy. You might need to add this as an attribute for recipes listing the allergens that this recipe contains. It’s possible that Tags might cover this but I’m not too sure.
 - This feature is not directly implemented but can be simulated through the search mechanism. You can search by ingredients you own and as long as you dont own any ingredients you are allergic to, you will only get recipes that you can make with the ingredients you own.
2. What are Tags? I’m looking at the API specs and other docs and cannot seem to find what kind of data is associated with a Tag. Are these things are built-in or can users create them? The improvement here is there should be more documentation regarding what Tags are.
- Tags are way to add additional to ingredients. Users can create them and some them are built in. It might seem cluttered but for a frontend (being built for another class) it works well as it is flexible enough to add data of different types such as ingerdient type, equipment and type etc.
3. What is the difference between mins_prep and mins_cook? Personally, I feel like these could be combined into one field but that’s just my opinion.
- prep is prep time, while cook is physical cook time, like time in the oven. when you search a recipe by time, it totals these two values. 
4. Based on the fact that recipes have authors, it seems like in theory, every user could create/post their own recipes for, let’s say, chocolate chip cookies. This would lead to a multitude of recipes for chocolate chip cookies if someone were to use the recipes search endpoint if they were to pass in “chocolate chip cookies” for the name. However, one filter which I feel like is lacking here is the ability to sort by ratings. If a 100 chocolate chip cookie recipes are going to be returned, I would want to look at only the ones with the highest ratings. I could be wrong about this and that there is a way to sort based on ratings, but it seems like this functionality does not exist. This would be a great feature.
- yes this is a great suggestion and this feature will be implemented
5. I think each recipe should have an attribute referencing a list of reviews for that recipe. This is something that seems alluded to in the ER diagram (there is an arrow between recipe and review), but this does not seem to be reflected in the code.
- Yes there should be an endpoint that allows you to get all reviews for a recipe. This is a great suggestion, implemented!
6. Based on some of the user stories, it seems like one attribute which would be useful to note down for recipes/ingredients would be price/cost. Especially for college students, this would be very nice information to have especially if students could sort pasta recipes, for example, based on total cost (assuming they do not have any ingredients on hand).
- It is hard to implement this as there is no way to know the price of an ingredient. The price depends on the store and the brand and even the time of day, so we realized it would not be feasible at this scale. 
7. Although I see that update_recipe has not been implemented yet, I think this is an interesting endpoint to think about design-wise. Consider, with chocolate chip cookies once again, that I find a recipe that someone else made that I absolutely love. I then add this recipe to a RecipeList of mine with my all time favorite snacks to bake. Then, the original author of the recipe decides to update their recipe because they think they found a better one. However, I wake up to a recipe that is not only different, but also worse in my opinion. This brings into question whether recipes should be allowed to be updated, and if so, how the mechanics of that would work. Personally, I feel like it is easier to eliminate the ability to update recipes and instead new ones need to be made. Of course, this has its downsides as well (like cluttering the recipes database).
- yes we dont plan to add update recipe for the reason you mentioned
8. Having a remove_recipe_from_recipe_list would be a nice functionality to have. Consider the case if I make pasta so often that I then get sick of it and no longer want to have this recipe clutter my list.
- this is a great suggestion and will be implemented
9. Calories would be a terrific addition for information to keep track of in recipes in my opinion. This would be a nice sorting filter as well.
- yes this is a great suggestion and will be implemented
10. I think an argument can be made for a database table with kitchen equipment that would be used for making recipes. It seems like this could, in theory, leverage the Tags to accomplish this. However, I personally don’t think it’s a clean way of doing it, as some recipes require a lot of equipment and having so many Tags would make it look cluttered. I think this also applies to other pieces of information that would be useful to know for a recipe.
- So every ingredient can have a tag indicating that it is an equipment. This is how we implemented it. It might seem cluttered but for a frontend (being built for another class) it works well as it is flexible enough to add data of different types such as ingerdient type, equipment and type etc.
11. I think improving documentation in the API spec would be good. I was able to piece things together mostly but it would be nice to have some more descriptions, even the shortest of ones to facilitate understanding.
- yes this is a great suggestion and will be implemented
12. I think the ER diagram is due for some updates. I noticed some differences between what the diagram has versus what is in the code.
- yes this is a great suggestion and will be implemented
13. Little surprised to see that a list of ingredients is not an attribute in the schema for recipes. I feel like this would be useful information to have.
- there is a seperate endpoint for it in the api. 

s-iloo
1. You should section off your api’s with tags to make the swagger docs more readable
- yes this is a great suggestion and should be implemented
2. Some of the post request return null and you should probably return a success or failure message
- yes this is a great suggestion and should be implemented
3. For similar requests such as posts requests, return the same code whether it be 200 or 201
- 201 is returned for post requests that create a new resource, 200 otherwise
4. Add descriptions to all the api endpoints in the docs, there are descriptions for some
- yes this is a great suggestion and should be implemented
5. You should add an api key
- yes this is a great suggestion and will be implemented once the frontend is ready. There is also a public aspect to it where anyone should be able to add recipes and ingredients to the database
6. For users endpoints you refer to id with “id” and also “user_id”, you should probably just pick one
- yes this is a great suggestion and should be implemented
7. For Post ingredients you should let the database handle id’s instead of making the user input the id
- The database is handling the ids.
8. For Post ingredients on the docs with the request body, for the storage attribute it probably should just be “string” instead of “FRIDGE” same with update ingredient
- We want to restrict the types of storage to the ones mentioned in the enum
9. For update ingredient there is the ingredient id but there is also a category id and you can input both those id’s in the request body but there is also a parameter for id so I think you could get rid of that
- The id in the request body is not passed to the database.
10. Delete endpoints shouldn’t return null and instead some success response like “OK”
- yes this is a great suggestion and should be implemented
11. For route naming you should make sure the names are consistent for example there is /recipes and /recipe/{id} and it might be better to use recipes/{id} instead of /recipe/{id}
- yes this is a great suggestion and should be implemented
12. For Update review there are some fields that don’t really have to do with the review for example the author fields and the recipe fields (also you spell recipe wrong in the docs (recepie)) I feel like the update review should just have stars and content.
- yes this is a great suggestion and should be implemented


Bryan Nguyen    
1. Although ingredient_x_recipe isn't implemented yet, consider changing ml_required to two fields, one specifying the unit of measurement and another specifying how much of that unit, as only using ml is quite restricting
- the schema doesnt refelect it, the er diagram is not up to date
2. The above can also be applied to ml_available in user_x_ingredient
3. Although I am not really sure what the measurement table is for, there seems to be no need for a separate table for measurements table, as that value can be tied to previously existing tables.
- the schema doesnt refelect it, the er diagram is not up to date
4. Although recipe_x_appliance is mentioned in the schema, there seems to be no appliance table, but I do find the existence of a table listing all the appliances needed for a recipe very useful
5. An interesting idea for the appliance table could be to point towards other appliances in the table that could serve as replacements in the scenario that the user doesn't own that specific appliance, but has other appliances with similar uses.
- the schema doesnt refelect it, the er diagram is not up to date
6. Also consider having a users_x_appliance, which tracks which appliances users have access to, in order to better curate recipes towards that user
- the schema doesnt refelect it, the er diagram is not up to date
7. Price columns for ingredients and appliances also seem fairly helpful, as they could also be used to calculate the overall price of any recipe later on.
- It is hard to implement this as there is no way to know the price of an ingredient. The price depends on the store and the brand and even the time.
8. For storage_location, I think that cold_level isn't specific enough. Consider switching this to either fahrenheit or celsius to make it a bit more clear.
- This requires a lot of work on the users part and the benefits dont seem to outweight the costs
9. Also, if you do decide to implement the appliance table, you could maybe get rid of the storage_location table entirely and put the temp to store the ingredient in the ingredient table and include the storage location (ex: fridge) in the appliances table and just point towards an appliance in ingredient as the storage location.
- the schema doesnt refelect it, the er diagram is not up to date. Appliaces are not just ingrediantes with tags.
10. Having a calorie column for ingredients would also seem helpful, as you could use it to calculate total calories for recipes.
- yes this is a great suggestion and should be implemented
11. Adding an allergies table would also be helpful, so that you could track individual user allergies and remove any recipes that conflict with that user's allergies.
Consider implementing tags so that the url definitions are a bit more readable and so that the render docs are better organized.
- This feature is not directly implemented but can simulated through the search mechanism. You can search by ingredients you own and as long as you dont own any ingredients you are allergic to, you will only get recipes that you can make with the ingredients you own.
12. Overall, I would personally say to just implement more of the ideas brought up in the ER diagram, as not all of them are yet fully fleshed out in the code.
- We decided to follow the data model we decided on in the er diagram. Yet all the features have reamined the same just the modelling has changed.

create table public.recipe
(
    id               serial
        primary key,
    name             varchar(255) not null,
    mins_prep        integer,
    category_id      integer
        references public.recipe_list,
    mins_cook        integer,
    description      text,
    author_id        integer
        references public."user",
    default_servings integer,
    created_at       timestamp default CURRENT_TIMESTAMP,
    procedure        text
);

changes to 

create table public.recipe
(
    id               serial
        primary key,
    name             varchar(255) not null,
    mins_prep        integer,
    category_id      integer
        references public.recipe_list,
    mins_cook        integer,
    calories        integer,
    description      text,
    author_id        integer
        references public."user",
    default_servings integer,
    created_at       timestamp default CURRENT_TIMESTAMP,
    procedure        text
)