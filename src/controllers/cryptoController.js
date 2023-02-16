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
    const currentCrypto = await cryptoService.getOneCrypto(req.params.cryptoId).populate('owner').lean()
    const isOwner = cryptoUtility.isCryptoOwner(req.user, currentCrypto)

    if(!isOwner){
        res.redirect('/')
    } else {
        const methods = cryptoUtility.generateMethod(currentCrypto.method)
        res.render('edit', {currentCrypto, methods})
    }
}



exports.postEditedCrypto = async (req,res) => {
    const {name, imageUrl, price, description, method} = req.body

    try{
        if(!name || !imageUrl || !price || !description || !method){
            throw new Error ("All fields are requiered!")
        }
        const updatedCrypto = await cryptoService.update(req.params.cryptoId,{name, imageUrl, price, description, method} )//encoded body-to, which we receive, will create a new cube

        res.redirect(`/${req.params.cryptoId}/details`)

    } catch(error){
        const errors = parser.parseError(error)
        res.render(`edit`, {errors})
    }
}


exports.getDeleteCrypto= async (req, res) => {
    const crypto = await cryptoService.getOneCrypto(req.params.cryptoId).populate('owner').lean()
    const isOwner = cryptoUtility.isCryptoOwner(req.user, crypto)

    if(!isOwner){
        res.redirect('/')
    } else {
   const test = await cryptoService.deleteCrypto(req.params.cryptoId)
   res.redirect('/')
    }
}

exports.getSearchPage = async (req,res) => {

    let isSearched = false
    const allOffers = await cryptoService.getAllCryptos().lean()
    res.render('search', {isSearched, allOffers})
}

exports.getSearchPagewithResults = async (req, res) => {
    let isSearched = true
    const {item, method} = req.body
    console.log(item)
    console.log(method)

    const allMatches = await cryptoService.getSearchedby(item, method).lean()
    console.log(allMatches)


    res.render('search', {allMatches, isSearched})
}