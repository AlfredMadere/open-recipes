create sequence “user”_id_seq
    as integer;

alter sequence “user”_id_seq owner to postgres;

grant select, update, usage on sequence “user”_id_seq to anon;

grant select, update, usage on sequence “user”_id_seq to authenticated;

grant select, update, usage on sequence “user”_id_seq to service_role;

create sequence ing_category_column_name_seq
    as integer;

alter sequence ing_category_column_name_seq owner to postgres;

grant select, update, usage on sequence ing_category_column_name_seq to anon;

grant select, update, usage on sequence ing_category_column_name_seq to authenticated;

grant select, update, usage on sequence ing_category_column_name_seq to service_role;

create sequence user_id_seq
    as integer;

alter sequence user_id_seq owner to postgres;

grant select, update, usage on sequence user_id_seq to anon;

grant select, update, usage on sequence user_id_seq to authenticated;

grant select, update, usage on sequence user_id_seq to service_role;

create sequence recipe_list_id_seq1
    as integer;

alter sequence recipe_list_id_seq1 owner to postgres;

grant select, update, usage on sequence recipe_list_id_seq1 to anon;

grant select, update, usage on sequence recipe_list_id_seq1 to authenticated;

grant select, update, usage on sequence recipe_list_id_seq1 to service_role;

create sequence user_id_seq1;

alter sequence user_id_seq1 owner to postgres;

grant select, update, usage on sequence user_id_seq1 to anon;

grant select, update, usage on sequence user_id_seq1 to authenticated;

grant select, update, usage on sequence user_id_seq1 to service_role;

create sequence recipe_list_id_seq2
    as integer;

alter sequence recipe_list_id_seq2 owner to postgres;

grant select, update, usage on sequence recipe_list_id_seq2 to anon;

grant select, update, usage on sequence recipe_list_id_seq2 to authenticated;

grant select, update, usage on sequence recipe_list_id_seq2 to service_role;

create type storage as enum ('PANTRY', 'FRIDGE', 'FREEZER');

alter type storage owner to postgres;

create table "user"
(
    id    integer generated always as identity
        constraint “user”_pkey
            primary key,
    name  text not null,
    email text not null
        constraint “user”_email_key
            unique,
    phone text
);

alter table "user"
    owner to postgres;

alter sequence user_id_seq1 owned by "user".id;

grant delete, insert, references, select, trigger, truncate, update on "user" to anon;

grant delete, insert, references, select, trigger, truncate, update on "user" to authenticated;

grant delete, insert, references, select, trigger, truncate, update on "user" to service_role;

create table recipe_list
(
    id          integer generated always as identity
        primary key,
    name        text not null,
    description text
);

alter table recipe_list
    owner to postgres;

grant select, update, usage on sequence recipe_list_id_seq to anon;

grant select, update, usage on sequence recipe_list_id_seq to authenticated;

grant select, update, usage on sequence recipe_list_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on recipe_list to anon;

grant delete, insert, references, select, trigger, truncate, update on recipe_list to authenticated;

grant delete, insert, references, select, trigger, truncate, update on recipe_list to service_role;

create table recipe
(
    id               serial
        primary key,
    name             varchar(255) not null,
    mins_prep        integer,
    category_id      integer
        references recipe_list,
    mins_cook        integer,
    description      text,
    calories          integer,
    author_id        integer
        references "user",
    default_servings integer,
    created_at       timestamp default CURRENT_TIMESTAMP,
    procedure        text
);

alter table recipe
    owner to postgres;

grant select, update, usage on sequence recipe_id_seq to anon;

grant select, update, usage on sequence recipe_id_seq to authenticated;

grant select, update, usage on sequence recipe_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on recipe to anon;

grant delete, insert, references, select, trigger, truncate, update on recipe to authenticated;

grant delete, insert, references, select, trigger, truncate, update on recipe to service_role;

create table review
(
    id         serial
        primary key,
    stars      integer not null,
    author_id  integer
        references "user",
    content    text,
    recipe_id  integer
        references recipe,
    created_at timestamp default CURRENT_TIMESTAMP
);

alter table review
    owner to postgres;

grant select, update, usage on sequence review_id_seq to anon;

grant select, update, usage on sequence review_id_seq to authenticated;

grant select, update, usage on sequence review_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on review to anon;

grant delete, insert, references, select, trigger, truncate, update on review to authenticated;

grant delete, insert, references, select, trigger, truncate, update on review to service_role;

create table user_x_recipe_list
(
    user_id        integer not null
        constraint user_x_recipe_list_user_id_fk
            references "user",
    recipe_list_id integer not null
        constraint user_x_recipe_list_recipe_list_id_fk
            references recipe_list,
    permissions    text
);

alter table user_x_recipe_list
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on user_x_recipe_list to anon;

grant delete, insert, references, select, trigger, truncate, update on user_x_recipe_list to authenticated;

grant delete, insert, references, select, trigger, truncate, update on user_x_recipe_list to service_role;

create table ing_category
(
    id          integer default nextval('ing_category_column_name_seq'::regclass) not null
        constraint ing_category_pk
            primary key,
    name        text                                                              not null,
    description text
);

alter table ing_category
    owner to postgres;

alter sequence ing_category_column_name_seq owned by ing_category.id;

grant delete, insert, references, select, trigger, truncate, update on ing_category to anon;

grant delete, insert, references, select, trigger, truncate, update on ing_category to authenticated;

grant delete, insert, references, select, trigger, truncate, update on ing_category to service_role;

create table ingredient
(
    id          serial
        primary key,
    name        text not null
        constraint ingredient_pk
            unique
        constraint ingredient_pk2
            unique,
    type        text,
    storage     storage,
    category_id integer
        constraint ingredient_ing_category_id_fk
            references ing_category
);

alter table ingredient
    owner to postgres;

grant select, update, usage on sequence ingredient_id_seq to anon;

grant select, update, usage on sequence ingredient_id_seq to authenticated;

grant select, update, usage on sequence ingredient_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on ingredient to anon;

grant delete, insert, references, select, trigger, truncate, update on ingredient to authenticated;

grant delete, insert, references, select, trigger, truncate, update on ingredient to service_role;

create table recipe_ingredients
(
    ingredient_id integer not null
        constraint recipe_ingredients_ingredient_id_fk
            references ingredient
            on delete cascade,
    unit          text,
    recipe_id     integer not null
        constraint recipe_ingredients_recipe_id_fk
            references recipe
            on delete cascade,
    quantity      integer not null
);

alter table recipe_ingredients
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on recipe_ingredients to anon;

grant delete, insert, references, select, trigger, truncate, update on recipe_ingredients to authenticated;

grant delete, insert, references, select, trigger, truncate, update on recipe_ingredients to service_role;

create table recipe_tag
(
    id    integer generated always as identity
        constraint recipe_tag_pk
            primary key,
    key   text not null,
    value text,
    unique (key, value)
);

alter table recipe_tag
    owner to postgres;

grant select, update, usage on sequence recipe_tag_id_seq to anon;

grant select, update, usage on sequence recipe_tag_id_seq to authenticated;

grant select, update, usage on sequence recipe_tag_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on recipe_tag to anon;

grant delete, insert, references, select, trigger, truncate, update on recipe_tag to authenticated;

grant delete, insert, references, select, trigger, truncate, update on recipe_tag to service_role;

create table recipe_x_tag
(
    recipe_id integer not null
        constraint recipe_x_tag_recipe_id_fk
            references recipe,
    tag_id    integer not null
        constraint recipe_x_tag_recipe_tag_id_fk
            references recipe_tag
);

alter table recipe_x_tag
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on recipe_x_tag to anon;

grant delete, insert, references, select, trigger, truncate, update on recipe_x_tag to authenticated;

grant delete, insert, references, select, trigger, truncate, update on recipe_x_tag to service_role;

create table recipe_x_recipe_list
(
    recipe_id      integer not null
        constraint recipe_x_recipe_list_recipe_id_fk
            references recipe
            on delete cascade,
    recipe_list_id integer not null
        constraint recipe_x_recipe_list_recipe_list_id_fk
            references recipe_list
            on delete cascade,
    constraint recipe_x_recipe_list_pk
        primary key (recipe_id, recipe_list_id)
);

alter table recipe_x_recipe_list
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on recipe_x_recipe_list to anon;

grant delete, insert, references, select, trigger, truncate, update on recipe_x_recipe_list to authenticated;

grant delete, insert, references, select, trigger, truncate, update on recipe_x_recipe_list to service_role;

create table user_x_ingredient
(
    user_id       integer not null
        constraint user_x_ingredient_user_id_fk
            references "user",
    ingredient_id integer not null
        constraint user_x_ingredient_ingredient_id_fk
            references ingredient,
    unit          text,
    quantity      integer,
    constraint user_x_ingredient_pk
        primary key (user_id, ingredient_id)
);

alter table user_x_ingredient
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on user_x_ingredient to anon;

grant delete, insert, references, select, trigger, truncate, update on user_x_ingredient to authenticated;

grant delete, insert, references, select, trigger, truncate, update on user_x_ingredient to service_role;

