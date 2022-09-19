const express = require('express');

const router = express.Router();

router.post('/', (req,res,next)=>{
    res.status(201).json({
        "message":"handling users post request"
    })
})

module.exports =router;