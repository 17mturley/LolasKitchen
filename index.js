const fridgeSelect = document.querySelector('#fridge-select')
const pantrySelect = document.querySelector('#pantry-select')
const ingredientName = document.querySelector('#ingredient-select')
const recipesSct = document.querySelector('#recipes')
const myRecipes = document.querySelector('#my-recipes')
const selectedPantry = document.querySelector('#selected-pantry-ingredients')
const selectedFridge = document.querySelector('#selected-fridge-ingredients')
const selectedRecipesSection = document.getElementById('selected-recipes')
const groceryList = document.querySelector('#grocery-list')
const groceryListButton = document.querySelector('#grocery-list-button')

let selectedRecipes = [];



function getRecipes() {
    recipesSct.innerHTML = ''
    axios.get('http://localhost:5432/recipes/')
        .then(res => {
            res.data.forEach(elem => {
                let recipeCard = `<div class="recipe-card" id="recipe-${elem.recipe_id}">
                    <h2>${elem.name}</h2>
                    <button onclick="viewRecipe(${elem.recipe_id})">View</button>
                    <button onclick="addRecipe(${elem.recipe_id})">Add Recipe</button>
                    </div>`
                recipesSct.innerHTML += recipeCard
            })
        })
}


function addRecipe(id) {
    axios.post(`http://localhost:5432/recipes/${id}`, { id })
    .then(res => {
        const recipeData = res.data[0]
        const selectedRecipeElement = document.createElement('div');
        selectedRecipeElement.innerHTML = `<div id="my-recipes-content">
        <h2>${recipeData.name}<h2>
        <button id="view-button">View</button>
        </div>`;
        selectedRecipesSection.appendChild(selectedRecipeElement);
        selectedRecipes.push(id);
        const recipeCard = document.getElementById(`recipe-${id}`);
        if (recipeCard) {
            recipeCard.remove();
        }
    })
    .catch(error => {
        console.log('Error adding recipe:', error);
    });
}


function removeSelectedRecipe(id) {
    const lastSelectedRecipeId = selectedRecipes.pop();
    axios.post(`http://localhost:5432/recipes/${id}`, { id: lastSelectedRecipeId })
        .then(res => {
            const recipeCard = document.createElement('div');
            recipeCard.textContent = `${res.data.name} Instructions: ${res.data.instrustions}`;
            recipesSct.appendChild(recipeCard);
            const selectedRecipeElement = document.getElementById(`selected-recipes-${lastSelectedRecipeId}`);
            if (selectedRecipeElement) {
                selectedRecipeElement.remove();
            }
        })
        .catch(error => {
            console.log('Error removing recipe:', error);
        });
}

function fridgeIng() {
    axios.get('http://localhost:5432/fridge/')
        .then(res => {
            res.data.forEach(ingredient => {
               const option = document.createElement('option')
               option.setAttribute('value', ingredient['ingredient_id'])
               option.textContent = ingredient.name
               fridgeSelect.appendChild(option) 
            });
            fridgeSelect.addEventListener('change', function () {
                const selectedIngredientId = this.value;
                const selectedIngredientName = this.options[this.selectedIndex].text;
                postFridgeIngredient(selectedIngredientId, selectedIngredientName);
            })

        })
}

function postFridgeIngredient(ingredientId, ingredientName) {
    const ingredientElement = document.createElement('div');
    ingredientElement.textContent = `${ingredientName}`;
    ingredientElement.setAttribute('data-ingredient-id', ingredientId);
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', function () {
        removeSelectedIngredient(ingredientId, ingredientElement);
    })
    ingredientElement.appendChild(removeButton);
    selectedFridge.appendChild(ingredientElement);
}

function pantryIng() {
    axios.get('http://localhost:5432/pantry/')
        .then(res => {
            res.data.forEach(ingredient => {
                const option = document.createElement('option')
                option.setAttribute('value', ingredient['ingredient_id'])
                option.textContent = ingredient.name
                pantrySelect.appendChild(option) 
             });
            pantrySelect.addEventListener('change', function () {
                const selectedIngredientId = this.value;
                const selectedIngredientName = this.options[this.selectedIndex].text;
                postPantryIngredient(selectedIngredientId, selectedIngredientName);
            });   
        });
}

function postPantryIngredient(ingredientId, ingredientName) {
                const ingredientElement = document.createElement('div');
                ingredientElement.textContent = `${ingredientName}`;
                ingredientElement.setAttribute('data-ingredient-id', ingredientId);
                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.addEventListener('click', function () {
                    removeSelectedIngredient(ingredientId, ingredientElement);
                })
                ingredientElement.appendChild(removeButton);
                selectedPantry.appendChild(ingredientElement);
            }
            
function removeSelectedIngredient(ingredientId, elementToRemove) {
    elementToRemove.remove();
}

function createGroceryList() {
    if (selectedRecipes.length === 0) {
        console.log('No selected recipes to create a grocery list.');
        return;
    }
    const selectedRecipeIds = selectedRecipes.join(',');
    axios.get(`http://localhost:5432/creategrocerylist?selectedRecipeIds=${selectedRecipeIds}`)
        .then(res => {
            const ingredients = res.data;
            const groceryList = document.getElementById('grocery-list');
            groceryList.innerHTML = '';
            const uniqueIngredients = new Set()
            ingredients.forEach(ingredient => {
                const ingredientName = ingredient.ingredient_name;
                console.log(isIngredientInFridge(ingredientName))
                if (!isIngredientInPantry(ingredientName) && !isIngredientInFridge(ingredientName)) {
                    uniqueIngredients.add(ingredientName);
                }
            });
            uniqueIngredients.forEach(ingredientsName => {
                const ingredientElement = document.createElement('div');
                ingredientElement.textContent = `${ingredientsName}`;
                groceryList.appendChild(ingredientElement);

            })
        })
        .catch(error => {
            console.log('Error getting ingredients for grocery list:', error);
        });
}

function isIngredientInFridge(ingredientName) {
    const fridgeItems = Array.from(selectedFridge.querySelectorAll('div'));
    return fridgeItems.some(item => item.textContent.includes(ingredientName));
}

function isIngredientInPantry(ingredientName) {
    const pantryItems = Array.from(selectedPantry.querySelectorAll('div'));
    return pantryItems.some(item => item.textContent.includes(ingredientName));
}


fridgeIng()
pantryIng()
getRecipes()
groceryListButton.addEventListener('click', createGroceryList);
