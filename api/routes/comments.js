const express = require('express');

const router = express.Router();

const handleVerifyToken = require('./helpers/verify_token')

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const jwt = require('jsonwebtoken');


const con = require('./helpers/db_config')

router.post('/', handleVerifyToken, jsonParser, (req, res, next) => {
    const comment = req.body.comment;
    const postId = req.body.post_id
    const date = new Date();
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            // res.sendStatus(403)
            res.status(403).json({
                "status": false,
                "message": "invalid token"
            })
        }
        else {
            const sql = `INSERT INTO comments(message,post_id,token,date)VALUES('${comment}','${postId}','${req.token}','${date}')`;
            con.query(sql, function (error, result) {
                if (error) throw error;
                res.status(201).json({
                    "status": true,
                    "message": "comment added successfully"
                })
            })
        }
    })



})


router.get('/', handleVerifyToken,(req, res) => {

    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            // res.sendStatus(403)
            res.status(403).json({
                "status": false,
                "message": "invalid token"
            })
        }
        else {
            const sql = "SELECT * FROM comments";

            con.query(sql, function (error, result) {
                if (error) throw error;
                res.status(200).json({
                    "status": true,
                    "data": result,
                })
            })
        }
    })

});


module.exports = router;