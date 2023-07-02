const Validator = require("validator");
const isNull = require("./isNull");


const validateRegisterInput = (data) => {
    let errors = {};


    //  check email

    if (isNull(data.email)){
        errors.email = "please enter your email";

    } else if (!Validator.isEmail(data.email)){
        errors.email = "Email is invalid, please enter a valid email";
    }

    // check password

    if (isNull(data.password)){
        errors.password = "Please enter you password";

    } else if (!Validator.isLength(data.password, {min: 6, max:150})) {
        errors.password = "Password must be more than 6 charcters long";
        }

        // check name

    if (isNull(data.name)){
        errors.name = "Please enter you name";

    } else if (!Validator.isLength(data.name, {min: 2, max:30})){
        errors.name = "Name must be less than 30 charcters long";
        }

    //  check confirm password 

    if (isNull(data.confirmPassword)){
        errors.confirmPassword = "Confirm Password field cannot be empty";

    } else if (!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = "Password and Confirm Passowrd must match";
        }

        return {
            errors, 
            isValid: isNull(errors), 
        }
    };



    module.exports = validateRegisterInput;