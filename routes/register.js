const express = require("express")
const router = express.Router()
const {MongoClient} = require("mongodb")
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"

router.get("/", (req,res)=>{
    res.render("register",{idAlreadyUsed:false})
})

router.post("/", (req,res)=>{
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)
        const {name,surname,id} = req.body
        db.collection("users").findOne({id:id}, (err,data)=>{
            if(err) res.sendStatus(500)
            if(data==null||data=={}||data==undefined){
                db.collection("users").insertOne({
                    id:id,
                    name:name,
                    surname:surname
                })
                req.session.logged = true
                res.redirect("http://localhost")
            }else{
                res.render("register",{idAlreadyUsed:true})
            }
        })
    })
})

module.exports = router