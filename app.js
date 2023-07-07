const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const Recipe = require('./models/Recipe.model')

const app = express()

app.use(express.static(__dirname + '/public'))
// creates an absolute path pointing to a folder called "views"
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(expressLayouts)

// 1. require the body-parser
const bodyParser = require('body-parser')
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }))

mongoose
  .connect('mongodb://127.0.0.1:27017/mongooseAdvanced')
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => console.error('Error connecting to mongo', err))

// Display all recipes
app.get('/', async (request, response) => {
  console.log(request.query)
  let filter
  // typeof request.query.searchTerm !== 'undefined'
  if (request.query.searchTerm?.length > 0) {
    filter = { title: request.query.searchTerm }
  }
  const allRecipesFromDB = await Recipe.find(filter)
  response.render('allRecipes', { recipes: allRecipesFromDB })
})

// Display the form to create one recipe
app.get('/newRecipe', (request, response) => {
  console.log('New Route ping')
  response.render('newRecipe')
})

app.post('/createRecipe', async (request, response) => {
  // On POST request we can access the payload on the body of the request (request.body)
  console.log(request.body)
  const { body } = request
  // body.ingredients = body.ingredients.split(' ')

  const newRecipe = await Recipe.create({ ...body, ingredients: body.ingredients.split(' ') })

  response.redirect(`/${newRecipe._id}`)
})

// Display one recipe
app.get('/:recipeId', async (request, response) => {
  const { recipeId } = request.params

  try {
    const recipe = await Recipe.findById(recipeId)
    /* {
    _id: new ObjectId("64a7dec0f6f653c9a04bac1e"),
    title: 'Pizza',
    cookingTime: 20,
    difficulty: 'easy peasy',
    ingredients: [ 'Flour', 'Water', 'Sugar' ]
  } */
    console.log(recipe)
    response.render('oneRecipe', recipe)
  } catch (error) {
    console.log(error)
    response.send('500 Error server')
  }
})

app.listen(3000, () => console.log('Listening on port 3000'))
