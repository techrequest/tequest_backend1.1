const express = require('express');
const router = express.Router();
const TechrequestModel = require('../models/TechrequestModel.js');

router.get(
    '/',
    (req, res) => {
        TechrequestModel
        .find()
        .then(
            (document) => {
                res.send(document);
            }
        )
        .catch(
            (error) => {
                console.log('error', error);
            }
        )
    }
)


router.post(
    '/',
    (req, res) => {
       
        const formData = {  
            jobTitle: req.body.jobTitle ,
            jobDescription: req.body.jobDescription ,
            country: req.body.country,
            state: req.body.state,
            jobCity: req.body.jobCity,
            addressLine1:req.body.addressLine1,
            amount: req.body.amount ,
            contactName: req.body.contactName,
            contactNumber: req.body.contactNumber,
            contactEmail: req.body.contactEmail,
            moreDetails: req.body.moreDetails
                          

        };

        const newTechrequest = new TechrequestModel(formData);

        newTechrequest
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

// router.update(
//     '/',
//     (req, res) => {
       
//         const formData = {  
//             jobTitle: req.body.jobTitle ,
//             jobDescription: req.body.jobDescription ,
//             country: req.body.country,
//             state: req.body.state,
//             jobcity: req.body.jobcity,
//             addressLine1:req.body.addressLine1,
//             amount: req.body.amount ,
//             contactName: req.body.contactName,
//             contactNumber: req.body.contactNumber,
//             contactEmail: req.body.contactEmail,
//             moreDetails: req.body.moreDetails
                          

//         };

//         const updateTechrequest = new TechrequestModel(formData);

//         newTechrequest
//         .save()
//         .then(
//             (document) => {
//                 res.send(document)
//             }
//         )
//         .catch(
//             (error) => {
//                 console.log('error', error);
//                 res.send({'error': error})
//             }
//         )
//     }
// )
module.exports = router;