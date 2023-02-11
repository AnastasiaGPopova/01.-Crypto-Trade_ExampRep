const express = require('express')
const router = require('./routes.js')
const handlebars = require('express-handlebars')

const app = express()

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.use(express.static('public'))
app.use(express.urlencoded({extended: false})) //before the router
app.use(router)

app.listen(3000, () => console.log(`Server is running on Port 3000...`))