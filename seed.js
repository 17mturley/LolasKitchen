require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`

        create table ingredients (
            ingredient_id serial primary key,
            name varchar(100),
            quantity varchar(50),
            isFridge boolean
        );

        create table recipes (
            recipe_id serial primary key,
            name varchar(100),
            instructions varchar(1500)
        );

        create table recipe_ing (
            recipe_ing_id serial primary key,
            ingredient_id integer references ingredients(ingredient_id),
            recipe_id integer references recipes(recipe_id)
        );

        create table my_ingredients (
            my_ingredient_id serial primary key,
            name varchar(100),
            quantity varchar(50),
            isFridge boolean
        );

        create table my_recipes (
            my_recipes_id serial primary key,
            name varchar(100),
            instructions varchar(1500)
        );

        insert into recipes (name, instructions)
        values ('Chilaquiles', 'Fry the tortilla chips until lightly brown and crisp. Then transfer the tortilla chips to a baking sheet and sprinkle lightly with salt and pepper. Make the salsa roja by blending tomatoes, onion, jalapeno, and garlic in a blender. Then add the salsa to a skillet and cook until slightly thickened. Coat the chips with the salsa until combined and heated through. Top with Queso Fresco, Crema, and Lime.'),
        ('Enchiladas', 'Fry the tortilla lightly in some oil, not crisp just cooked through. Then heat up the enchilada sauce and dip each tortilla into the sauce carefully. Place on a plate and add shredded rotisserie chicken to the center. Roll up the enchilada and top with Queso Fresco, Crema, and Lime. Serve immediatly.'),
        ('Cheese Tortellini', 'Start by boiling the tortellini until it floats to the top, then set aside. Then dice half an onion, two tomatoes, and two cloves of garlic. Heat up some olive oil and begin cooking the onions. Then add in the garlic and tomato. Once fragrant add in the tomatoe paste and then the half n half. While that simmers, mix together the panko crums and most of the parmesan(save the rest for topping), also add in some olive oil and salt and pepper. Once sauce is thickened to your liking, heat up the oven to a high broil. Mix in your cooked tortellini and top with panko parmesan mixture. Place in oven until golden brown, less than 5 minutes. Top with extra parmesan.'),
        ('Fried Rice', 'Cook 1 cup of Jasmin Rice. When rice is done put it in the freezer covered in plastic wrap to cool it down. Then fry up half a diced onion with some garlic. Then add in some veggie mix of your choice and season with your choice of spices. Once that is done cooking put it to the side and add butter to a hot pan to start frying your rice. Once that has crisped up add in your eggs. Then once cooked add in your cooked veggies and your soy sauce. Mix until well combined and enjoy.'),
        ('Hobo Toast', 'Start by cutting a small hole out of each slice of bread. Then butter up your hot skillet and begin toasting. Fill the hole with some parmesan cheese and then crack an egg on top. Flip and then cook until desired egg temperature. Can add more parmesan cheese to pan before flipping to get cheesy crust on both sides.');

        insert into ingredients (name, quantity, isFridge)
        values ('Salt', 'Pinch', false),
        ('Pepper', 'Pinch', false),
        ('Corn Tortillas', '6', true),
        ('Tomatoes', '2', true),
        ('Onion', '1/2', true),
        ('Jalapeno', '1', true),
        ('Garlic', 'two cloves', true),
        ('Queso Fresco', 'topping', true),
        ('Crema', 'topping', true),
        ('Limes', '2', true),
        ('Frying Oil', 'Coat bottom of frying pan', false),
        ('Rotisserie Chicken', '1', true),
        ('Enchilada Sauce', 'One Can', false),
        ('Frozen Tortellini', 'One Bag', true),
        ('Tomato Paste', '8oz Can', false),
        ('Half n Half', '1/2 cup', true),
        ('Parmesan Cheese', '3/4 cup shredded', true),
        ('Panko crumbs', '1/2 cup', false),
        ('Olive Oil', '2 tbsp', false),
        ('Jasmin Rice', '1 cup', false),
        ('Butter', 'Half a stick', true),
        ('Veggie Mix', 'Half a bag', true),
        ('Eggs', '3', true),
        ('Soy Sauce', '3 tbsp', false),
        ('Bread', '3 slices', false);


        insert into recipe_ing (ingredient_id, recipe_id)
        values (1, 1),
        (1, 2),
        (1, 3),
        (1, 4),
        (1, 5),
        (2, 1), 
        (2, 2),
        (2, 3),
        (2, 4),
        (2, 5),
        (3, 1),
        (3, 2),
        (4, 1),
        (4, 3),
        (5, 1),
        (5, 3),
        (5, 4),
        (6, 1),
        (7, 1),
        (7, 3),
        (7, 4),
        (8, 1),
        (8, 2),
        (9, 1),
        (9, 2),
        (10, 1),
        (10, 2),
        (11, 1),
        (11, 2),
        (12, 2),
        (13, 2),
        (14, 3),
        (15, 3),
        (16, 3),
        (17, 3),
        (17, 5),
        (18, 3), 
        (19, 3),
        (20, 4),
        (21, 4),
        (21, 5),
        (22, 4),
        (23, 4),
        (23, 5),
        (24, 4),
        (25, 5);
        `).then(() => {
            console.log("DB Seeded!")
            res.sendStatus(200)
        }).catch(err => console.log("error seeding DB", err))
    }
}