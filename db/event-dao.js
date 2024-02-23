import 'setimmediate';
import * as SQLite from 'expo-sqlite';
import dayjs from "dayjs";

const openDatabase = () => {
  
    return SQLite.openDatabase("recipy.db");
}

const db = openDatabase();

/**
 * Initialize Recipy database.
 */
export const databaseInit = async () => {
    await createRecipesTable();
    await createIngredientsTable();
}

export const insertEvent = async (event) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO Event (description, date, notification)
                VALUES (?, ?, ?);`,
                [recipe.name, recipe.description, dayjs().format("YYYY-MM-DD")],
                (tx, res) => resolve(),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Get all recipes in the local database.
 * @returns An array containing all recipes, sorted by id.
 */
export const getAllRecipes = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM recipes;`,
                [],
                (tx, res) => resolve(res.rows._array.map(dbRecipe => {
                    return {
                        id: dbRecipe.ID,
                        name: dbRecipe.NAME,
                        description: dbRecipe.DESCRIPTION,
                        createdOn: dbRecipe.CREATED_ON,
                        lastEditOn: dbRecipe.LAST_EDIT_ON,
                        viewCount: dbRecipe.VIEW_COUNT
                    };
                })),
                (tx, err) => reject(err.message)
            );
        });
    });
}

export const getIngredientsByRecipeId = (recipeId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT *
                FROM INGREDIENTS
                WHERE ID_RECIPE = ?;`,
                [recipeId],
                (tx, res) => resolve(res.rows._array.map(dbIngredient => {
                    return {
                        id: dbIngredient.ID,
                        name: dbIngredient.NAME,
                        quantity: dbIngredient.QUANTITY,
                        unit: dbIngredient.UNIT,
                        idRecipe: dbIngredient.ID_RECIPE
                    };
                })),
                (tx, err) => reject(err.message)
            );
        });
    });
}

/**
 * Insert a new recipe into the local database
 * @param {*} recipe A recipe with 'name' and 'description'
 */
export const insertRecipe = (recipe) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO RECIPES (NAME, DESCRIPTION, CREATED_ON)
                VALUES (?, ?, ?);`,
                [recipe.name, recipe.description, dayjs().format("YYYY-MM-DD")],
                (tx, res) => resolve(),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Update an existing recipe's name/description
 * @param {*} recipe 
 * @returns 
 */
export const updateRecipe = (recipe) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE RECIPES
                SET NAME = ?,
                DESCRIPTION = ?,
                LAST_EDIT_ON = ?
                WHERE ID = ?;`,
                [recipe.name, recipe.description, dayjs().format("YYYY-MM-DD"), recipe.id],
                (tx, res) => resolve(),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Increments the view count for the recipe
 * with the specified id by 1.
 * @param {*} recipeId 
 * @returns 
 */
export const incrementRecipeViewCount = (recipeId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE RECIPES
                SET VIEW_COUNT = VIEW_COUNT + 1
                WHERE ID = ?;`,
                [recipeId],
                (tx, res) => resolve(),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Delete the recipe with the specified id, along
 * with its associated ingredients.
 * @param {*} id Recipe id
 * @returns 
 */
export const deleteRecipeById = async (id) => {
    await deleteIngredientsByRecipeId(id);
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM RECIPES
                WHERE ID = ?;`,
                [id],
                (tx, res) => {
                    console.log(res);
                    resolve();
                },
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Delete all ingredients associated to the recipe
 * with the specified id.
 * @param {*} recipeId Recipe id
 * @returns 
 */
export const deleteIngredientsByRecipeId = (recipeId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM INGREDIENTS
                WHERE ID_RECIPE = ?;`,
                [recipeId],
                (tx, res) => {
                    console.log(res);
                    resolve();
                },
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Get the id of the latest inserted recipe
 */
export const getLastRecipeId = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT SEQ
                FROM SQLITE_SEQUENCE
                WHERE NAME = 'RECIPES';`,
                [],
                (tx, res) => {
                    id = res.rows._array;
                    if (id.length === 0) {
                        reject("Unit not found");
                    }
                    resolve(id[0].seq);
                },
                (tx, err) => reject(err)
            );
        });
    });
}

export const insertIngredient = (ingredient) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO INGREDIENTS (NAME, QUANTITY, UNIT, ID_RECIPE)
                VALUES(?, ?, ?, ?)`,
                [ingredient.name, ingredient.quantity, ingredient.unit, ingredient.idRecipe],
                (tx, res) => resolve(),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Inserts an array of ingredients into the local database
 * @param {*} ingredients 
 */
export const insertIngredients = (ingredients) => {
    return new Promise((resolve, reject) => {
        // If no ingredients provided, return immediately
        if (ingredients.length === 0) {
            resolve();
        }
        // Construct params array and query string
        const params = [];
        let query = "INSERT INTO INGREDIENTS (NAME, QUANTITY, UNIT, ID_RECIPE) VALUES ";
        for (const ingredient of ingredients) {
            params.push(ingredient.name, ingredient.quantity, ingredient.unit, ingredient.idRecipe);
            query += "(?, ?, ?, ?), ";
        }
        query = query.substring(0, query.length - 2) + ";";
        // Execute query
        db.transaction((tx) => {
            tx.executeSql(
                query,
                params,
                (tx, res) => resolve(),
                (tx, err) => reject(err)
            );
        });
    });
}