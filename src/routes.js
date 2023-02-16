//--------Configuring the router /which gets exported at the end----------
const express = require('express')
const Router = express.Router
const router = Router()
// ----------------------------------


//----- importing the controllers----------
const homeController = require('./controllers/homeController')
const cryptoController = require('./controllers/cryptoController')
const authController = require('./controllers/authController.js')
const {isAuthenticated} = require('./middlewares/authMiddleware.js')

//-------------------------------------------


router.get('/', homeController.getHomePage)
router.get('/catalog', homeController.getCatalogPage)


// //Login and Register

router.get('/login', authController.loginPage)
router.get('/register', authController.registerPage)
router.post('/register', authController.postRegisterUser)
router.post('/login', authController.postLoginUser)


//crypto creation
router.get('/create', isAuthenticated, cryptoController.getCryptoCreationPage )
router.post('/create', isAuthenticated, cryptoController.postCreatedCrypto)

//Details Page
router.get('/:cryptoId/details', cryptoController.getDetails)

//buy
router.get('/:cryptoId/buy', isAuthenticated, cryptoController.buy)

// //Edit page
// router.get('/:houseId/edit', isAuthenticated, houseController.getEditPage)
// router.post('/:houseId/edit', isAuthenticated, houseController.postEditedHouse)

// // //Delete post
// router.get('/:houseId/delete', isAuthenticated, houseController.getDeleteHouse)

// // //search
// router.get('/search', isAuthenticated, houseController.getSearchPage)
// router.post('/search', isAuthenticated, houseController.getSearchPagewithResults)


router.get('/logout', authController.logout)
router.get('*', homeController.getErrorPage404)
router.get('/404', homeController.getErrorPage404)



module.exports = router