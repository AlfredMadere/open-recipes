from faker import Faker
import random

from sqlalchemy import text
from database import get_engine

fake = Faker()
# User
def generate_users(n):
    users = []
    for i in range(1, n + 1):
        users.append({
            'id': i,
            'name': fake.name(),
            'email': fake.unique.email(),
            'phone': fake.phone_number()
        })
    return users

# Recipe List
def generate_recipe_lists(n):
    recipe_lists = []
    for i in range(1, n + 1):
        recipe_lists.append({
            'id': i,
            'name': fake.word(),
            'description': fake.text(max_nb_chars=200)
        })
    return recipe_lists

# Recipe
def generate_recipes(n, user_ids, recipe_list_ids):
    recipes = []
    for i in range(1, n + 1):
        recipes.append({
            'id': i,
            'name': fake.unique.sentence(nb_words=3),
            'mins_prep': random.randint(10, 60),
            'category_id': random.choice(recipe_list_ids),
            'mins_cook': random.randint(10, 60),
            'description': fake.text(max_nb_chars=200),
            'calories': random.randint(100, 500),
            'author_id': random.choice(user_ids),
            'default_servings': random.randint(1, 6),
            'created_at': fake.date_time(),
            'procedure': fake.text(max_nb_chars=500)
        })
    return recipes

# Review
def generate_reviews(n, user_ids, recipe_ids):
    reviews = []
    for i in range(1, n + 1):
        reviews.append({
            'id': i,
            'stars': random.randint(1, 5),
            'author_id': random.choice(user_ids),
            'content': fake.text(max_nb_chars=200),
            'recipe_id': random.choice(recipe_ids),
            'created_at': fake.date_time()
        })
    return reviews

# Ingredient Category
def generate_ing_categories(n):
    ing_categories = []
    for i in range(1, n + 1):
        ing_categories.append({
            'id': i,
            'name': fake.word(),
            'description': fake.text(max_nb_chars=200)
        })
    return ing_categories

# Ingredient
def generate_ingredients(n, ing_category_ids):
    ingredients = []
    for i in range(1, n + 1):
        ingredients.append({
            'id': i,
            'name': fake.word() + str(i),
            'type': fake.word(),
            'storage': random.choice(['PANTRY', 'FRIDGE', 'FREEZER']),
            'category_id': random.choice(ing_category_ids)
        })
    return ingredients

# Recipe Ingredients
def generate_recipe_ingredients(n, ingredient_ids, recipe_ids):
    recipe_ingredients = []
    for _ in range(n):
        recipe_ingredients.append({
            'ingredient_id': random.choice(ingredient_ids),
            'unit': fake.word(),
            'recipe_id': random.choice(recipe_ids),
            'quantity': random.randint(1, 10)
        })
    return recipe_ingredients

# Recipe Tags
def generate_recipe_tags(n):
    recipe_tags = []
    for i in range(1, n + 1):
        recipe_tags.append({
            'id': i,
            'key': fake.word(),
            'value': fake.word()
        })
    return recipe_tags

# Recipe X Tags
def generate_recipe_x_tags(n, recipe_ids, tag_ids):
    recipe_x_tags = []
    for _ in range(n):
        recipe_x_tags.append({
            'recipe_id': random.choice(recipe_ids),
            'tag_id': random.choice(tag_ids)
        })
    return recipe_x_tags

# User X Recipe List
def generate_user_x_recipe_lists(n, user_ids, recipe_list_ids):
    user_x_recipe_lists = []
    for _ in range(n):
        user_x_recipe_lists.append({
            'user_id': random.choice(user_ids),
            'recipe_list_id': random.choice(recipe_list_ids),
            'permissions': fake.word()
        })
    return user_x_recipe_lists

def generate_uver_x_ingredients(n, user_ids, ingredient_ids):
    user_x_ingredients = []
    seen_user_x_recipe_lists = set()
    for _ in range(n):
        user_id = random.choice(user_ids)
        ingredient_id = random.choice(ingredient_ids)
        while (user_id, ingredient_id) in seen_user_x_recipe_lists:
            user_id = random.choice(user_ids)
            ingredient_id = random.choice(ingredient_ids)

        seen_user_x_recipe_lists.add((user_id, ingredient_id))
    for user_id, ingredient_id in seen_user_x_recipe_lists:
        user_x_ingredients.append({
            'user_id': user_id,
            'ingredient_id': ingredient_id,
            'quantity': random.randint(1, 10),
            'unit': fake.word()
        })
    return user_x_ingredients

# Implementing the functions to generate data
num_users = 5000
num_recipe_lists = 50000
num_recipes = 100000
num_reviews = 50
num_ing_categories = 8
num_ingredients = 50000
num_recipe_tags = 200

num_recipe_ingredients = 800000
num_user_x_recipe_lists = 100

num_recipe_x__tag = 300000

num_user_x_ingredients = 300000

users = generate_users(num_users)
recipe_lists = generate_recipe_lists(num_recipe_lists)
recipes = generate_recipes(num_recipes, [u['id'] for u in users], [rl['id'] for rl in recipe_lists])
reviews = generate_reviews(num_reviews, [u['id'] for u in users], [r['id'] for r in recipes])
ing_categories = generate_ing_categories(num_ing_categories)
ingredients = generate_ingredients(num_ingredients, [ic['id'] for ic in ing_categories])
recipe_ingredients = generate_recipe_ingredients(num_recipe_ingredients, [ing['id'] for ing in ingredients], [r['id'] for r in recipes])
recipe_tags = generate_recipe_tags(num_recipe_tags)
recipe_x_tags = generate_recipe_x_tags(num_recipe_x__tag, [r['id'] for r in recipes], [rt['id'] for rt in recipe_tags])
user_x_recipe_lists = generate_user_x_recipe_lists(num_user_x_recipe_lists, [u['id'] for u in users], [rl['id'] for rl in recipe_lists])
user_x_ingredients = generate_uver_x_ingredients(num_user_x_ingredients, [u['id'] for u in users], [ing['id'] for ing in ingredients])


def insert_users():
    with get_engine().connect() as conn:
        query_str = "INSERT INTO \"user\" (name, email, phone) VALUES "
        for user in users:
            query_str += f"('{user['name']}', '{user['email']}', '{user['phone']}'),"

        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()

def insert_recipe_lists():
    with get_engine().connect() as conn:
        query_str = "INSERT INTO recipe_list (name, description) VALUES "
        for recipe_list in recipe_lists:
            query_str += f"('{recipe_list['name']}', '{recipe_list['description']}'),"
            if recipe_list['id'] % 10000 == 0:
                query_str = query_str[:-1] + ";"
                conn.execute(text(query_str))
                query_str = "INSERT INTO recipe_list (name, description) VALUES "

        conn.commit()

def insert_recipes():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO recipe (name, mins_prep, mins_cook, description, calories, author_id, default_servings, created_at, procedure) VALUES "
        for i,recipe in enumerate(recipes):
            query_str += f"('{recipe['name']}', {recipe['mins_prep']}, {recipe['mins_cook']}, '{recipe['description']}', {recipe['calories']}, {recipe['author_id']}, {recipe['default_servings']}, '{recipe['created_at']}', '{recipe['procedure']}'),"
            if (i - 1) % 25000 == 0:
                print(i)
                query_str = query_str[:-1] + ";"
                conn.execute(text(query_str))
                query_str = "INSERT INTO recipe (name, mins_prep, mins_cook, description, calories, author_id, default_servings, created_at, procedure) VALUES "
        
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()

def insert_reviews():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO review (stars, author_id, content, recipe_id, created_at) VALUES "
        for review in reviews:
            query_str += f"({review['stars']}, {review['author_id']}, '{review['content']}', {review['recipe_id']}, '{review['created_at']}'),"
            # if review['id'] % 10000 == 0:
            #     query_str = query_str[:-1] + ";"
            #     conn.execute(text(query_str))
            #     query_str = "INSERT INTO review (stars, author_id, content, recipe_id, created_at) VALUES "
        
        conn.execute(text(query_str))
        conn.commit()

def insert_ing_categories():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO ing_category (name, description) VALUES "
        for ing_category in ing_categories:
            query_str += f"('{ing_category['name']}', '{ing_category['description']}'),"
            # if ing_category['id'] % 10000 == 0:
            #     query_str = query_str[:-1] + ";"
            #     conn.execute(text(query_str))
            #     query_str = "INSERT INTO ing_category (name, description) VALUES "
        
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()

def insert_ingredients():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO ingredient (name, type, storage, category_id) VALUES "
        for i,ingredient in enumerate(ingredients):
            query_str += f"('{ingredient['name']}', '{ingredient['type']}', '{ingredient['storage']}', {ingredient['category_id']}),"
            # if i % 10000 == 0:
            #     query_str = query_str[:-1] + ";"
            #     conn.execute(text(query_str))
            #     query_str = "INSERT INTO ingredient (name, type, storage, category_id) VALUES "
        
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()

def insert_recipe_ingredients():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO recipe_ingredients (ingredient_id, unit, recipe_id, quantity) VALUES "
        for i,recipe_ingredient in enumerate(recipe_ingredients):
            query_str += f"({recipe_ingredient['ingredient_id']}, '{recipe_ingredient['unit']}', {recipe_ingredient['recipe_id']}, {recipe_ingredient['quantity']}),"
            if (i - 1) % 400000 == 0:
                try:
                    query_str = query_str[:-1] + ";"
                    conn.execute(text(query_str))
                    query_str = "INSERT INTO recipe_ingredients (ingredient_id, unit, recipe_id, quantity) VALUES "
                except Exception as e:
                    print(e)
                    break
                print(i)

        conn.commit()

def insert_recipe_tags():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO recipe_tag (key, value) VALUES "
        for i,recipe_tag in enumerate(recipe_tags):
            query_str += f"('{recipe_tag['key']}', '{recipe_tag['value']}'),"
            # if i % 10000 == 0:
            #     query_str = query_str[:-1] + ";"
            #     conn.execute(text(query_str))
            #     query_str = "INSERT INTO recipe_tag (key, value) VALUES "
        
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()

def insert_recipe_x_tags():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO recipe_x_tag (recipe_id, tag_id) VALUES "
        for i,recipe_x_tag in enumerate(recipe_x_tags):
            query_str += f"({recipe_x_tag['recipe_id']}, {recipe_x_tag['tag_id']}),"
            # if i % 10000 == 0:
            #     query_str = query_str[:-1] + ";"
            #     conn.execute(text(query_str))
            #     query_str = "INSERT INTO recipe_x_tag (recipe_id, tag_id) VALUES "
        
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()


def insert_user_x_recipe_lists():
    with get_engine().connect() as conn:

        query_str = "INSERT INTO user_x_recipe_list (user_id, recipe_list_id, permissions) VALUES "
        for i,user_x_recipe_list in enumerate(user_x_recipe_lists):
            query_str += f"({user_x_recipe_list['user_id']}, {user_x_recipe_list['recipe_list_id']}, '{user_x_recipe_list['permissions']}'),"
            # if i % 10000 == 0:
            #     query_str = query_str[:-1] + ";"
            #     conn.execute(text(query_str))
            #     query_str = "INSERT INTO user_x_recipe_list (user_id, recipe_list_id, permissions) VALUES "
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()

def insert_user_x_ingredients():

    with get_engine().connect() as conn:

        query_str = "INSERT INTO user_x_ingredient (user_id, ingredient_id, quantity, unit) VALUES "
        for i,user_x_ingredient in enumerate(user_x_ingredients):
            query_str += f"({user_x_ingredient['user_id']}, {user_x_ingredient['ingredient_id']}, {user_x_ingredient['quantity']}, '{user_x_ingredient['unit']}'),"
            # if (i - 1) % 100 == 0:
            #     try:
            #         query_str = query_str[:-1] + ";"
            #         conn.execute(text(query_str))
            #         query_str = "INSERT INTO user_x_ingredient (user_id, ingredient_id, quantity, unit) VALUES "
            #     except Exception as e:
            #         print(e)
            #         break
            #     print(i)
        query_str = query_str[:-1] + ";"
        conn.execute(text(query_str))
        conn.commit()


def insert_all():
    # truncate all atbles

    with get_engine().connect() as conn:
        conn.execute(text(
            f"""
            TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;
            TRUNCATE TABLE recipe_list RESTART IDENTITY CASCADE ;
            TRUNCATE TABLE recipe RESTART IDENTITY CASCADE;
            TRUNCATE TABLE review RESTART IDENTITY CASCADE;
            TRUNCATE TABLE ing_category RESTART IDENTITY CASCADE;
            TRUNCATE TABLE ingredient RESTART IDENTITY CASCADE;
            TRUNCATE TABLE recipe_ingredients RESTART IDENTITY CASCADE;
            TRUNCATE TABLE recipe_tag RESTART IDENTITY CASCADE;
            TRUNCATE TABLE recipe_x_tag RESTART IDENTITY CASCADE;
            TRUNCATE TABLE user_x_recipe_list RESTART IDENTITY CASCADE;
            TRUNCATE TABLE user_x_ingredient RESTART IDENTITY CASCADE;
            ALTER SEQUENCE "user_id_seq" RESTART WITH 1;

            """
        ))
        result = conn.execute(text("SELECT pg_get_serial_sequence('user', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))

        result = conn.execute(text("SELECT pg_get_serial_sequence('recipe_list', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))

        result = conn.execute(text("SELECT pg_get_serial_sequence('recipe', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))

        result = conn.execute(text("SELECT pg_get_serial_sequence('review', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))

        result = conn.execute(text("SELECT pg_get_serial_sequence('ing_category', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))

        result = conn.execute(text("SELECT pg_get_serial_sequence('ingredient', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))


        result = conn.execute(text("SELECT pg_get_serial_sequence('recipe_tag', 'id')"))
        conn.execute(text(f"ALTER SEQUENCE {result.fetchone()[0]} RESTART WITH 1"))

        

        conn.commit()

    insert_users()
    print("done w users")
    insert_recipe_lists()
    print("done w recipe lists")
    insert_ing_categories()
    print("done w ing categories")
    insert_ingredients()
    print("done w ingredients")
    insert_recipes()
    print("done w recipes")
    insert_recipe_ingredients()
    print("done w recipe ingredients")
    insert_recipe_tags()
    print("done w recipe tags")
    insert_recipe_x_tags()
    print("done w recipe x tags")
    # insert_user_x_recipe_lists()
    # print("done w user x recipe lists")
    insert_user_x_ingredients()
    print("done w user x ingredients")
# print("here")
# insert_all()

insert_user_x_ingredients()

