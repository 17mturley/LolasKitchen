require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {seed} = require('./seed.js')
const {getRecipes, fridgeIng, pantryIng, addRecipe, removeSelectedRecipe, createGroceryList} = require('./controller.js')

app.use(express.json())
app.use(cors())

app.post('/seed', seed)

app.get('/creategrocerylist', createGroceryList)
app.get('/recipes', getRecipes)
app.get('/fridge', fridgeIng)
app.get('/pantry', pantryIng)
app.post(`/recipes/:id`, addRecipe)
app.post(`/recipes/:id`, removeSelectedRecipe)


app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))