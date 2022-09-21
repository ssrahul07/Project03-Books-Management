const userModel = require('../models/userModel')

const isValid = require("../validate/validator")

const registerUser = async function(req, res) {
    try{
        let data = req.body;
        let mandate = isValid.mandatory(data)
        if(mandate) {
            return res.status(400).send({ status: false, msg: mandate });
        }
        
        let title = isValid.isValidTitle(data.title)
        if(title){
            return res.status(400).send({ status: false, msg: title });
        }

        let phone = isValid.isValidPhone(data.phone)
        if(phone) {
            return res.status(400).send({ status: false, msg: phone });
        }
        
        ///////////////////////////// CREATING USER ///////////////////////////////////////
        if(req.body && Object.keys(req.body).length > 0) {
            let user = await userModel.create(req.body);
            return res.status(201).send({status: true, message: 'Success', data: user})
        }else {
            return res.status(400).send({status: false, message: "Request must contain valid Body"})
        }
    } catch(error){
        return res.status(500).send({status: false, msg: error.message})
    }
}

module.exports.registerUser = registerUser