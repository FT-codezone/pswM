const express = require("express")
const router = express.Router()
const {MongoClient} = require("mongodb")
const dbUrl = "mongodb://localhost:27017"
const dbName = "pswM"
const uuid = require("uuid")

router.get("/", (req,res)=>{
    res.render("register",{emailAlreadyUsed:false,campiOk:true})
})

router.post("/", (req,res)=>{
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)
        const {name,surname,email,password} = req.body
        db.collection("users").findOne({email:email}, (err,data)=>{
            if(err) res.sendStatus(500)
            if(data==null||data=={}||data==undefined){
                if(password!=null&&name!=""&&surname!=""&&email!=""){
                    const id = uuid.v4()
                    db.collection("users").insertOne({
                        password:password,
                        name:name,
                        surname:surname,
                        email:email,
                        firstAccess:true,
                        id: id
                    })
                    req.session.logged = true
                    req.session.userId = id
                    res.redirect("http://localhost")
                }else{
                    res.render("register",{emailAlreadyUsed:false,campiOk:false})
                }
            }else{
                res.render("register",{emailAlreadyUsed:true,campiOk:true})
            }
        })
    })
})

module.exports = router