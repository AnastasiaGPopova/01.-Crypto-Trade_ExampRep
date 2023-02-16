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

    // <option value="crypto-wallet">Crypto Wallet</option>
    // <option value="credit-card">Credit Card</option>
    // <option value="debit-card">Debit Card</option>
    // <option value="paypal" selected>PayPal</option>

    const methods = [
        {
            key: "crypto-wallet",
            label: "Crypto Wallet",
            selected: false
        },
        {
            key: "credit-card",
            label: "Credit Card",
            selected: false
        },
        {
            key: "debit-card",
            label: "Debit Card",
            selected: false
        },
        {
            key: "paypal",
            label: "PayPal",
            selected: false
        }
    ]

    const result = methods.map(x => x.key == currentMethod ? {...x, selected: true} : x)
    return result
}
