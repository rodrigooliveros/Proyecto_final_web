let mongoose = require("mongoose")
let Schema = mongoose.Schema

let TaskSchema = Schema({

title: String,
description: String,
status : {
    type: Boolean,
    default:false
},
user_id: String
})

module.exports = mongoose.model('tasks',TaskSchema)