const User = require('../model/User')

exports.register = async (username, email, password, rePassword) =>  {

    const existingUser = await User.find({em})
    //Validate password
    if(password !== rePassword){
        throw new Error ('Password missmatch!')
    }

    if(!username || !email || !password || !rePassword){
        throw new Error ('All fields are required!')
    }


    await User.create({username, email, password, rePassword})
}

