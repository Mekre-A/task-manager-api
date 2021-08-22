const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router();



router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
      ...req.body,
      owner:req.user._id
  })

    try {
        const tasks = await task.save();
        res.status(201).send(tasks)
    } catch (e) {
        res.status(400)
        res.send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const tasks = await Task.find({owner:req.user._id, ...match}, {} , {limit:parseInt(req.query.limit), skip:parseInt(req.query.skip), sort});
        console.log(tasks);
        res.status(200).send(tasks);
    } catch (e) {
        console.log(error);
        res.status(500).send(error);
    }

})

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id;

    try {
        console.log(req.user._id)
        const task = await Task.findOne({_id, owner:req.user._id});
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error);
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdated = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdated.includes(update))



    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates'
        })
    }
    try {
        const id = req.params.id;

        const task = await Task.findOne({_id:id, owner:req.user._id});

        if (!task) {
            return res.status(404).send()
        }

         updates.forEach((prop)=>{
            task[prop] = req.body[prop]
        })

        await task.save()

        res.send(task)

    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const user = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)

    } catch (e) {
        console.log(e)
        res.status(500).send()

    }
})

module.exports = router