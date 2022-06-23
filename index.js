const express = require("express")
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo');
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"
const uuid = require("uuid")
const port = 80

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

app.use(session({
    secret: "cat",
    resave: false,
    saveUninitialized:true,
    cookie: {secure:false},
    genid:()=>uuid.v4(),
    store: MongoStore.create({
        mongoUrl:dbUrl,
        dbName:dbName
    })
}))

app.set("view engine", "ejs")

// ROUTING

const loginRouter = require("./routes/login")
const registerRouter = require("./routes/register")
const publicRouter = require("./routes/public")
app.use("/login", loginRouter)
app.use("/public", publicRouter)
app.use("/register", registerRouter)

// HOME

const auth = require("./auth");
const { MongoClient } = require("mongodb");

app.get("/",auth,(req,res)=>{
    const id = req.session.userId
    console.log(id)
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)
        db.collection("users").findOne({id:id}, (err,data)=>{
            if(err) res.sendStatus(500)
            res.render("home",data)
            db.collection("users").updateOne({id:id}, {$set:{firstAccess:false}})
        })
    })
})

app.get("/home",(req,res)=>{
    res.redirect("http://localhost/")
})

app.listen(port, ()=>{
    console.log(`App's listening on port ${port}`)
})