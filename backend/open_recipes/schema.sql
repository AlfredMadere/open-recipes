create table public."user"
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

alter table public."user"
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public."user" to anon;

grant delete, insert, references, select, trigger, truncate, update on public."user" to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public."user" to service_role;

create table public.recipe_list
(
    id          integer generated always as identity
        primary key,
    name        text not null,
    description text
);

alter table public.recipe_list
    owner to postgres;

grant select, update, usage on sequence public.recipe_list_id_seq to anon;

grant select, update, usage on sequence public.recipe_list_id_seq to authenticated;

grant select, update, usage on sequence public.recipe_list_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_list to anon;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_list to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_list to service_role;

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

alter table public.recipe
    owner to postgres;

grant select, update, usage on sequence public.recipe_id_seq to anon;

grant select, update, usage on sequence public.recipe_id_seq to authenticated;

grant select, update, usage on sequence public.recipe_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on public.recipe to anon;

grant delete, insert, references, select, trigger, truncate, update on public.recipe to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.recipe to service_role;

create table public.review
(
    id         serial
        primary key,
    stars      integer not null,
    author_id  integer
        references public."user",
    content    text,
    recipe_id  integer
        references public.recipe,
    created_at timestamp default CURRENT_TIMESTAMP
);

alter table public.review
    owner to postgres;

grant select, update, usage on sequence public.review_id_seq to anon;

grant select, update, usage on sequence public.review_id_seq to authenticated;

grant select, update, usage on sequence public.review_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on public.review to anon;

grant delete, insert, references, select, trigger, truncate, update on public.review to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.review to service_role;

create table public.user_x_recipe_list
(
    user_id        integer not null
        constraint user_x_recipe_list_user_id_fk
            references public."user",
    recipe_list_id integer not null
        constraint user_x_recipe_list_recipe_list_id_fk
            references public.recipe_list,
    permissions    text
);

alter table public.user_x_recipe_list
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.user_x_recipe_list to anon;

grant delete, insert, references, select, trigger, truncate, update on public.user_x_recipe_list to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.user_x_recipe_list to service_role;

create table public.ing_category
(
    id          integer default nextval('ing_category_column_name_seq'::regclass) not null
        constraint ing_category_pk
            primary key,
    name        text                                                              not null,
    description text
);

alter table public.ing_category
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.ing_category to anon;

grant delete, insert, references, select, trigger, truncate, update on public.ing_category to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.ing_category to service_role;

create table public.ingredient
(
    id          serial
        primary key,
    name        varchar(255) not null,
    type        text,
    storage     storage,
    category_id integer
        constraint ingredient_ing_category_id_fk
            references public.ing_category
);

alter table public.ingredient
    owner to postgres;

grant select, update, usage on sequence public.ingredient_id_seq to anon;

grant select, update, usage on sequence public.ingredient_id_seq to authenticated;

grant select, update, usage on sequence public.ingredient_id_seq to service_role;

grant delete, insert, references, select, trigger, truncate, update on public.ingredient to anon;

grant delete, insert, references, select, trigger, truncate, update on public.ingredient to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.ingredient to service_role;

create table public.recipe_ingredients
(
    ingredient_id integer not null
        constraint recipe_ingredients_ingredient_id_fk
            references public.ingredient
            on delete cascade,
    unit          text,
    recipe_id     integer not null
        constraint recipe_ingredients_recipe_id_fk
            references public.recipe
            on delete cascade,
    quantity      integer not null
);

alter table public.recipe_ingredients
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_ingredients to anon;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_ingredients to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_ingredients to service_role;

create table public.recipe_tag
(
    id    integer not null
        constraint recipe_tag_pk
            primary key,
    key   text    not null,
    value text
);

alter table public.recipe_tag
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_tag to anon;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_tag to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_tag to service_role;

create table public.recipe_x_tag
(
    recipe_id integer not null
        constraint recipe_x_tag_recipe_id_fk
            references public.recipe,
    tag_id    integer not null
        constraint recipe_x_tag_recipe_tag_id_fk
            references public.recipe_tag
);

alter table public.recipe_x_tag
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_x_tag to anon;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_x_tag to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_x_tag to service_role;

create table public.recipe_x_recipe_list
(
    recipe_id      integer not null
        constraint recipe_x_recipe_list_recipe_id_fk
            references public.recipe,
    recipe_list_id integer not null
        constraint recipe_x_recipe_list_recipe_list_id_fk
            references public.recipe_list,
    constraint recipe_x_recipe_list_pk
        primary key (recipe_id, recipe_list_id)
);

alter table public.recipe_x_recipe_list
    owner to postgres;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_x_recipe_list to anon;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_x_recipe_list to authenticated;

grant delete, insert, references, select, trigger, truncate, update on public.recipe_x_recipe_list to service_role;

