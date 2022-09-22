const { isObjectIdOrHexString } = require("mongoose")
const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
const isValid = require("../validate/validator")

const emailValidation = function (email) {
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
}

const passwordValidation = function (password) {
    let regexForPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regexForPassword.test(password)
}

//********************************** user register start ****************************************************************************** */

const registerUser = async function (req, res) {
    try {
        let data = req.body;
        // if(!data) return res.status(400).send({status: false, message: "body can not be empty"})

        let mandate = isValid.mandatory(data)
        if (mandate) {
            return res.status(400).send({ status: false, message: mandate });
        }

        let title = isValid.isValidTitle(data.title)
        if (title) {
            return res.status(400).send({ status: false, message: title });
        }

        let name = isValid.isValidName(data.name)
        if (name) {
            return res.status(400).send({ status: false, message: name });
        }


        let phone = isValid.isValidPhone(data.phone)
        if (phone) {
            return res.status(400).send({ status: false, message: phone });
        }
        const isUniquePhone = await userModel.findOne({ phone: data.phone })
        if (isUniquePhone) return res.status(400).send({ status: false, message: "Phone Number is already present" })

        let email = isValid.emailValidation(data.email)
        if (email) {
            return res.status(400).send({ status: false, message: "Please, enter valid email" })
        }
        const isUniqueEmail = await userModel.findOne({ email: data.email })
        if (isUniqueEmail) return res.status(400).send({ status: false, message: "Email is already present" })

        let password = isValid.passwordValidation(data.password)
        if (!password) return res.status(400).send({ status: false, message: "Please, enter valid password" })





        //=============================== CREATING ==========================================
        if (req.body && Object.keys(req.body).length > 0) {
            let user = await userModel.create(req.body);
            return res.status(201).send({ status: true, message: 'Success', data: user })
        } else {
            return res.status(400).send({ status: false, message: "Request must contain valid Body" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//*********************************** user register end ********************************************************************** */



//************************************************ login  start ********************************************************************** */
const login = async function (req, res) {
    try {

        if (req.body && Object.keys(req.body) > 0) {

            let { email, password } = req.body

            if (!email || !password) return res.status(400).send({ status: false, msg: " plz enter valid email id and password " })

            let user = await userModel.find({ email: email, password: password })

            if (!user) return res.status(401).send({ status: false, msg: " No data found" })

            let token = jwt.sign(
                {
                    userId: user._id.toString(),
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
                    groupNo: "23"

                }, "secretKeyForgroup23")

            res.status(200).send({ status: true, meessage: "success", data: token })

        } else {
            res.status(400).send({ status: false, msg: "body can't be empty" })
        }

    } catch (error) {
        res.status(500).send({ status: false, err: error.message })
    }
    
}

//*********************************************** login end ************************************************************** */

module.exports.login = login
module.exports.registerUser = registerUser
