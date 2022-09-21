
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
    if (!/^(Mr|Mrs|Miss)+$\b/.test(title)) return `${title} is not a valid title`;
}

const isValidPhone = function(phone) {
  if (phone.length < 10 || phone.length > 10) return `${phone} is not a valid phone Number`;
}


module.exports = {mandatory, isValidTitle, isValidPhone}