const express = require("express")
const router = express.Router()
const {MongoClient} = require("mongodb")
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"

router.get("/", (req,res)=>{
    req.session.logged = false
    res.render("login",{})
})

router.post("/", (req,res)=>{
    const {email, password} = req.body
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)

        db.collection("users").findOne({email:email,password:password}, (err,data)=>{
            if(err) res.sendStatus(500)
            else{
                if(data!=null){
                    req.session.logged = true
                    req.session.userId = data.id
                    res.redirect("http://localhost")
                    db.collection("users").updateOne({email:email}, {$set:{firstAccess:false}})
                }else{
                    req.session.destroy()
                    res.redirect("http://localhost/login")
                }
            }
        })
    })
})

router.post("/disconnect", (req,res)=>{
    req.session.destroy()
    res.redirect("http://localhost/login")
})

module.exports = router