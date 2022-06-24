const express = require("express")
const router = express.Router()
const {MongoClient} = require("mongodb")
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"
const bcrypt = require("bcrypt")

router.get("/", (req,res)=>{
    req.session.logged = false
    res.render("login",{pe:false})
})

router.post("/", async(req,res)=>{
    const {email, password} = req.body
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)

        db.collection("users").findOne({email:email}, async(err,data)=>{
            if(err) res.sendStatus(500)
            else{
                if(data!=null&&(await bcrypt.compare(password,data.password))){
                    req.session.logged = true
                    req.session.userId = data.id
                    res.redirect("http://localhost")
                    db.collection("users").updateOne({email:email}, {$set:{firstAccess:false}})
                }else{
                    req.session.destroy()
                    res.render("login",{pe:true})
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