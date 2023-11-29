create sequence “user”_id_seq;

alter sequence “user”_id_seq owner to alfred;

create sequence recipe_list_id_seq
    as integer;

alter sequence recipe_list_id_seq owner to alfred;

create sequence ing_category_column_name_seq
    as integer;

alter sequence ing_category_column_name_seq owner to alfred;

create sequence user_id_seq
    as integer;

alter sequence user_id_seq owner to alfred;

create sequence recipe_list_id_seq1;

alter sequence recipe_list_id_seq1 owner to alfred;

create type storage as enum ('PANTRY', 'FRIDGE', 'FREEZER');

alter type storage owner to alfred;

create table "user"
(
    id              integer generated always as identity
        constraint “user”_pkey
            primary key,
    name            text                  not null,
    email           text                  not null
        constraint “user”_email_key
            unique,
    phone           text,
    hashed_password text,
    disabled        boolean default false not null
);

alter table "user"
    owner to alfred;

alter sequence “user”_id_seq owned by "user".id;

create table recipe_list
(
    id          integer generated always as identity
        primary key,
    name        text not null,
    description text
);

alter table recipe_list
    owner to alfred;

alter sequence recipe_list_id_seq1 owned by recipe_list.id;

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
    author_id        integer
        references "user",
    default_servings integer,
    created_at       timestamp default CURRENT_TIMESTAMP,
    procedure        text
);

alter table recipe
    owner to alfred;

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
    owner to alfred;

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
    owner to alfred;

create table ing_category
(
    id          integer default nextval('ing_category_column_name_seq'::regclass) not null
        constraint ing_category_pk
            primary key,
    name        text                                                              not null,
    description text
);

alter table ing_category
    owner to alfred;

alter sequence ing_category_column_name_seq owned by ing_category.id;

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
    owner to alfred;

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
    owner to alfred;

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
    owner to alfred;

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
    owner to alfred;

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
    owner to alfred;

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
    owner to alfred;

