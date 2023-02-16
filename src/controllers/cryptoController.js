const Crypto = require('../models/Crypto.js')
const User = require('../models/User')
const cryptoService = require('../services/cryptoService')
const cryptoUtility = require('../utils/cryptoUtility')
const parser = require('../utils/parser')



exports.getCryptoCreationPage = (req,res) => {
    res.render('create')
}

exports.postCreatedCrypto = async (req, res) => {

 const {name, imageUrl, price, description, method} = req.body

    try{
        if(!name || !imageUrl || !price || !description || !method){
            throw new Error ("All fields are requiered!")
        }
        const newCrypto = await cryptoService.createNewCrypto({name, imageUrl, price, description, method, owner: req.user._id})//encoded body-to, which we receive, will create a new cube
        //redirect
        res.redirect('/')

    } catch(error){
        console.log(error)
        const errors = parser.parseError(error)
        res.render('create', {errors})
    }

}

exports.getDetails = async (req, res) => {

    let currentCrypto = await cryptoService.getOneCrypto(req.params.cryptoId)//it makes a request to the DB and gives us back all accessories with all details and infos/not only the ID/
                                       .populate('buyCryptoUsers') 
                                       .populate('owner')         
                                       .lean()

     if(!currentCrypto){
    return res.redirect('/404')
      }

let isLogged = false      
  
if(req.user){
    isLogged = true
    const isOwner = cryptoUtility.isCryptoOwner(req.user, currentCrypto)
    const isBoughtByCurrentUser= await cryptoUtility.isBougthbyUser(req.user._id, req.params.cryptoId)
    console.log(isOwner)
    console.log(isBoughtByCurrentUser)

    res.render('details', {currentCrypto, isLogged, isOwner, isBoughtByCurrentUser})
} else {
    res.render('details', {currentCrypto, isLogged})
}
}

exports.buy = async (req,res) =>{
    const currentCrypto = await cryptoService.getOneCrypto(req.params.cryptoId)
    const isOwner = cryptoUtility.isCryptoOwner(req.user, currentCrypto)

    if(isOwner){
        res.redirect('/')
    } else {
    currentCrypto.buyCryptoUsers.push(req.user._id)
    await currentCrypto.save()
    res.redirect(`/${req.params.cryptoId}/details`)
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