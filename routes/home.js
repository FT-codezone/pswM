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

router.post("/addPsw", (req,res)=>{
    const {site,psw} = req.body
    MongoClient.connect(dbUrl, (err,database)=>{
        if(err) res.sendStatus(500)
        const db = database.db(dbName)
        db.collection("users").findOne({id:req.session.userId}, (err,data)=>{
            if(err) res.sendStatus(500)
            for(i=0;i<data.data.length;i++){
                if(data.data[i].site==site){
                    res.send(`Il sito ha già una password registrata
                        <script>
                            setTimeout(() => {
                                window.location.href="http://localhost/"
                            }, 3000);
                        </script>
                    `)
                }else{
                    res.send(`Password salvata!
                        <script>
                            setTimeout(() => {
                                window.location.href="http://localhost/"
                            }, 3000);
                        </script>
                    `)
                }
            }
        })
    })
})

module.exports = router