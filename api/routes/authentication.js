const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const jsonParser = bodyParser.json();

const con = require('./helpers/db_config')

const mailConfig = require('./helpers/mail');



router.post('/register', jsonParser, (req, res, next) => {
    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;

    if (first_name == null || first_name == '') {
        res.json({
            "status": false,
            "message": "first name field are required",
        })
    }
    else if (last_name == null || last_name == '') {
        res.json({
            "status": false,
            "message": "last name field are required",
        })
    }
    else if (email == null || email == '') {
        res.json({
            "status": false,
            "message": "email field are required",
        })

    }
    else if (password == null || password == '') {
        res.json({
            "status": false,
            "message": "password field are required",
        })
    }

    else {
        const searchSql = `SELECT * FROM users WHERE email = '${email}'`;

        con.query(searchSql, function (error, result) {
            if (result.length > 0) {
                res.status(500).json({
                    "status": false,
                    "message": "email already exist in database",
                });
            }
            else {
                const otp = `${Math.floor(1000*Math.random()*900)}`;

                const user = {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                };
                
                jwt.sign({ user: user }, "secretKey", (err, token) => {

                    const sql = `INSERT INTO users (first_name,last_name,email,password,token,otp,status)VALUES('${first_name}','${last_name}','${email}','${password}','','${otp}','not_verified')`;

                    con.query(sql, function (error, result) {
                        if (error) throw error;
                        let mailDetails = {
                            from: 'abrahamgreatebele@gmail.com',
                            to: email,
                            subject: 'Registration Successful',
                            html: `<html>
                            <head></head>
                            <h4>Thank you for registration in an account with us, this is your otp: <b>${otp}</b></h4>
                            </html>`
                        };
        
                        mailConfig.sendMail(mailDetails, function(err, data) {
                            if(err) {
                                console.log('Error Occurs');
                                res.status(500).json({
                                    "message":err,
                                })
                            } else {
                                res.status(201).json({
                                    "status": true,
                                    "message": "registration successful",
                                });
                            }
                        });
                   
                    })

                })

            }
        });
    }
})


router.post('/verify-email',jsonParser,(req,res,next)=>{
    const otp = req.body.otp;
    const email = req.body.email;

    const sql = `UPDATE users SET status = 'verified' WHERE email = '${email}' && otp = '${otp}'`;

    con.query(sql, function(error,result){
        if(error){
            res.status(500).json({
                "status": false,
                "message":"invalid otp",
            })
        }
        else{
            res.status(201).json({
                "status":true,
                "message":"account verified",
            })
        }
    })
})


router.post('/resend-otp',jsonParser,(req,res)=>{
    const email = req.body.email;
    const otp = `${Math.floor(1000*Math.random()*900)}`;
    const sql = `UPDATE users SET otp = '${otp}' WHERE email = '${email}'`;
    con.query(sql,function(error,result){
        if (error) throw error;
        let mailDetails = {
            from: 'abrahamgreatebele@gmail.com',
            to: email,
            subject: 'Registration Successful',
            html: `<html>
            <head></head>
            <h4>This is your otp: <b>${otp}</b></h4>
            </html>`
        };
        mailConfig.sendMail(mailDetails, function(err, data) {
            if(err) {
                res.status(500).json({
                    "message":err,
                })
            } else {
                res.status(201).json({
                    "status": true,
                    "message": "otp resend successful",
                });
            }
        });
   
    })

})


router.post('/login', jsonParser, (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || email == '') {
        res.json({
            "status": false,
            "message": "email field are required",
        })
    }
    else if (password == null || password == '') {
        res.json({
            "status": false,
            "message": "password field are required",
        })
    }

    else {
        const searchSql = `SELECT * FROM users WHERE email = '${email}' && password = '${password}' `;

        con.query(searchSql, function (error, result) {
            if (result.length > 0) {
                res.status(500).json({
                    "status": true,
                    "data": result[0],
                });
            }
            else {
                res.status(500).json({
                    "status": false,
                    "message": "incorrect login information",
                });

            }
        });
    }
})





module.exports = router;