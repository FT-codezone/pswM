const express = require("express")
const router = express.Router()

router.get("/:file", (req,res)=>{
    res.sendFile(require("path").join(__dirname,`../public/${req.params.file}`))
})

module.exports = router