let express = require("express")
let mongoose = require("mongoose")
let cookieParser = require("cookie-parser")
let dotenv = require("dotenv");

let app = express()

dotenv.config();

let indexRoutes = require("./routes/routeindex")

// connection to Mongo db
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/task-list')
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));


app.set("view engine","ejs")
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(cookieParser())

//app.use(express.json())

app.use("/",indexRoutes)


app.listen(3000, ()=>{
    console.log("Servidor encendido en puerto 3000")
})
