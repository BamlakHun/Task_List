const Validator = require('validator');
const isNull = require('./isNull');



    const validateTaskListInput = data => {

        let errors = {};

        if (isNull(data.content)){
            errors.content = "Please fillin content field";

        } else if (!Validator.isLength(data.content, {min: 1, max:300})){
         
            errors.content = "Content field is restricted to min 1 and max 300";

        }

        return {
            errors,
            isValid: isNull(errors),
        };
    };


    module.exports = validateTaskListInput;
