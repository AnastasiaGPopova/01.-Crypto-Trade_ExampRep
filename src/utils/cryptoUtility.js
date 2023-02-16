const Crypto = require('../models/Crypto.js')
exports.isCryptoOwner = (user, crypto) => {
    let isOwner = false
    console.log(crypto.owner)
    if(user){
        if(user._id == crypto.owner._id){
            isOwner = true
        }
    }
   return isOwner
}



exports.isBougthbyUser = async (userId, cryptoId) => {
    let isBought = false
    const crypto = await Crypto.findById(cryptoId)
    //TO DO
    const bought = crypto.buyCryptoUsers.find(x=> x == userId )

    if(bought){
        isBought = true
    }
    return isBought
}

exports.generateMethod = function (currentMethod){ //prepare view data
    const methods = [
        {
            key: 1,
            label: "Very easy",
            selected: false
        },
        {
            key: 2,
            label: "Easy",
            selected: false
        },
        {
            key: 3,
            label: "Medium (Standard 3x3)",
            selected: false
        },
        {
            key: 4,
            label: "Intermediate",
            selected: false
        },
        {
            key: 5,
            label: "Expert",
            selected: false
        },
        {
            key: 6,
            label: "Hardcore",
            selected: false
        }
    ]

    const result = methods.map(x => x.key == currentMethod ? {...x, selected: true} : x)
    return result
}
