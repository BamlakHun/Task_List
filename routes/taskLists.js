const express = require('express');
const router = express.Router();
const taskListSchema = require("../models/taskList");
const requiresAuth = require("../middleware/permissions");
const taskList = require('../models/taskList');
const validateTaskListInput = require("../validation/taskListValidator");

// @router GET/api/taskList/new
// @desc   Test the todos route
// @access public
router.get("/test", (req, res) => {
    res.send("taskLists route working");
});

// @router POST/api/taskList/new
// @desc   Create a new task
// @access Private

router.post("/new", requiresAuth, async (req, res) => {
    try {

        const {isValid, errors} = validateTaskListInput(req.body);

        if (!isValid){
            return res.status(400).json(errors);
        }

        const newTaskList = new taskList ({
            user: req.user._id,
            content: req.body.content,
            complete: false,
        });

        //save to db
        await newTaskList.save();

        return res.json(newTaskList);
        
    } catch (error) {

        console.log(error);
        return res.status(500).send(error.message);
    }
});
// @router GET/api/todos/current
// @desc   Current users tasks
// @access Private

router.get("/current", requiresAuth, async (req, res) => {
    try {
        //find the tasks for current user 
        //also do sort
        const completeTaskList = await taskList.find({
            user: req.user._id,
            complete : true,

        }).sort({completedAt: -1});

        const incompleteTaskLists = await taskList.find({
            user: req.user._id,
            complete: false,
        }).sort({createAt: -1});

        return res.json({incomplete:incompleteTaskLists, complete: completeTaskList});

    } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);        
    }

});

// @router PUT/api/:taskList/complete
// @desc   Mark as complete
// @access Private


router.put("/:taskListId/complete", requiresAuth, async(req, res) => {
    try {

        // save in db
        const task_List = await taskList.findOne({
            user: req.user._id,
            _id: req.params.taskListId,
        });
        
        // if ntn to return
        if(!task_List) {
            return res.status(404).json({error: 'Could not find TaskList'});
        }

        if (task_List.complete){
            return res.status(400).json({error: "TaskList is already complete"});
        }

        const updatedTaskList = await taskList.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.taskListId,
            },
            {
                complete: true,
                completedAt: new Date(),
            },
            {
                new: true,
            }
        );

        return res.json(updatedTaskList);

    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    
        
    }
});

// @router PUT/api/:taskList/incomplete
// @desc   Mark as incomplete
// @access Private

router.put("/:taskListId/incomplete", requiresAuth, async(req, res) => {
    try {

        // save in db
        const task_List = await taskList.findOne({
            user: req.user._id,
            _id: req.params.taskListId,
        });
        
        // if ntn to return
        if(!task_List) {
            return res.status(404).json({error: 'Could not find TaskList'});
        }

        if(!task_List.complete){
            return res.status(400).json({error: "Tasks are already incomplete"});
        }

      
        const updatedTaskList = await taskList.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.taskListId,
            },
            {
                complete: false,
                completedAt: new Date(),
            },
            {
                new: true,
            }
        );

        return res.json(updatedTaskList);

    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    
        
    }
});

// @router PUT/api/:taskListId/incomplete
// @desc   Mark as incomplete
// @access Private

router.put("/:taskListId", requiresAuth, async (req, res) => {

    try{
        const task_List = await taskList.findOne({
            user: req.user._id,
            _id: req.params.taskListId,
        });

    if(!task_List) {
        return res.status(404).json({error: 'TaskList not found'});
    }

    const { isValid, errors } = validateTaskListInput (req.body);

    if (!isValid){
        return res.status(400).json({errors});
    }

    const updatedTaskList = await taskList.findOneAndUpdate(
        {
            user: req.user._id,
            _id: req.params.taskListId,
        },
        {
           content: req.body.content
        },
        {
            new: true,
        }
    );


return res.json(updatedTaskList);
}
catch (err) {
console.log(err);
return res.status(500).send(err.message);

}
});

// @router Delete/api/taskList/:taskList
// @desc   Delete a atask
// @access Private

router.delete("/:taskListId", requiresAuth, async (req, res) => {
    try{
        const task_List = await taskList.findOne({
            user: req.user._id,
            _id: req.params.taskListId,
        });

        if(!task_List) {
            return res.status(404).json({ error: "Could not find task List"});
        }
        await taskList.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.taskListId,
        })


        return res.json({success: true});
        
    } catch (err) {
      console.log(err);
      return res.status(500).send(err.message);
            
    }
    
});



module.exports = router;
