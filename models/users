const {Schema, model} = require("mongoose");
const userSchema = new Schema (
    {
        email: {
            type: String, 
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    }, 
        {
            timestamps: true
        }
);
        // create amodel user
        // created model uses user schema
        const users = model("user", userSchema);
        //export the model
        module.exports = users;
        