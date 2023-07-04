const { Schema, model} = require('mongoose');


const taskListSchema = new Schema({
        user: {
        type: Schema.Types.ObjectId, 
        ref: "users"
    },
        content: {
        type:String,
        required: true,
    },
        complete: {
        type: Boolean,
        default: false,
    },
        completeAt: {
        type: Date,
    }
    },
    {
        timestamps: true

    });

    //now export the model 
    const taskList = model("taskList", taskListSchema);
    module.exports = taskList;

