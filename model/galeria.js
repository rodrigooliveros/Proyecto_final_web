let mongoose = require("mongoose")
let Schema = mongoose.Schema

let GaleriaSchema = Schema({

title: String,
author: String,
description: String,
media: String,
user_id: String
})

module.exports = mongoose.model('galerias',GaleriaSchema)