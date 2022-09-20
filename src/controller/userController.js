const { isObjectIdOrHexString } = require("mongoose")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const emailValidation = function(email){
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
}

const passwordValidation = function(password){
    let regexForPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regexForPassword.test(password)
}


const login = async function (req, res) {
    try {

        if(req.body && Object.keys(req.body) > 0){

            let { email, password} = req.body


//********************************************  additinal work   ******************************************************* */
            // if(!email) return res.status(400).send({status:false, msg:" plz enter email" })

            // if(!emailValidation(email)) return res.status(400).send({status:false, msg:" plz enter valid email" })

            // if(!password) return res.status(400).send({status:false, msg:" plz enter password" })

            // if(!passwordValidation(password)) return res.status(400).send({status:false, msg: "plz enter valid password"})

//******************************************************************************************************************************* */ 

         if(!email || !password ) return res.status(400).send({status:false, msg:" plz enter valid email id and password " })


            let user = await userModel.find({email:email, password:password})

            if(!user)  return res.status(401).send({status:false, msg:" No data found" })

            let token = jwt.sign(
                {

                    userId:user._id.toString(),
                    iat:Math.floor(Date.now()/1000),
                    exp:Math.floor(Date.now()/1000)+10*60*60,
                    groupNo:"23"

                },
                "secretKeyForgroup23"
            )

            res.status(200).send({status:true,meessage:"success", data:token} )


        }else{
            res.status(400).send({status:false, msg:"body can't be empty"})
        }


    } catch (error) {
        res.status(500).send({ status: false, err: error.message })
    }

}

module.exports.login = login