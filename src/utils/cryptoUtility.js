const Crypto = require('../models/Crypto.js')
exports.isCryptoOwner = (user, crypto) => {
    let isOwner = false
    if(user){
        if(user._id == crypto.owner._id){
            isOwner = true
        }
    }
   return isOwner
}



exports.isRentedAlready = async (userId, cryptoId) => {
    let isBought = false
    const crypto = await Crypto.findById(cryptoId)
    //TO DO
    const bought = crypto.buyCryptoUsers.find(x=> x == userId )

    if(bought){
        isBought = true
    }
    return isBought
}