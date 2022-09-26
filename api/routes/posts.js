const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');

const handleVerifyToken = require('./helpers/verify_token')

const jsonParser = bodyParser.json();

const jwt = require('jsonwebtoken');

const cloudinary = require('cloudinary');

const con = require('./helpers/db_config')

router.post('/', handleVerifyToken, jsonParser, (req, res, next) => {
    const caption = req.body.caption;
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
            const sql = `INSERT INTO posts(body,date)VALUES('${caption}','${date}')`;
            con.query(sql, function (error, result) {
                if (error) throw error;
                res.status(201).json({
                    "status": true,
                    "message": "post created",
                })
            })

        }
    })
})

router.get('/', handleVerifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            // res.sendStatus(403)
            res.status(403).json({
                "status": false,
                "message": "invalid token"
            })
        }
        else {
            const sql = `SELECT * FROM posts INNER JOIN post_images ON posts.id = post_images.post_id `;
            con.query(sql, function (error, result) {
                if(error) throw error;
                res.status(200).json({
                    "status": true,
                    "data": result
                })
            })
        }
    })
})


router.get('/:postId', handleVerifyToken, (req, res, next) => {
    const postId = req.params.postId;
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            // res.sendStatus(403)
            res.status(403).json({
                "status": false,
                "message": "invalid token"
            })
        }
        else {
            const sql = `SELECT * FROM posts WHERE id = '${postId}' `;
            con.query(sql, function (error, result) {
                res.status(200).json({
                    "status": true,
                    "data": result[0],
                })
            })
        }
    })
})

module.exports = router;