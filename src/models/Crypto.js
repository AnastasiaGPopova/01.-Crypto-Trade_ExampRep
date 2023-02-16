const mongoose = require('mongoose')

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        //minLength: [6, "Too short! Title should be at least 6 characters !"]
    }, 
    imageUrl: {
        type: String,
        required: true,
        // match: /^https?:\/\//
        validate : {
            validator: function (value){
                return value.startsWith("http://") || value.startsWith("https://")
            },
            message: "Invalid URL!"
        }
    }, 
    price: {
        type: Number,
        required: true,
        min: 1850,
        max: 2021
        //maxLength: [15, "Too long! Location should be 15 characters !"]
    },
    description: {
        type: String,
        required: true,
        maxLength: [60, "Too long! Description max 60 characters !"]
    
    },
    method: {
        type: String,
        required: true,
        enum: { values:["crypto-wallet", "credit-card", "paypal", "debit-card"], message:'Payment method field can be only "crypto-wallet", "credit-card", "debit-card" or "paypal" !'}
       // minLength: [6, "Too short! Keyword should be at least 6 characters !"]
    },
    buyCryptoUsers:[{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    
    // createdAt: {
    //     type: Date, default: Date.now
    // },
}, { timestamps: true })

const Crypto = mongoose.model('Crypto', cryptoSchema)
module.exports = Crypto