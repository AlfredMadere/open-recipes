# engine = None
# def setup_module():
#     dotenv.load_dotenv()


#     engine = create_engine(os.getenv("TEST_POSTGRES_URI"), pool_pre_ping=True)
#     conn = engine.connect()
#     with engine.connect() as conn:
#         conn.execute("create database test_db")
#         conn.execute("use test_db")
#         conn.execute("""create table "user"
#     (
#         id    integer not null
#             constraint “user”_pkey
#                 primary key,
#         name  text    not null,
#         email text    not null
#             constraint “user”_email_key
#                 unique,
#         phone text
#     );""")
#         conn.execute("""create table recipe
# (
#     id               serial
#         primary key,
#     name             varchar(255) not null,
#     mins_prep        integer,
#     category_id      integer
#         references recipe_list,
#     mins_cook        integer,
#     description      text,
#     author_id        integer
#         references "user",
#     default_servings integer,
#     created_at       timestamp default CURRENT_TIMESTAMP
# );""")
#         conn.execute("""create table recipe_list
# (
#     id          integer not null
#         primary key,
#     name        text    not null,
#     description text
# );""")
#         conn.execute("""create table review
# (
#     id         serial
#         primary key,
#     stars      integer not null,
#     author_id  integer
#         references "user",
#     content    text,
#     recipe_id  integer
#         references recipe,
#     created_at timestamp default CURRENT_TIMESTAMP
# );
# """)
#         conn.execute("""create table ingredient
# (
#     id          serial
#         primary key,
#     name        varchar(255) not null,
#     type        text,
#     storage     storage,
#     category_id integer
#         constraint ingredient_ing_category_id_fk
#             references ing_category
# );""")
#         conn.execute("""create table ing_category
# (
#     id          integer default nextval('ing_category_column_name_seq'::regclass) not null
#         constraint ing_category_pk
#             primary key,
#     name        text                                                              not null,
#     description text
# );""")
#         conn.execute("""create table recipe_ingredients
# (
#     ingredient_id integer not null
#         constraint recipe_ingredients_ingredient_id_fk
#             references ingredient
#             on delete cascade,
#     unit          text,
#     recipe_id     integer not null
#         constraint recipe_ingredients_recipe_id_fk
#             references recipe
#             on delete cascade,
#     quantity      integer not null
# );""")


#         conn.execute("""create table recipe_tag
# (
#     id    integer not null
#         constraint recipe_tag_pk
#             primary key,
#     key   text    not null,
#     value text
# );""")

#         conn.execute("""create table recipe_x_tag
# (
#     recipe_id integer not null
#         constraint recipe_x_tag_recipe_id_fk
#             references recipe,
#     tag_id    integer not null
#         constraint recipe_x_tag_recipe_tag_id_fk
#             references recipe_tag
# );""")

#         conn.execute("""create table recipe_x_recipe_list
# (
#     recipe_id      integer not null
#         constraint recipe_x_recipe_list_recipe_id_fk
#             references recipe,
#     recipe_list_id integer not null
#         constraint recipe_x_recipe_list_recipe_list_id_fk
#             references recipe_list
# );""")


# def teardown_module():
#     engine.conn.execute("drop database test_db")


# def test_recipe_list():
#     requests.post("http://localhost:8000/recipes", json={
#         "name": "test",
#         "mins_prep": 1,
#         "category_id": 1,
#         "mins_cook": 1,
#         "description": "test",
#         "author_id": 1,
#         "default_servings": 1,
#         "tags": [
#             {
#                 "key": "test",
#                 "value": "test"
#             }
#         ]}
#         )


