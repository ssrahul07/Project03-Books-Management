const { isObjectIdOrHexString } = require("mongoose")
const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
const isValid = require("../validate/validator")

const registerUser = async function(req, res) {
    try{
        let data = req.body;
        // if(!data) return res.status(400).send({status: false, message: "body can not be empty"})

        let mandate = isValid.mandatory(data)
        if(mandate) {
            return res.status(400).send({ status: false, message: mandate });
        }
        
        let title = isValid.isValidTitle(data.title)
        if(title){
            return res.status(400).send({ status: false, message: title });
        }

        let name = isValid.isValidName(data.name)
        if(name){
            return res.status(400).send({ status: false, message: name });
        }


        let phone = isValid.isValidPhone(data.phone)
        if(phone) {
            return res.status(400).send({ status: false, message: phone });
        }
        const isUniquePhone = await userModel.findOne({phone: data.phone})
        if(isUniquePhone) return res.status(400).send({status: false, message: "Phone Number is already present"})
        
        let email = isValid.emailValidation(data.email)
        if(email) {
            return res.status(400).send({status: false, message: "Please, enter valid email"})
        }
        const isUniqueEmail = await userModel.findOne({email: data.email})
        if(isUniqueEmail) return res.status(400).send({status: false, message: "Email is already present"})

        let password = isValid.passwordValidation(data.password)
        if (!password) return res.status(400).send({status: false, message: "Please, enter valid password"})





///////////////////////////// CREATING USER ///////////////////////////////////////
    if(req.body && Object.keys(req.body).length > 0) {
        let user = await userModel.create(req.body);
        return res.status(201).send({status: true, message: 'Success', data: user})
    }else {
        return res.status(400).send({status: false, message: "Request must contain valid Body"})
    }
    } catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}

// const userModel = require("../models/userModel")

////////////////////////////////////////// USER LOGIN ////////////////////////////////// 
const login = async function (req, res) {
    try {
        
        if(req.body && Object.keys(req.body).length > 0){
            
            let { email, password} = req.body
            
            
            //********************************************  additinal work   ******************************************************* */
            // if(!email) return res.status(400).send({status:false, msg:" plz enter email" })
            
            // if(!emailValidation(email)) return res.status(400).send({status:false, msg:" plz enter valid email" })
            
            // if(!password) return res.status(400).send({status:false, msg:" plz enter password" })
            
            // if(!passwordValidation(password)) return res.status(400).send({status:false, msg: "plz enter valid password"})
            
            //******************************************************************************************************************************* */ 
            
            if(!email || !password ) return res.status(400).send({status:false, message:" Please, enter email id and password " })
            
            
            let user = await userModel.findOne({email:email, password:password})
            
            if(!user)  return res.status(401).send({status:false, message:" No user found" })
            
            let token = jwt.sign(
                {

                    userId:user._id.toString(),
                    iat:Math.floor(Date.now()),
                    exp:Math.floor(Date.now())+10*60*60,
                    groupNo:"23"
                    
                },
                "secretKeyForgroup23"
            )

            let finalData = { token: token, 
                            userId:user._id.toString(),
                            iat: (Math.floor(Date.now())),
                            exp:new Date (Math.floor(Date.now())+10*60*60)
                            }

            res.status(200).send({status:true,meessage:"success", data:finalData} )
            
            
        }else{
            res.status(400).send({status:false, message:"body can't be empty"})
        }
        
        
    } catch (error) {
        res.status(500).send({ status: false, err: error.message })
    }
    
}

module.exports.login = login

module.exports.registerUser = registerUser