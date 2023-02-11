const express = require('express')
const router = require('./routes.js')

const app = express()

app.use(express.urlencoded({extended: false})) //before the router
app.use(router)

app.listen(3000, () => console.log(`Server is running on Port 3000...`))