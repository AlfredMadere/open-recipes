# API Specification

> **Instructions:** Fill out the rest of this api spec. We need to completley define at least 8 endpoints. We also need to define 

## 1. User - `/user/` 

Represents application users

### `/user/{user_id}` (GET)

**Returns**:

```json
[
    {
        "id": "number", 
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "number"
    }
]
```

### `/user/` (POST)

**Request**

```json
[
    {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "number"
    }
]
```

**Returns**


```json
[
    {
        "id": "number", 
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "number"
    }
]
```

## 2. RecipeList - `/recipe_list/` 

### `/recipe_list/{list_id}` (GET)

**Response**

```json
[
    {
        "id": "number",
        "name": "string",
    }
]
```

### `/recipe_list/` (POST)

**Request**

```json
[
    {
        "name": "string",
    }
]
```

**Response**

```json
[
    {
        "id": "number",
        "name": "string",
    }
]
```

## 3. Recipet - `/recipe/` 

### `/recipe/{recipe_id}` (GET)

**Response**

```json
[
    {
        "id": "number",
        "name": "string",
        "description": "string",
        "procedure": "string",
        "author_id": "number",

    }
]
```

### `/recipe/` (POST)

**Request**

```json
[
    {
        "name": "string",
        "description": "string",
        "procedure": "string",
        "author_id": "number",
    }
]
```

**Response**

```json
[
    {
        "id": "number",
        "name": "string",
        "description": "string",
        "procedure": "string",
        "author_id": "number",
    }
]
```

## 3. Ingredient - `/ingredient/`

### `/ingredient/{ingredient_id}/` (GET)

**Response**

```json
[
    {
        "id": "number",
        "name": "string",
        "description": "string",
        "ingredient_category_id": "string"
    }
]
```

### `/ingredient/` (POST)

**Request**

```json
[
    {
        "name": "string",
        "description": "string",
        "ingredient_category_id": "string"
    }
]
```

**Response**

```json
[
    {
        "id": "number",
        "name": "string",
        "description": "string",
        "ingredient_category_id": "string"
    }
]
```

## **3. Recipe** - `/recipe/`

### `/recipe/{recipe_id}` (GET)
**Response**:
```json
{
    "id": "number",
    "name": "string",
    "description": "string",
    "procedure": "string",
    "author_id": "number"
}
```

### `/recipe/` (POST)
**Request**:
```json
{
    "name": "string",
    "description": "string",
    "procedure": "string",
    "author_id": "number"
}
```
**Response**:
```json
{
    "id": "number",
    "name": "string",
    "description": "string",
    "procedure": "string",
    "author_id": "number"
}
```

---

## **4. Ingredient** - `/ingredient/`

### `/ingredient/{ingredient_id}/` (GET)
**Response**:
```json
{
    "id": "number",
    "name": "string",
    "description": "string",
    "ingredient_category_id": "string"
}
```

### `/ingredient/` (POST)
**Request**:
```json
{
    "name": "string",
    "description": "string",
    "ingredient_category_id": "string"
}
```
**Response**:
```json
{
    "id": "number",
    "name": "string",
    "description": "string",
    "ingredient_category_id": "string"
}
```

---

## **5. Appliance** - `/appliance/`

### `/appliance/{appliance_id}/` (GET)
**Response**:
```json
{
    "id": "number",
    "name": "string",
    "description": "string"
}
```

### `/appliance/` (POST)
**Request**:
```json
{
    "name": "string",
    "description": "string"
}
```
**Response**:
```json
{
    "id": "number",
    "name": "string",
    "description": "string"
}
```

---

## **6. RecipeRating** - `/recipe/{recipe_id}/ratings/`

### `/recipe/{recipe_id}/ratings/` (GET)
**Response**:
```json
{
    "rating_id": "number",
    "user_id": "number",
    "rating": "number",
    "comment": "string",
    "timestamp": "datetime"
}
```

### `/recipe/{recipe_id}/ratings/` (POST)
**Request**:
```json
{
    "user_id": "number",
    "rating": "number",
    "comment": "string"
}
```
**Response**:
```json
{
    "rating_id": "number",
    "user_id": "number",
    "rating": "number",
    "comment": "string",
    "timestamp": "datetime"
}
```

---

## **7. RecipeIngredient** - `/recipe/{recipe_id}/ingredient/`

### `/recipe/{recipe_id}/ingredient/` (GET)
**Response**:
```json
{
    "ingredient_id": "number",
    "name": "string",
    "quantity": "string"
}
```

### `/recipe/{recipe_id}/ingredient/` (POST)
**Request**:
```json
{
    "ingredient_id": "number",
    "quantity": "string"
}
```
**Response**:
```json
{
    "ingredient_id": "number",
    "name": "string",
    "quantity": "string"
}
```


