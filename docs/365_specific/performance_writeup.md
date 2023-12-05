## Fake Data Modeling

Find the python file used to generate the rows by navigating to `cd ../../backend/seeding/seed.py` from this file.

We based everything on the users column with every other table having a multiplier based on the amount of users, and then chose the number for users based on what would get us to 1 million rows, which ended up being 5000 users.
 
The ingredients and tags are fixed values not revolving around the users, based on information we found on the internet. 
ingredients has 50,000 rows, because that is the average amount of ingredients in an American grocery store. 
tags is 200 rows, because including allergies, appliances, cuisines, etc that was the most we could fathom being realistic unique key value pairs. 

Recipe lists = user x 10
recipes = user x 20 
users = x
 
User x ingredient = user x 10
Recipe x ingredient: = (user x 20) x 8
Recipe x tag = (user x 20 ) x 3

We thought that each user would make about 20 recipes, with 5 for each breakfast, lunch, dinner, and dessert. 

With sectioning those into breakfast, lunch dinner, dessert, and then sectioning each of those down further, we figured around 10 recipe lists per user as well. 

Then our join tables would scale accordingly, being based on their respective tables being joined. User x ingredient assumes each user has about 10 ingredients in their inventory at any given time, given the space in a fridge for the average person. Recipe x ingredient assumes each recipe has about 8 ingredients, making sense with a main component, some sides, and some spices and cooking supplies like oil. Finally, recipe x tag assumes each recipe has about 3 tags, including an appliance, an allergen, and a cuisine tag. 

While all of these would be fluid with some outliers for sure, these made the most sense on average for our rows to hit 1 million.

Rows in tables:

**ing_category:** 8
**ingredient:** 50000
**recipe:** 100000
**recipe_ingredients:** 800000
**recipe_lists:** 50000
**recipe_tag:** 200
**recipe_x_tag:** 300000
**user_x_ingredient:** 300000
**user_x_recipe_list:** 100000




## Performance results of hitting endpoints

**In ascending order**

You can regenerate this data by running `Pytest -s -k performance `

POST /recipes/{recipe_id}/tags/{tag_id}: 0.0018239021301269531 seconds
POST /tags: 0.0019161701202392578 seconds
GET /tags/{tag_id}: 0.0019822120666503906 seconds
GET /users/{user_id}: 0.0020341873168945312 seconds
POST /recipes/{recipe_id}/ingredients/{ingredient_id}: 0.0020570755004882812 seconds
GET /ingredients/{ingredient_id}: 0.0020570755004882812 seconds
POST /ingredients: 0.0022263526916503906 seconds
POST /recipes/{recipe_id}/recipe-lists/{recipe_list_id}: 0.002432107925415039 seconds
POST /recipe-lists/{recipe_list_id}/recipe/{recipe_id}: 0.0029952526092529297 seconds
GET /ingredients: 0.0031058788299560547 seconds
POST /recipe-lists: 0.0032520294189453125 seconds
POST /users: 0.0034961700439453125 seconds
POST /recipes: 0.004355907440185547 seconds
GET /users/{user_id}/ingredients/: 0.0046329498291015625 seconds
GET /tags: 0.0053081512451171875 seconds
GET /recipes?name=Ability&max_time=50&cursor=0&tag_key=other&tag_value=leg&authored_by=518&order_by=name: 0.006482839584350586 seconds
GET /recipe-lists/{id}: 0.007092952728271484 seconds
GET /recipe-lists: 0.0070950984954833984 seconds
GET /users: 0.008025169372558594 seconds
GET /recipes/{recipe_id}/tags: 0.009064912796020508 seconds
GET /recipes?name=Ability&max_time=50&cursor=0&tag_key=other&tag_value=leg&authored_by=518&use_inventory_of=1&order_by=name: 0.009089946746826172 seconds
GET /recipes/{recipe_id}/ingredients: 0.01904296875 seconds
GET /recipes/{recipe_id}: 0.027595996856689453 seconds
GET /recipes: 0.0801699161529541 seconds

The 3 slowest endpoints are the following

1. GET /recipes: 0.0801699161529541 seconds
2. GET /recipes/{recipe_id}: 0.027595996856689453 seconds
3. GET /recipes/{recipe_id}/ingredients: 0.01904296875 seconds

## Performance tuning

### Slowest endpoints

1. GET /recipes: 0.0801699161529541 seconds 

**Resulting query**

```
SELECT DISTINCT recipe.id, recipe.name, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.author_id, recipe.default_servings, recipe.procedure, recipe.calories
FROM recipe ORDER BY recipe.name
LIMIT 10 OFFSET 0;

```

**Explain output**

```
Limit  (cost=25445.93..25447.47 rows=10 width=645) (actual time=80.263..82.763 rows=10 loops=1)
  ->  Unique  (cost=25445.93..38293.93 rows=83334 width=645) (actual time=80.262..82.761 rows=10 loops=1)
        ->  Gather Merge  (cost=25445.93..36210.58 rows=83334 width=645) (actual time=80.262..82.756 rows=10 loops=1)
              Workers Planned: 2
              Workers Launched: 2
              ->  Unique  (cost=24445.90..25591.75 rows=41667 width=645) (actual time=73.038..73.069 rows=67 loops=3)
                    ->  Sort  (cost=24445.90..24550.07 rows=41667 width=645) (actual time=73.037..73.056 rows=67 loops=3)
"                          Sort Key: name, id, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure, calories"
                          Sort Method: external merge  Disk: 25848kB
                          Worker 0:  Sort Method: external merge  Disk: 19336kB
                          Worker 1:  Sort Method: external merge  Disk: 20032kB
                          ->  Parallel Seq Scan on recipe  (cost=0.00..9285.67 rows=41667 width=645) (actual time=0.010..9.736 rows=33335 loops=3)
Planning Time: 0.121 ms
Execution Time: 83.458 ms
```
I'm guessing the workers are the threads. It looks like sort on name is taking pretty much the entire time. This means we definitly need an index on `recipe.name` if we are going to be ordering by it (which we do quite often).

**After Adding**: `CREATE INDEX idx_recipe_name ON recipe(name);`

```
Limit  (cost=0.82..5.40 rows=10 width=645) (actual time=0.290..0.310 rows=10 loops=1)
  ->  Unique  (cost=0.82..45844.41 rows=100006 width=645) (actual time=0.288..0.306 rows=10 loops=1)
        ->  Incremental Sort  (cost=0.82..43344.26 rows=100006 width=645) (actual time=0.287..0.289 rows=10 loops=1)
"              Sort Key: name, id, mins_prep, category_id, mins_cook, description, author_id, default_servings, procedure, calories"
              Presorted Key: name
              Full-sort Groups: 1  Sort Method: quicksort  Average Memory: 44kB  Peak Memory: 44kB
              ->  Index Scan using idx_recipe_name on recipe  (cost=0.42..38843.99 rows=100006 width=645) (actual time=0.069..0.169 rows=33 loops=1)
Planning Time: 1.036 ms
Execution Time: 0.359 ms
```

Well shit, that was effective.

2. GET /recipes/{recipe_id}: 0.027595996856689453 seconds
   This endpoint involves 4 sql queries that can't be optimized by adding indexes because they only join on primary keys. Below are the 4 queries. Because these can't be optimized we did one more (sadly the only real optimization came from the name index on recipe again)
  
  Nothing can be done to this
   ```
   SELECT id, name, mins_prep, mins_cook, description, default_servings, author_id, procedure, calories 
                                       FROM recipe 
                                       WHERE id = :id
   ```


   ```
   SELECT i.id, i.name, i.type, i.storage, i.category_id, rix.quantity, rix.unit 
                                                   FROM ingredient i 
                                                   JOIN recipe_ingredients rix on i.id = rix.ingredient_id
                                                   WHERE rix.recipe_id = :id 
                                                   ```

  The explain for this query:
  ```
  Gather  (cost=1000.29..10215.80 rows=9 width=39) (actual time=23.531..24.347 rows=5 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  ->  Nested Loop  (cost=0.29..9214.90 rows=4 width=39) (actual time=10.031..17.548 rows=2 loops=3)
        ->  Parallel Seq Scan on recipe_ingredients rix  (cost=0.00..9181.67 rows=4 width=14) (actual time=10.012..17.515 rows=2 loops=3)
              Filter: (recipe_id = 55)
              Rows Removed by Filter: 266667
        ->  Index Scan using ingredient_pkey on ingredient i  (cost=0.29..8.31 rows=1 width=29) (actual time=0.016..0.016 rows=1 loops=5)
              Index Cond: (id = rix.ingredient_id)
Planning Time: 0.243 ms
Execution Time: 24.370 ms
```

**Adding Index**: `CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id)
`

```
Nested Loop  (cost=4.78..114.23 rows=9 width=39) (actual time=0.058..0.107 rows=5 loops=1)
  ->  Bitmap Heap Scan on recipe_ingredients rix  (cost=4.49..39.46 rows=9 width=14) (actual time=0.046..0.076 rows=5 loops=1)
        Recheck Cond: (recipe_id = 55)
        Heap Blocks: exact=5
        ->  Bitmap Index Scan on idx_recipe_ingredients_recipe_id  (cost=0.00..4.49 rows=9 width=0) (actual time=0.033..0.033 rows=5 loops=1)
              Index Cond: (recipe_id = 55)
  ->  Index Scan using ingredient_pkey on ingredient i  (cost=0.29..8.31 rows=1 width=29) (actual time=0.005..0.005 rows=1 loops=5)
        Index Cond: (id = rix.ingredient_id)
Planning Time: 0.450 ms
Execution Time: 0.132 ms
```

Yep, its fast now


Now for this one 
  ```
  SELECT t.id, t.key, t.value 
                                            FROM recipe_tag t
                                            JOIN recipe_x_tag rxt on t.id = rxt.tag_id
                                            WHERE rxt.recipe_id = :id
```

Explain
```
Gather  (cost=1006.50..4540.79 rows=4 width=16) (actual time=6.381..10.671 rows=1 loops=1)
  Workers Planned: 1
  Workers Launched: 1
  ->  Hash Join  (cost=6.50..3540.39 rows=2 width=16) (actual time=4.741..6.465 rows=0 loops=2)
        Hash Cond: (rxt.tag_id = t.id)
        ->  Parallel Seq Scan on recipe_x_tag rxt  (cost=0.00..3533.88 rows=2 width=4) (actual time=4.722..6.444 rows=0 loops=2)
              Filter: (recipe_id = 55)
              Rows Removed by Filter: 150002
        ->  Hash  (cost=4.00..4.00 rows=200 width=16) (actual time=0.027..0.027 rows=206 loops=1)
              Buckets: 1024  Batches: 1  Memory Usage: 19kB
              ->  Seq Scan on recipe_tag t  (cost=0.00..4.00 rows=200 width=16) (actual time=0.008..0.014 rows=206 loops=1)
Planning Time: 0.550 ms
Execution Time: 10.702 ms
```

**Adding index**: `CREATE INDEX idx_recipe_x_tag_recipe_id ON recipe_x_tag(recipe_id)`

```
Hash Join  (cost=19.89..25.43 rows=4 width=16) (actual time=0.072..0.106 rows=1 loops=1)
  Hash Cond: (t.id = rxt.tag_id)
  ->  Seq Scan on recipe_tag t  (cost=0.00..4.00 rows=200 width=16) (actual time=0.007..0.024 rows=206 loops=1)
  ->  Hash  (cost=19.84..19.84 rows=4 width=4) (actual time=0.054..0.054 rows=1 loops=1)
        Buckets: 1024  Batches: 1  Memory Usage: 9kB
        ->  Bitmap Heap Scan on recipe_x_tag rxt  (cost=4.45..19.84 rows=4 width=4) (actual time=0.051..0.051 rows=1 loops=1)
              Recheck Cond: (recipe_id = 55)
              Heap Blocks: exact=1
              ->  Bitmap Index Scan on idx_recipe_x_tag_recipe_id  (cost=0.00..4.45 rows=4 width=0) (actual time=0.046..0.046 rows=1 loops=1)
                    Index Cond: (recipe_id = 55)
Planning Time: 0.497 ms
Execution Time: 0.134 ms
```

Sheesh thats fast

  ```
  SELECT u.id, u.name
                                            FROM "user" u
                                            JOIN recipe r on u.id = r.author_id
                                            WHERE r.id = :id
  ```

  This one is only doing index scans and is ultra fast so theres nothing really to do

  ```
  Nested Loop  (cost=0.57..16.61 rows=1 width=18) (actual time=0.051..0.052 rows=1 loops=1)
  ->  Index Scan using recipe_pkey on recipe r  (cost=0.29..8.31 rows=1 width=4) (actual time=0.010..0.011 rows=1 loops=1)
        Index Cond: (id = 55)
"  ->  Index Scan using ""“user”_pkey"" on ""user"" u  (cost=0.28..8.30 rows=1 width=18) (actual time=0.037..0.037 rows=1 loops=1)"
        Index Cond: (id = r.author_id)
Planning Time: 0.387 ms
Execution Time: 0.072 ms
```




3. GET /recipes?name=Ability&max_time=50&cursor=0&tag_key=other&tag_value=leg&authored_by=518&use_inventory_of=1&order_by=name (don't have to do this because its number 4)

  **Resulting query**
  ```
  SELECT DISTINCT recipe.id, recipe.name, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.author_id, recipe.default_servings, recipe.procedure, recipe.calories
FROM recipe
LEFT OUTER JOIN recipe_x_tag ON recipe.id = recipe_x_tag.recipe_id
LEFT OUTER JOIN recipe_tag ON recipe_x_tag.tag_id = recipe_tag.id
LEFT OUTER JOIN recipe_ingredients ON recipe_ingredients.recipe_id = recipe.id
WHERE recipe.name ILIKE '%Ability%'
AND recipe.mins_cook + recipe.mins_prep <= 50
AND recipe_tag.key = 'other'
AND recipe_tag.value = 'leg'
AND recipe.author_id = 518
AND NOT (EXISTS (SELECT *
    FROM recipe_ingredients
    WHERE recipe_ingredients.recipe_id = recipe.id
    AND NOT (EXISTS (SELECT *
        FROM user_x_ingredient
        WHERE user_x_ingredient.ingredient_id = recipe_ingredients.ingredient_id
        AND user_x_ingredient.user_id = 5001))))
ORDER BY recipe.name
LIMIT 10 OFFSET 0
```

**Explain Output**

```
Limit  (cost=19441.32..19441.50 rows=1 width=646) (actual time=71.640..72.763 rows=1 loops=1)
  ->  Unique  (cost=19441.32..19441.50 rows=1 width=646) (actual time=71.638..72.762 rows=1 loops=1)
        ->  Gather Merge  (cost=19441.32..19441.48 rows=1 width=646) (actual time=71.638..72.761 rows=1 loops=1)
              Workers Planned: 1
              Workers Launched: 1
              ->  Unique  (cost=18441.31..18441.36 rows=1 width=646) (actual time=68.829..68.833 rows=0 loops=2)
                    ->  Sort  (cost=18441.31..18441.31 rows=2 width=646) (actual time=68.829..68.832 rows=0 loops=2)
"                          Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                          Sort Method: quicksort  Memory: 25kB
                          Worker 0:  Sort Method: quicksort  Memory: 25kB
                          ->  Parallel Hash Right Join  (cost=12698.97..18441.30 rows=2 width=646) (actual time=68.803..68.807 rows=0 loops=2)
                                Hash Cond: (recipe_ingredients.recipe_id = recipe.id)
                                ->  Parallel Seq Scan on recipe_ingredients  (cost=0.00..4859.95 rows=235295 width=4) (actual time=0.005..7.877 rows=200001 loops=2)
                                ->  Parallel Hash  (cost=12698.96..12698.96 rows=1 width=646) (actual time=50.757..50.759 rows=0 loops=2)
                                      Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                      ->  Parallel Hash Right Anti Join  (cost=3967.08..12698.96 rows=1 width=646) (actual time=50.717..50.720 rows=0 loops=2)
                                            Hash Cond: (recipe_ingredients_1.recipe_id = recipe.id)
                                            ->  Hash Anti Join  (cost=6.22..7856.89 rows=234985 width=4) (actual time=0.027..22.678 rows=200001 loops=2)
                                                  Hash Cond: (recipe_ingredients_1.ingredient_id = user_x_ingredient.ingredient_id)
                                                  ->  Parallel Seq Scan on recipe_ingredients recipe_ingredients_1  (cost=0.00..4859.95 rows=235295 width=8) (actual time=0.005..9.192 rows=200001 loops=2)
                                                  ->  Hash  (cost=5.47..5.47 rows=60 width=4) (actual time=0.010..0.011 rows=0 loops=2)
                                                        Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                        ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..5.47 rows=60 width=4) (actual time=0.010..0.010 rows=0 loops=2)
                                                              Index Cond: (user_id = 5001)
                                                              Heap Fetches: 0
                                            ->  Parallel Hash  (cost=3960.84..3960.84 rows=1 width=646) (actual time=18.160..18.161 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                                  ->  Nested Loop  (cost=5.30..3960.84 rows=1 width=646) (actual time=17.491..18.132 rows=0 loops=2)
                                                        ->  Hash Join  (cost=5.01..3570.77 rows=882 width=4) (actual time=0.093..15.213 rows=753 loops=2)
                                                              Hash Cond: (recipe_x_tag.tag_id = recipe_tag.id)
                                                              ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.71 rows=176471 width=8) (actual time=0.028..6.478 rows=150000 loops=2)
                                                              ->  Hash  (cost=5.00..5.00 rows=1 width=4) (actual time=0.044..0.044 rows=1 loops=2)
                                                                    Buckets: 1024  Batches: 1  Memory Usage: 9kB
                                                                    ->  Seq Scan on recipe_tag  (cost=0.00..5.00 rows=1 width=4) (actual time=0.034..0.037 rows=1 loops=2)
                                                                          Filter: ((key = 'other'::text) AND (value = 'leg'::text))
                                                                          Rows Removed by Filter: 199
                                                        ->  Index Scan using recipe_pkey on recipe  (cost=0.29..0.44 rows=1 width=646) (actual time=0.004..0.004 rows=0 loops=1506)
                                                              Index Cond: (id = recipe_x_tag.recipe_id)
                                                              Filter: (((name)::text ~~* '%Ability%'::text) AND (author_id = 518) AND ((mins_cook + mins_prep) <= 50))
                                                              Rows Removed by Filter: 1
Planning Time: 1.851 ms
Execution Time: 72.868 ms


```

I'm seeing a lot of sequential scans which means there are opportunities for index adding. I'm gonna go ahead and add all the indexes from above and add a composite index on key and value of tag. 

These indexes all come from the optimizations we made to other endpoints 
**After Adding**: `CREATE INDEX idx_recipe_name ON recipe(name);`
**After Adding**: `CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);`
**After Adding**: `CREATE INDEX idx_recipe_x_tag_recipe_id ON recipe_x_tag(recipe_id)`

We also tried to add a composite index `CREATE INDEX idx_name_on_recipe_tag ON recipe_tag(key, value); ` but the planner would not use the index we guess because recipe_tag table only has 200 rows. So we removed it.

```
         Limit  (cost=4966.10..5013.27 rows=1 width=645) (actual time=5.882..6.680 rows=0 loops=1)
  ->  Unique  (cost=4966.10..5013.27 rows=1 width=645) (actual time=5.881..6.679 rows=0 loops=1)
        ->  Nested Loop Left Join  (cost=4966.10..5013.09 rows=8 width=645) (actual time=5.881..6.678 rows=0 loops=1)
              ->  Nested Loop Anti Join  (cost=4965.68..5004.42 rows=1 width=645) (actual time=5.880..6.678 rows=0 loops=1)
                    ->  Gather Merge  (cost=4960.76..4960.88 rows=1 width=645) (actual time=5.880..6.677 rows=0 loops=1)
                          Workers Planned: 1
                          Workers Launched: 1
                          ->  Sort  (cost=3960.75..3960.76 rows=1 width=645) (actual time=0.081..0.082 rows=0 loops=2)
"                                Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                                Sort Method: quicksort  Memory: 25kB
                                Worker 0:  Sort Method: quicksort  Memory: 25kB
                                ->  Nested Loop  (cost=5.30..3960.74 rows=1 width=645) (actual time=0.064..0.065 rows=0 loops=2)
                                      ->  Hash Join  (cost=5.01..3570.81 rows=882 width=4) (actual time=0.064..0.065 rows=0 loops=2)
                                            Hash Cond: (recipe_x_tag.tag_id = recipe_tag.id)
                                            ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.74 rows=176474 width=8) (actual time=0.004..0.004 rows=1 loops=2)
                                            ->  Hash  (cost=5.00..5.00 rows=1 width=4) (actual time=0.038..0.038 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                  ->  Seq Scan on recipe_tag  (cost=0.00..5.00 rows=1 width=4) (actual time=0.037..0.037 rows=0 loops=2)
                                                        Filter: ((key = 'other'::text) AND (value = 'leg'::text))
                                                        Rows Removed by Filter: 206
                                      ->  Index Scan using recipe_pkey on recipe  (cost=0.29..0.44 rows=1 width=645) (never executed)
                                            Index Cond: (id = recipe_x_tag.recipe_id)
                                            Filter: (((name)::text ~~* '%Ability%'::text) AND (author_id = 518) AND ((mins_cook + mins_prep) <= 50))
                    ->  Nested Loop Anti Join  (cost=4.92..43.52 rows=9 width=4) (never executed)
                          ->  Bitmap Heap Scan on recipe_ingredients recipe_ingredients_1  (cost=4.49..39.46 rows=9 width=8) (never executed)
                                Recheck Cond: (recipe_id = recipe.id)
                                ->  Bitmap Index Scan on idx_recipe_ingredients_recipe_id  (cost=0.00..4.49 rows=9 width=0) (never executed)
                                      Index Cond: (recipe_id = recipe.id)
                          ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..0.45 rows=1 width=4) (never executed)
                                Index Cond: ((user_id = 5001) AND (ingredient_id = recipe_ingredients_1.ingredient_id))
                                Heap Fetches: 0
              ->  Index Only Scan using idx_recipe_ingredients_recipe_id on recipe_ingredients  (cost=0.42..8.58 rows=9 width=4) (never executed)
                    Index Cond: (recipe_id = recipe.id)
                    Heap Fetches: 0
Planning Time: 1.282 ms
Execution Time: 6.755 ms
                                        
```

