const User = require('../model/User')
const bcrypt = require('bcrypt')

exports.register = async (username, email, password, rePassword) =>  {

    const existingUser = await User.find({em})
    //Validate password
    if(password !== rePassword){
        throw new Error ('Password missmatch!')
    }

    if(!username || !email || !password || !rePassword){
        throw new Error ('All fields are required!')
    }

    const hashPassword = await bcrypt.hash(password, 10)

    await User.create({username, email, password: hashPassword})
}

