const Crypto = require('../models/Crypto')

exports.getOneCrypto = (cryptoId) => Crypto.findById(cryptoId)
exports.getAllCryptos = () => Crypto.find()
exports.getLastAdded = () => Crypto.find({}).sort({createdAt: -1})
exports.update = (cryptoId, data) => Crypto.findByIdAndUpdate(cryptoId, data, {runValidators: true})
exports.deleteHouse = (cryptoId) => Crypto.findByIdAndDelete(cryptoId, {runValidators: true})
exports.getSearchedbyType = (item) => Crypto.find({}).where('type').equals(`${item}`)
exports.createNewHouse = (data) => Crypto.create(data)
