const express = require('express');

const router = express.Router();

const handleVerifyToken = require('./helpers/verify_token')

const mysql = require('mysql');

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const jsonParser = bodyParser.json();

const con = require('./helpers/db_config')



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
            const sql = `SELECT * FROM users WHERE token ='${req.token}'`
            con.query(sql, function (error, result) {
                if (error) throw error;
                res.status(200).json({
                    "status": true,
                    "data": result[0],
                })
            })
        }
    })

})


router.get('/all', handleVerifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            // res.sendStatus(403)
            res.status(403).json({
                "status": false,
                "message": "invalid token"
            })
        }
        else {
            const sql = `SELECT * FROM users`
            con.query(sql, function (error, result) {
                if (error) throw error;
                res.status(200).json({
                    "status": true,
                    "data": result,
                })
            })
        }
    })

})


router.patch('/', handleVerifyToken, jsonParser, (req, res, next) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            // res.sendStatus(403)
            res.status(403).json({
                "status": false,
                "message": "invalid token"
            })
        }
        else {
            if (firstName != null && lastName == null) {
                const sql = `UPDATE users SET first_name = '${firstName}' WHERE token = '${req.token}'`;
                con.query(sql, function (error, result) {
                    if (error) throw error;
                    res.status(201).json({
                        "status": true,
                        "message": "update successful"
                    })
                })
            }
            else if (lastName != null && firstName == null) {
                const sql = `UPDATE users SET last_name = '${lastName}' WHERE token = '${req.token}'`;
                con.query(sql, function (error, result) {
                    if (error) throw error;
                    res.status(201).json({
                        "status": true,
                        "message": "update successful"
                    })
                })
            }
            else {
                const sql = `UPDATE users SET first_name = '${firstName}', last_name = '${lastName}' WHERE token = '${req.token}'`;
                con.query(sql, function (error, result) {
                    if (error) throw error;
                    res.status(201).json({
                        "status": true,
                        "message": "update successful"
                    })
                })
            }
        }
    })
});

module.exports = router;