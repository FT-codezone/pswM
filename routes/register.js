const express = require("express")
const router = express.Router()
const {MongoClient} = require("mongodb")
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"

router.get("/", (req,res)=>{
    res.render("register",{idAlreadyUsed:false,campiOk:true})
})

router.post("/", (req,res)=>{
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)
        const {name,surname,email,id} = req.body
        db.collection("users").findOne({id:id}, (err,data)=>{
            if(err) res.sendStatus(500)
            if(data==null||data=={}||data==undefined){
                if(id!=null&&name!=null&&surname!=null&&email!=null){
                    db.collection("users").insertOne({
                        id:id,
                        name:name,
                        surname:surname,
                        email:email,
                        firstAccess:true
                    })
                    req.session.logged = true
                    req.session.userId = id
                    res.redirect("http://localhost")
                }else{
                    res.render("register",{idAlreadyUsed:false,campiOk:false})
                }
            }else{
                res.render("register",{idAlreadyUsed:true,campiOk:true})
            }
        })
    })
})

module.exports = router