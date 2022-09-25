// const valid = function (value) {
//   if (typeof value == "number" || typeof value == "undefined" || typeof value == null) { return false }
//   if (typeof value == "string" && value.trim().length == 0) { return false }
//   return true
// }



const mandatory = function (data) {
    let { title, name, phone, email, password } = data;
    let error = {};
    if (!title) error.title = "Title is mandatory";
    if (!name) error.name = "Name is mandatory";
    if (!phone) error.phone = "Phone is mandatory";
    if (!email) error.email = "Email is mandatory";
    if (!password) error.password = "Password is mandatory";
    
    if (Object.keys(error).length > 0) {
      return error
    }
}

const isValidTitle = function(title) {
    if (!/^(Mr|Mrs|Miss)+$\b/.test(title)) return "Title should be in Mr|Mrs|Miss" ;
}

const isValidName = function (name) {
  
  if (!/^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){1,}$/i.test(name)) return `${name} is not a valid name`    
}

const isValidPhone = function(phone) {
  if (!/^[6-9]\d{9}$/.test(phone)) return `${phone} is not a valid phone Number`;
}
 
const emailValidation = function(email){
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return `${email} is not a valid phone Number`;
}

const passwordValidation = function(password){
  let regexForPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
  return regexForPassword.test(password)
}

module.exports = { mandatory, isValidTitle, isValidPhone, emailValidation, passwordValidation, isValidName}