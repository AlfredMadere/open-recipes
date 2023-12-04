## Fake Data Modeling

@mihir

## Performance results of hitting endpoints

For each endpoint, list how many ms it took to execute. State which three endpoints were the slowest. @mihir

## Performance tuning

### Slowest endpoints

1. GET /recipes?name=Ability&max_time=50&cursor=0&tag_key=other&tag_value=leg&authored_by=518&use_inventory_of=1&order_by=name

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

Theres a lot going on here but generally I just look for places where a sequential scan is happening and ask myself if that search condition will happen often and if the table is large enough to justify adding an index to the correlated table.

### Adding Indexes (one at a time)
**Index on Filtered Columns:**
   - **Case:** The query frequently filters on `recipe.name` and `recipe.author_id`. Columns like  and `recipe.mins_cook` are also filtered on in this query but aren't used often enough consider adding indexes to these columns. The query often searches on tag key or tag value so indexing `recipe_tag.key` and `recipe_tag.value` is probably helpful
   - **Syntax for adding name index:** `CREATE INDEX idx_recipe_name ON recipe(name);`
   - **Syntax for adding author_id index:** `CREATE INDEX idx_recipe_author_id ON recipe(author_id);`
   -  **Syntax for adding tag key index:** `CREATE INDEX idx_recipe_tag_key ON recipe_tag(key);`
   -   **Syntax for adding tag value index:** `CREATE INDEX idx_recipe_tag_value ON recipe_tag(value);`



**After Adding**: `CREATE INDEX idx_recipe_name ON recipe(name);`

```
Limit  (cost=19441.32..19441.50 rows=1 width=646) (actual time=68.130..69.417 rows=1 loops=1)
  ->  Unique  (cost=19441.32..19441.50 rows=1 width=646) (actual time=68.128..69.415 rows=1 loops=1)
        ->  Gather Merge  (cost=19441.32..19441.48 rows=1 width=646) (actual time=68.128..69.414 rows=1 loops=1)
              Workers Planned: 1
              Workers Launched: 1
              ->  Unique  (cost=18441.31..18441.36 rows=1 width=646) (actual time=65.592..65.595 rows=0 loops=2)
                    ->  Sort  (cost=18441.31..18441.31 rows=2 width=646) (actual time=65.591..65.594 rows=0 loops=2)
"                          Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                          Sort Method: quicksort  Memory: 25kB
                          Worker 0:  Sort Method: quicksort  Memory: 25kB
                          ->  Parallel Hash Right Join  (cost=12698.97..18441.30 rows=2 width=646) (actual time=65.570..65.574 rows=0 loops=2)
                                Hash Cond: (recipe_ingredients.recipe_id = recipe.id)
                                ->  Parallel Seq Scan on recipe_ingredients  (cost=0.00..4859.95 rows=235295 width=4) (actual time=0.003..8.500 rows=200001 loops=2)
                                ->  Parallel Hash  (cost=12698.96..12698.96 rows=1 width=646) (actual time=45.744..45.747 rows=0 loops=2)
                                      Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                      ->  Parallel Hash Right Anti Join  (cost=3967.08..12698.96 rows=1 width=646) (actual time=45.712..45.715 rows=0 loops=2)
                                            Hash Cond: (recipe_ingredients_1.recipe_id = recipe.id)
                                            ->  Hash Anti Join  (cost=6.22..7856.89 rows=234985 width=4) (actual time=0.033..20.681 rows=200001 loops=2)
                                                  Hash Cond: (recipe_ingredients_1.ingredient_id = user_x_ingredient.ingredient_id)
                                                  ->  Parallel Seq Scan on recipe_ingredients recipe_ingredients_1  (cost=0.00..4859.95 rows=235295 width=8) (actual time=0.008..8.540 rows=200001 loops=2)
                                                  ->  Hash  (cost=5.47..5.47 rows=60 width=4) (actual time=0.011..0.012 rows=0 loops=2)
                                                        Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                        ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..5.47 rows=60 width=4) (actual time=0.011..0.011 rows=0 loops=2)
                                                              Index Cond: (user_id = 5001)
                                                              Heap Fetches: 0
                                            ->  Parallel Hash  (cost=3960.84..3960.84 rows=1 width=646) (actual time=15.940..15.941 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                                  ->  Nested Loop  (cost=5.30..3960.84 rows=1 width=646) (actual time=15.374..15.902 rows=0 loops=2)
                                                        ->  Hash Join  (cost=5.01..3570.77 rows=882 width=4) (actual time=0.262..13.057 rows=753 loops=2)
                                                              Hash Cond: (recipe_x_tag.tag_id = recipe_tag.id)
                                                              ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.71 rows=176471 width=8) (actual time=0.006..5.558 rows=150000 loops=2)
                                                              ->  Hash  (cost=5.00..5.00 rows=1 width=4) (actual time=0.046..0.046 rows=1 loops=2)
                                                                    Buckets: 1024  Batches: 1  Memory Usage: 9kB
                                                                    ->  Seq Scan on recipe_tag  (cost=0.00..5.00 rows=1 width=4) (actual time=0.040..0.043 rows=1 loops=2)
                                                                          Filter: ((key = 'other'::text) AND (value = 'leg'::text))
                                                                          Rows Removed by Filter: 199
                                                        ->  Index Scan using recipe_pkey on recipe  (cost=0.29..0.44 rows=1 width=646) (actual time=0.004..0.004 rows=0 loops=1506)
                                                              Index Cond: (id = recipe_x_tag.recipe_id)
                                                              Filter: (((name)::text ~~* '%Ability%'::text) AND (author_id = 518) AND ((mins_cook + mins_prep) <= 50))
                                                              Rows Removed by Filter: 1
Planning Time: 2.451 ms
Execution Time: 69.690 ms
```

**After Adding:** `CREATE INDEX idx_recipe_author_id ON recipe(author_id);`
- NOTE: it did not decide to use the index so i removed it on subsequent runs

```Limit  (cost=19118.80..19118.99 rows=1 width=646) (actual time=70.872..71.879 rows=1 loops=1)
  ->  Unique  (cost=19118.80..19118.99 rows=1 width=646) (actual time=70.871..71.878 rows=1 loops=1)
        ->  Gather Merge  (cost=19118.80..19118.97 rows=1 width=646) (actual time=70.871..71.877 rows=1 loops=1)
              Workers Planned: 1
              Workers Launched: 1
              ->  Unique  (cost=18118.79..18118.84 rows=1 width=646) (actual time=68.062..68.065 rows=0 loops=2)
                    ->  Sort  (cost=18118.79..18118.80 rows=2 width=646) (actual time=68.062..68.065 rows=0 loops=2)
"                          Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                          Sort Method: quicksort  Memory: 25kB
                          Worker 0:  Sort Method: quicksort  Memory: 25kB
                          ->  Parallel Hash Right Join  (cost=12376.45..18118.78 rows=2 width=646) (actual time=68.034..68.038 rows=0 loops=2)
                                Hash Cond: (recipe_ingredients.recipe_id = recipe.id)
                                ->  Parallel Seq Scan on recipe_ingredients  (cost=0.00..4859.95 rows=235295 width=4) (actual time=0.004..8.196 rows=200001 loops=2)
                                ->  Parallel Hash  (cost=12376.44..12376.44 rows=1 width=646) (actual time=49.212..49.215 rows=0 loops=2)
                                      Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                      ->  Parallel Hash Right Anti Join  (cost=3644.57..12376.44 rows=1 width=646) (actual time=49.180..49.183 rows=0 loops=2)
                                            Hash Cond: (recipe_ingredients_1.recipe_id = recipe.id)
                                            ->  Hash Anti Join  (cost=6.22..7856.89 rows=234985 width=4) (actual time=0.027..23.092 rows=200001 loops=2)
                                                  Hash Cond: (recipe_ingredients_1.ingredient_id = user_x_ingredient.ingredient_id)
                                                  ->  Parallel Seq Scan on recipe_ingredients recipe_ingredients_1  (cost=0.00..4859.95 rows=235295 width=8) (actual time=0.006..9.447 rows=200001 loops=2)
                                                  ->  Hash  (cost=5.47..5.47 rows=60 width=4) (actual time=0.011..0.011 rows=0 loops=2)
                                                        Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                        ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..5.47 rows=60 width=4) (actual time=0.011..0.011 rows=0 loops=2)
                                                              Index Cond: (user_id = 5001)
                                                              Heap Fetches: 0
                                            ->  Parallel Hash  (cost=3638.33..3638.33 rows=1 width=646) (actual time=16.025..16.026 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                                  ->  Nested Loop  (cost=82.15..3638.33 rows=1 width=646) (actual time=15.474..16.003 rows=0 loops=2)
                                                        ->  Hash Join  (cost=82.01..3637.97 rows=2 width=650) (actual time=15.456..15.985 rows=0 loops=2)
                                                              Hash Cond: (recipe_x_tag.recipe_id = recipe.id)
                                                              ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.71 rows=176471 width=8) (actual time=0.006..6.553 rows=150000 loops=2)
                                                              ->  Hash  (cost=82.00..82.00 rows=1 width=646) (actual time=0.106..0.106 rows=1 loops=2)
                                                                    Buckets: 1024  Batches: 1  Memory Usage: 9kB
                                                                    ->  Bitmap Heap Scan on recipe  (cost=4.44..82.00 rows=1 width=646) (actual time=0.066..0.102 rows=1 loops=2)
                                                                          Recheck Cond: (author_id = 518)
                                                                          Filter: (((name)::text ~~* '%Ability%'::text) AND ((mins_cook + mins_prep) <= 50))
                                                                          Rows Removed by Filter: 21
                                                                          Heap Blocks: exact=22
                                                                          ->  Bitmap Index Scan on idx_recipe_author_id  (cost=0.00..4.44 rows=20 width=0) (actual time=0.018..0.018 rows=22 loops=2)
                                                                                Index Cond: (author_id = 518)
                                                        ->  Index Scan using recipe_tag_pk on recipe_tag  (cost=0.14..0.17 rows=1 width=4) (actual time=0.031..0.031 rows=1 loops=1)
                                                              Index Cond: (id = recipe_x_tag.tag_id)
                                                              Filter: ((key = 'other'::text) AND (value = 'leg'::text))
Planning Time: 1.283 ms
Execution Time: 71.958 ms
```

**Adding Index:**  `CREATE INDEX idx_recipe_tag_key ON recipe_tag(key);`
- NOTE: The query actually took longer to execute with this index so i removed it for subsequent tests

```
Limit  (cost=19441.32..19441.50 rows=1 width=646) (actual time=75.317..76.547 rows=1 loops=1)
  ->  Unique  (cost=19441.32..19441.50 rows=1 width=646) (actual time=75.315..76.545 rows=1 loops=1)
        ->  Gather Merge  (cost=19441.32..19441.48 rows=1 width=646) (actual time=75.315..76.545 rows=1 loops=1)
              Workers Planned: 1
              Workers Launched: 1
              ->  Unique  (cost=18441.31..18441.36 rows=1 width=646) (actual time=72.678..72.681 rows=0 loops=2)
                    ->  Sort  (cost=18441.31..18441.31 rows=2 width=646) (actual time=72.678..72.680 rows=0 loops=2)
"                          Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                          Sort Method: quicksort  Memory: 25kB
                          Worker 0:  Sort Method: quicksort  Memory: 25kB
                          ->  Parallel Hash Right Join  (cost=12698.97..18441.30 rows=2 width=646) (actual time=72.649..72.653 rows=0 loops=2)
                                Hash Cond: (recipe_ingredients.recipe_id = recipe.id)
                                ->  Parallel Seq Scan on recipe_ingredients  (cost=0.00..4859.95 rows=235295 width=4) (actual time=0.003..8.202 rows=200001 loops=2)
                                ->  Parallel Hash  (cost=12698.96..12698.96 rows=1 width=646) (actual time=53.681..53.683 rows=0 loops=2)
                                      Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                      ->  Parallel Hash Right Anti Join  (cost=3967.08..12698.96 rows=1 width=646) (actual time=53.643..53.646 rows=0 loops=2)
                                            Hash Cond: (recipe_ingredients_1.recipe_id = recipe.id)
                                            ->  Hash Anti Join  (cost=6.22..7856.89 rows=234985 width=4) (actual time=0.027..24.262 rows=200001 loops=2)
                                                  Hash Cond: (recipe_ingredients_1.ingredient_id = user_x_ingredient.ingredient_id)
                                                  ->  Parallel Seq Scan on recipe_ingredients recipe_ingredients_1  (cost=0.00..4859.95 rows=235295 width=8) (actual time=0.005..9.767 rows=200001 loops=2)
                                                  ->  Hash  (cost=5.47..5.47 rows=60 width=4) (actual time=0.010..0.011 rows=0 loops=2)
                                                        Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                        ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..5.47 rows=60 width=4) (actual time=0.010..0.010 rows=0 loops=2)
                                                              Index Cond: (user_id = 5001)
                                                              Heap Fetches: 0
                                            ->  Parallel Hash  (cost=3960.84..3960.84 rows=1 width=646) (actual time=18.595..18.596 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                                  ->  Nested Loop  (cost=5.30..3960.84 rows=1 width=646) (actual time=17.903..18.572 rows=0 loops=2)
                                                        ->  Hash Join  (cost=5.01..3570.77 rows=882 width=4) (actual time=0.103..15.769 rows=753 loops=2)
                                                              Hash Cond: (recipe_x_tag.tag_id = recipe_tag.id)
                                                              ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.71 rows=176471 width=8) (actual time=0.006..6.752 rows=150000 loops=2)
                                                              ->  Hash  (cost=5.00..5.00 rows=1 width=4) (actual time=0.066..0.066 rows=1 loops=2)
                                                                    Buckets: 1024  Batches: 1  Memory Usage: 9kB
                                                                    ->  Seq Scan on recipe_tag  (cost=0.00..5.00 rows=1 width=4) (actual time=0.052..0.055 rows=1 loops=2)
                                                                          Filter: ((key = 'other'::text) AND (value = 'leg'::text))
                                                                          Rows Removed by Filter: 199
                                                        ->  Index Scan using recipe_pkey on recipe  (cost=0.29..0.44 rows=1 width=646) (actual time=0.004..0.004 rows=0 loops=1506)
                                                              Index Cond: (id = recipe_x_tag.recipe_id)
                                                              Filter: (((name)::text ~~* '%Ability%'::text) AND (author_id = 518) AND ((mins_cook + mins_prep) <= 50))
                                                              Rows Removed by Filter: 1
Planning Time: 1.665 ms
Execution Time: 76.721 ms
```

**Adding index** `CREATE INDEX idx_recipe_tag_value ON recipe_tag(value);`
- NOTE: for some reason the optimizer still decided not to use the index so i removed it again
```
Limit  (cost=19441.32..19441.50 rows=1 width=646) (actual time=67.647..68.848 rows=1 loops=1)
  ->  Unique  (cost=19441.32..19441.50 rows=1 width=646) (actual time=67.646..68.846 rows=1 loops=1)
        ->  Gather Merge  (cost=19441.32..19441.48 rows=1 width=646) (actual time=67.645..68.845 rows=1 loops=1)
              Workers Planned: 1
              Workers Launched: 1
              ->  Unique  (cost=18441.31..18441.36 rows=1 width=646) (actual time=64.749..64.753 rows=0 loops=2)
                    ->  Sort  (cost=18441.31..18441.31 rows=2 width=646) (actual time=64.749..64.752 rows=0 loops=2)
"                          Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                          Sort Method: quicksort  Memory: 25kB
                          Worker 0:  Sort Method: quicksort  Memory: 25kB
                          ->  Parallel Hash Right Join  (cost=12698.97..18441.30 rows=2 width=646) (actual time=64.722..64.726 rows=0 loops=2)
                                Hash Cond: (recipe_ingredients.recipe_id = recipe.id)
                                ->  Parallel Seq Scan on recipe_ingredients  (cost=0.00..4859.95 rows=235295 width=4) (actual time=0.005..8.266 rows=200001 loops=2)
                                ->  Parallel Hash  (cost=12698.96..12698.96 rows=1 width=646) (actual time=45.984..45.987 rows=0 loops=2)
                                      Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                      ->  Parallel Hash Right Anti Join  (cost=3967.08..12698.96 rows=1 width=646) (actual time=45.941..45.944 rows=0 loops=2)
                                            Hash Cond: (recipe_ingredients_1.recipe_id = recipe.id)
                                            ->  Hash Anti Join  (cost=6.22..7856.89 rows=234985 width=4) (actual time=0.034..21.487 rows=200001 loops=2)
                                                  Hash Cond: (recipe_ingredients_1.ingredient_id = user_x_ingredient.ingredient_id)
                                                  ->  Parallel Seq Scan on recipe_ingredients recipe_ingredients_1  (cost=0.00..4859.95 rows=235295 width=8) (actual time=0.005..8.964 rows=200001 loops=2)
                                                  ->  Hash  (cost=5.47..5.47 rows=60 width=4) (actual time=0.020..0.020 rows=0 loops=2)
                                                        Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                        ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..5.47 rows=60 width=4) (actual time=0.017..0.017 rows=0 loops=2)
                                                              Index Cond: (user_id = 5001)
                                                              Heap Fetches: 0
                                            ->  Parallel Hash  (cost=3960.84..3960.84 rows=1 width=646) (actual time=15.351..15.352 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                                  ->  Nested Loop  (cost=5.30..3960.84 rows=1 width=646) (actual time=14.707..15.325 rows=0 loops=2)
                                                        ->  Hash Join  (cost=5.01..3570.77 rows=882 width=4) (actual time=0.093..12.403 rows=753 loops=2)
                                                              Hash Cond: (recipe_x_tag.tag_id = recipe_tag.id)
                                                              ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.71 rows=176471 width=8) (actual time=0.006..5.402 rows=150000 loops=2)
                                                              ->  Hash  (cost=5.00..5.00 rows=1 width=4) (actual time=0.055..0.055 rows=1 loops=2)
                                                                    Buckets: 1024  Batches: 1  Memory Usage: 9kB
                                                                    ->  Seq Scan on recipe_tag  (cost=0.00..5.00 rows=1 width=4) (actual time=0.049..0.052 rows=1 loops=2)
                                                                          Filter: ((key = 'other'::text) AND (value = 'leg'::text))
                                                                          Rows Removed by Filter: 199
                                                        ->  Index Scan using recipe_pkey on recipe  (cost=0.29..0.44 rows=1 width=646) (actual time=0.004..0.004 rows=0 loops=1506)
                                                              Index Cond: (id = recipe_x_tag.recipe_id)
                                                              Filter: (((name)::text ~~* '%Ability%'::text) AND (author_id = 518) AND ((mins_cook + mins_prep) <= 50))
                                                              Rows Removed by Filter: 1
Planning Time: 1.128 ms
Execution Time: 68.951 ms
```

At this point i realized that the reason these indexes weren't being used is because i am filtering by both key and value so i would need a composite index. It is quite common to filter by a key and a value together for example 

```
{
  key: "allergy",
  value: "gluten" 
}
```

So... I am adding a composite index

**Adding index** `CREATE INDEX idx_name_on_recipe_tag ON recipe_tag(key, value);`
 
 ```
 Limit  (cost=19441.32..19441.50 rows=1 width=646) (actual time=61.193..62.317 rows=1 loops=1)
  ->  Unique  (cost=19441.32..19441.50 rows=1 width=646) (actual time=61.191..62.316 rows=1 loops=1)
        ->  Gather Merge  (cost=19441.32..19441.48 rows=1 width=646) (actual time=61.191..62.315 rows=1 loops=1)
              Workers Planned: 1
              Workers Launched: 1
              ->  Unique  (cost=18441.31..18441.36 rows=1 width=646) (actual time=58.680..58.684 rows=0 loops=2)
                    ->  Sort  (cost=18441.31..18441.31 rows=2 width=646) (actual time=58.679..58.683 rows=0 loops=2)
"                          Sort Key: recipe.name, recipe.id, recipe.mins_prep, recipe.category_id, recipe.mins_cook, recipe.description, recipe.default_servings, recipe.procedure, recipe.calories"
                          Sort Method: quicksort  Memory: 25kB
                          Worker 0:  Sort Method: quicksort  Memory: 25kB
                          ->  Parallel Hash Right Join  (cost=12698.97..18441.30 rows=2 width=646) (actual time=58.656..58.660 rows=0 loops=2)
                                Hash Cond: (recipe_ingredients.recipe_id = recipe.id)
                                ->  Parallel Seq Scan on recipe_ingredients  (cost=0.00..4859.95 rows=235295 width=4) (actual time=0.004..7.725 rows=200001 loops=2)
                                ->  Parallel Hash  (cost=12698.96..12698.96 rows=1 width=646) (actual time=40.901..40.904 rows=0 loops=2)
                                      Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                      ->  Parallel Hash Right Anti Join  (cost=3967.08..12698.96 rows=1 width=646) (actual time=40.863..40.866 rows=0 loops=2)
                                            Hash Cond: (recipe_ingredients_1.recipe_id = recipe.id)
                                            ->  Hash Anti Join  (cost=6.22..7856.89 rows=234985 width=4) (actual time=0.025..18.923 rows=200001 loops=2)
                                                  Hash Cond: (recipe_ingredients_1.ingredient_id = user_x_ingredient.ingredient_id)
                                                  ->  Parallel Seq Scan on recipe_ingredients recipe_ingredients_1  (cost=0.00..4859.95 rows=235295 width=8) (actual time=0.004..7.887 rows=200001 loops=2)
                                                  ->  Hash  (cost=5.47..5.47 rows=60 width=4) (actual time=0.009..0.010 rows=0 loops=2)
                                                        Buckets: 1024  Batches: 1  Memory Usage: 8kB
                                                        ->  Index Only Scan using user_x_ingredient_pk on user_x_ingredient  (cost=0.42..5.47 rows=60 width=4) (actual time=0.009..0.009 rows=0 loops=2)
                                                              Index Cond: (user_id = 5001)
                                                              Heap Fetches: 0
                                            ->  Parallel Hash  (cost=3960.84..3960.84 rows=1 width=646) (actual time=13.692..13.693 rows=0 loops=2)
                                                  Buckets: 1024  Batches: 1  Memory Usage: 40kB
                                                  ->  Nested Loop  (cost=5.30..3960.84 rows=1 width=646) (actual time=13.185..13.680 rows=0 loops=2)
                                                        ->  Hash Join  (cost=5.01..3570.77 rows=882 width=4) (actual time=0.056..11.387 rows=753 loops=2)
                                                              Hash Cond: (recipe_x_tag.tag_id = recipe_tag.id)
                                                              ->  Parallel Seq Scan on recipe_x_tag  (cost=0.00..3092.71 rows=176471 width=8) (actual time=0.005..4.841 rows=150000 loops=2)
                                                              ->  Hash  (cost=5.00..5.00 rows=1 width=4) (actual time=0.033..0.033 rows=1 loops=2)
                                                                    Buckets: 1024  Batches: 1  Memory Usage: 9kB
                                                                    ->  Seq Scan on recipe_tag  (cost=0.00..5.00 rows=1 width=4) (actual time=0.027..0.030 rows=1 loops=2)
                                                                          Filter: ((key = 'other'::text) AND (value = 'leg'::text))
                                                                          Rows Removed by Filter: 199
                                                        ->  Index Scan using recipe_pkey on recipe  (cost=0.29..0.44 rows=1 width=646) (actual time=0.003..0.003 rows=0 loops=1506)
                                                              Index Cond: (id = recipe_x_tag.recipe_id)
                                                              Filter: (((name)::text ~~* '%Ability%'::text) AND (author_id = 518) AND ((mins_cook + mins_prep) <= 50))
                                                              Rows Removed by Filter: 1
Planning Time: 1.168 ms
Execution Time: 62.437 ms
```

**Conclusion for /recipes search endpoint:** The `recipe.name` index was the only one that the optimizer actually found useful. All the others were never used so I removed them


2. Next endpoint

3. Next endpoint