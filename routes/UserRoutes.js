const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const UserModel = require('../models/UserModel.js');
const jwtSecret = "xyzABC890";



router.post(
    '/register',
    (req, res) => {
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            addressLine3: req.body.addressLine3,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            country: req.body.country,
            preferredTime: req.body.preferredTime,
            isUnderage: req.body.isUnderage

        };

        const newUserModel = new UserModel(formData);

        //newUserModel
      //  .save()

                /*
         * Here we check for (A) uniques emails and
         * (B) prepare password for registration
         */


        /* Part (A) */
        // 1. Search the database for exact email match
        UserModel
        .find({email: formData.email})
        .then(
            (document) => {}
        )
        .catch()
        // 2.1 If there is a matchMedia, reject the registration

        // 2.2 If there is match proceed with part B

        /* Part (B) */

        // 1. Generate a salt
        bcrypt.genSalt(
            (err, salt) => {

                // 2. Take salt and user's password to hash password
                bcrypt.hash(
                    formData.password,
                    salt,
                    (err, encryptedPassword) => {
                        // 3. Replace the user's password with the hash
                        newUserModel.password = encryptedPassword;

                        // 4. Save to the database
                        newUserModel
                        .save()
                        .then(
                            (document) => {
                                res.send(document)
                            }
                        )
                        .catch(
                            (error) => {
                                console.log('error', error);
                                res.send({'error': error})
                            }
                        )
                    }
                )
            }
        )
    }
);

router.post(
    '/login',           // users/login
    (req, res) => {
        // 1. Capture the email and password
        const formData = {
            email: req.body.email,
            password: req.body.password
        }
        // 2. Find a match in the database for email
        UserModel
        .findOne({ email: formData.email})
        .then(
            (document) => {         
                if(document) {
                    // 2.1. If email has been found, check their password
                    bcrypt.compare(
                        formData.password,
                        document.password
                    )
                    .then(
                        (passwordMatch) => {

                            if(passwordMatch === true) {
                                // 3.1. If their password is correct, generate the json web token
                                const payload = {
                                    id: document._id,
                                    email: document.email
                                }
                                jsonwebtoken.sign(
                                    payload,
                                    jwtSecret,
                                    (error, theToken) => {

                                        if(error) {
                                            res.send({ message: "Something went wrong"})
                                        }

                                        // 4. Send the json web token to the client
                                        res.send({ theToken: theToken })
                                    }
                                )
                            }
                            else {
                                // 3.2 If password is incorrect, reject the login
                                res.send({ message: "Wrong email or password"});
                            }
                        }
                    )
                    .catch(
                        (error) => {
                            res.send({ message: "Something went wrong" })
                        }
                    )
                } 
                else {
                    // 2.2 If no email match, reject the login
                    res.send({ message: "Wrong email or password"});
                }
            }
        )
    }
)

router.post(
    '/update',
    (req, res) => {

        const formData = {  
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            addressLine3: req.body.addressLine3,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            country: req.body.country,
            preferredTime: req.body.preferredTime,
            isUnderage: req.body.isUnderage
        };


        const filter = {email: formData.email};
        const options = {upsert : false};
        const updateDoc = {
            $set:{
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                addressLine3: formData.addressLine3,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                preferredTime: formData.preferredTime,
                isUnderage: formData.isUnderage
            }
        }

        UserModel
         .updateOne( filter, updateDoc, options)
         .then(
             (document) =>{
                 res.send(document)
             }
         )
         .catch(
             (error) => {
                 if(error){
                     console.log(error)
                 }
                 else
                 {
                     console.log(document)
                 }
             }
         )


    }
)

router.get(
    '/profile',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        UserModel
        .findById(req.user.id)
        .then(
            (document) => {
                res.send(document)
            }
        )
        .catch(
            (error) => {
                res.send({
                    message: "error occured " + error
                })
            }
        )

    }
)



router.get(
    '/',               // https://www.app.com/users
    (req, res) => {
        UserModel
        .find()
        .then(
            (document) => {
                console.log('user', document);
                res.send(document);
            }
        )
        .catch(
            (error) => {
                console.log('error', error)
            }
        )
    }
);

module.exports = router;
