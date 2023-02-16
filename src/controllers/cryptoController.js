const Crypto = require('../models/Crypto.js')
const User = require('../models/User')
const cryptoService = require('../services/cryptoService')
const cryptoUtility = require('../utils/cryptoUtility')
const parser = require('../utils/parser')



exports.getCryptoCreationPage = (req,res) => {
    res.render('create')
}

exports.postCreatedCrypto = async (req, res) => {
 const {name, type, year, city, imageUrl, description, prices} = req.body

    try{
        if(!name || !type || !year || !city || !imageUrl || !description || !prices){
            throw new Error ("All fields are requiered!")
        }
        const newHouse = await housingService.createNewHouse({name, type, year, city, imageUrl, description, prices, owner: req.user._id})//encoded body-to, which we receive, will create a new cube
        //redirect
        res.redirect('/')

    } catch(error){
        const errors = parser.parseError(error)
        res.render('create', {errors})
    }

}

exports.getDetails = async (req, res) => {

    let currentHouse = await housingService.getOneHouse(req.params.houseId)//it makes a request to the DB and gives us back all accessories with all details and infos/not only the ID/
                                       .populate('rentedHome') 
                                       .populate('owner')         
                                       .lean()

     if(!currentHouse){
    return res.redirect('/404')
      }

let isLogged = false
let rentedBy = currentHouse.rentedHome.map(x =>x.name)

let isRented = true
let isAvailable = true

      
  
if(rentedBy.length == 0){
    isRented = false
}
  if(pieces == 0){
          isAvailable = false
}

      rentedBy = rentedBy.join(', ')

if(req.user){
    isLogged = true

    
    const isOwner = houseUtility.isHouseOwner(req.user, currentHouse)
    const isRentedbyCurrentUser= await houseUtility.isRentedAlready(req.user._id, req.params.houseId)
    console.log(isRentedbyCurrentUser)

    res.render('details', {currentHouse, isOwner, isRentedbyCurrentUser, isRented, rentedBy, isAvailable, isLogged})
} else {
    res.render('details', {currentHouse, isRented, rentedBy, isLogged})
}
}

exports.rent = async (req,res) =>{
    const currentHouse = await housingService.getOneHouse(req.params.houseId)
    const isOwner = houseUtility.isHouseOwner(req.user, currentHouse)

    if(isOwner){
        res.redirect('/')
    } else {
    currentHouse.rentedHome.push(req.user._id)
    currentHouse.prices--
    await currentHouse.save()
    res.redirect(`/${req.params.houseId}/details`)
    }

}


exports.getEditPage = async (req,res) => {
    const currentHouse = await housingService.getOneHouse(req.params.houseId).populate('owner').lean()
    const isOwner = houseUtility.isHouseOwner(req.user, currentHouse)

    if(!isOwner){
        res.redirect('/')
    } else {
        res.render('edit', {currentHouse})
    }
}



exports.postEditedHouse = async (req,res) => {
    const {name, type, year, city, imageUrl, description, prices} = req.body
    try{
        if(!name || !type || !year || !city || !imageUrl || !description || !prices){
            throw new Error ("All fields are requiered!")
        }
        const updatedHouse = await housingService.update(req.params.houseId,{name, type, year, city, imageUrl, description, prices} )//encoded body-to, which we receive, will create a new cube

        res.redirect(`/${req.params.houseId}/details`)

    } catch(error){
        const errors = parser.parseError(error)
        res.render(`edit`, {errors})
    }
}


exports.getDeleteHouse= async (req, res) => {
    const house = await housingService.getOneHouse(req.params.houseId).populate('owner').lean()
    const isOwner = houseUtility.isHouseOwner(req.user, house)

    if(!isOwner){
        res.redirect('/')
    } else {
   const test = await housingService.deleteHouse(req.params.houseId)
   res.redirect('/')
    }
}

exports.getSearchPage = async (req,res) => {

    let isSearched = false
    res.render('search', {isSearched})
}

exports.getSearchPagewithResults = async (req, res) => {
    let isSearched = true
    const {searchedItem} = req.body

    const allMatches = await housingService.getSearchedbyType(searchedItem).lean()
    console.log(allMatches)


    res.render('search', {allMatches, isSearched})
}