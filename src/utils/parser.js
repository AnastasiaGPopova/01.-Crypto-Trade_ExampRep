exports.parseError = (error) => {
    if(error.name == "ValidationError"){
       let test = Object.values(error.errors).map(value => value.message)
       console.log(test)
       return test
    } else {
    return error.message.split('\n')
    }
}

