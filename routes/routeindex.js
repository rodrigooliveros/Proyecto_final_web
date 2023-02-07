// Archivo de rutas
let express = require("express")
let router = express()
let Task = require("../model/task")
let User = require("../model/user")
let verify = require("../middleware/verifyAccess")
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const {render} = require('ejs');

const Galeria = require('../model/galeria')


router.get("/", verify, async function(req,res){

    // (1) Consulta a la BD para recuperar todas las tareas
    let galerias = await Galeria.find({user_id: req.userId})
   // console.log(tasks)
    res.render("index", {galerias})
})

router.get('/media', verify, async function(req, res){
    let galerias = await Galeria.find({user_id: req.userId})
    res.render('media', {galerias})
})

router.get('/newPost', verify, async function(req, res){
    let galerias = await Galeria.find({user_id: req.userId})
    res.render('newPost', {galerias})
})

router.get('/artists', verify, async function(req, res){
    let galerias = await Galeria.find({user_id: req.userId})
    res.render('artists', {galerias})
})

router.get('/contactus', verify, async function(req, res){
    let galerias = await Galeria.find({user_id: req.userId})
    res.render('contactus', {galerias})
})

router.post('/newPost', verify, async function(req, res){
    let galerias = new Galeria(req.body);
    galerias.user_id = req.userId;
    await galerias.save();
    res.redirect('/');
})

router.get("/delete/:id", async function(req,res){

    let id = req.params.id
    await Galeria.remove({_id:id})
    res.redirect("/")
    })

router.get("/edit/:id", async function(req,res){

    let id = req.params.id    
    let galerias = await Galeria.findById(id)
    res.render("edit",{galerias})    
})

router.post("/edit/:id", async function(req,res){

    let id = req.params.id    
    await   Galeria.updateOne({_id: id},req.body)
    res.redirect("/")
})


// Agregar nuevas tareas
router.post('/add',verify, async function(req,res){

//console.log(req.body)
let task = new Task(req.body)
task.user_id = req.userId
await task.save()
res.redirect("/")
})


// Actualizar el estatus de la tarea
router.get("/status/:id", async function(req,res){

let id = req.params.id
let task = await Task.findById(id)
task.status = !task.status
await task.save()
res.redirect("/")
})


// Eliminar el elemento
router.get("/delete/:id", async function(req,res){

    let id = req.params.id
    await Task.remove({_id:id})
    res.redirect("/")
    })
    

router.get("/edit/:id", async function(req,res){

let id = req.params.id    
let task = await Task.findById(id)
res.render("edit",{task})    
})

// Actualizar los datos
router.post("/edit/:id", async function(req,res){

    let id = req.params.id    

   /* let task = await Task.findById(id)
    task.title = req.body.title
    task.description = req.body.description*/

 await   Task.updateOne({_id: id},req.body)
 res.redirect("/")

    })


    router.get("/register",  function(req,res){
        res.render("register")
    })

    router.post("/addUser", async function(req,res){

        console.log(req.body)

        let user = new User(req.body)
       /* let email = req.body.email
        let passsword = req.body.password*/
       
        let exists = await User.findOne({email:user.email})

        console.log(exists)
    
        // Si no hay usuarios con el mismo correo, creamos uno nuevo
        if (!exists){

            user.password = bcrypt.hashSync(user.password,10)
            console.log(user.password)
            await user.save()
            res.redirect("/login")
        }
        else {
            res.redirect("/register")
        }

    })


    router.get("/login",  function(req,res){
        res.render("login")
    })


    router.post("/login",async function(req,res){

        let email = req.body.email
        let plainpasssword = req.body.password

        let user = await User.findOne({email:email})

        // Si no existe 

        if (!user){
            res.redirect("/login")
        }

        // El usuario si existe. Validar 1) La contraseña
        else {

            let valid = await bcrypt.compareSync(plainpasssword,user.password)

            // Si el usuario es valido le genero un token y lo mando a Home /
            if (valid){

                let token = jwt.sign({id: user.email},process.env.SECRETO,{
                    expiresIn:"1h"
                })

                console.log(token)
                res.cookie("token",token,{httpOnly:true})
                res.redirect("/")
            }
            else {
                res.redirect("/login")
            }

        }

    })

    router.get("/logout",  function(req,res){

        res.clearCookie("token")
        res.redirect("/")
    })
    


module.exports = router