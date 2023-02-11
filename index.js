const express = require('express')
const router = require('./routes.js')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()


//////Setting up Express-Handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.set('view engine', 'hbs')
/////////////////////////////////////

////Adding static files
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false})) //before the router
////////////////////


app.use(router)

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb://127.0.0.1:27017/crypto`)

app.listen(3000, () => console.log(`Server is running on Port 3000...`))