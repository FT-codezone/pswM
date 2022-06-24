const express = require("express")
const router = express.Router()
const {MongoClient} = require("mongodb")
const auth = require("../auth");
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"

router.get("/",auth,(req,res)=>{
    const id = req.session.userId
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

module.exports = router