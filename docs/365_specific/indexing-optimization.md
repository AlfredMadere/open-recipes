Search endpoint

http://localhost:3000/recipes?cursor=0&order_by=name - no index 
Time: 0.086010 seconds
http://localhost:3000/recipes?cursor=0&order_by=name - name index
Time: 0.009659 seconds

http://localhost:3000/recipes?name=str&cursor=0&order_by=name - name index
Time: 0.005453 seconds

http://localhost:3000/recipes?cursor=0&tag_key=skin&order_by=name - name index
Time: 0.005710 seconds
NOTE: adding an index to tag key slowed the query down to 0.009133 seconds

http://localhost:3000/recipes?cursor=0&use_inventory_of=1&order_by=name
Time: 0.176037 seconds

http://localhost:3000/recipes?cursor=0&use_inventory_of=1&order_by=name - name index and recipe_ingredients.recipe id
Time: Time: 0.028439 seconds
