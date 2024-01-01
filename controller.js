require("dotenv").config()
const {CONNECTION_STRING} = process.env
const Sequelize = require("sequelize")
const {seed} = require("./seed.js")

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = {
    getRecipes: (req, res) => {
        sequelize.query(`select * from recipes;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    fridgeIng: (req, res) => {
        sequelize.query(`select * from ingredients
        where isFridge = true
        order by name;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    pantryIng: (req, res) => {
        sequelize.query(`select * from ingredients
        where isFridge = false
        order by name;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }, 

    addRecipe: (req, res) => {
        const { id } = req.params
        sequelize.query(`select * from recipes where recipe_id = ${id};`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    removeSelectedRecipe: (req, res) => {
        const { id } = req.params
        sequelize.query(`select * from recipes where recipe_id = ${id};`)
            .then(dbres => res.status(200).send(dbres[0]))
            .catch(err => console.log(err))
    },

    createGroceryList: (req, res) => {
        const { selectedRecipeIds } = req.query
        const recipeIds = selectedRecipeIds.split(',').map(id => parseInt(id, 10))
        sequelize.query(`select i.name as ingredient_name
        from recipes r
        join recipe_ing ri on r.recipe_id = ri.recipe_id
        join ingredients i on ri.ingredient_id = i.ingredient_id
        where r.recipe_id in (:recipeIds);
        `, {
            replacements: { recipeIds },
            type: Sequelize.QueryTypes.SELECT
        })
        .then(dbRes => res.status(200).send(dbRes))
        .catch(err => console.log(err))
    }
}
