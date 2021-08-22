const express = require('express');
const Task = require('./models/task');
require('./db/mongoose')
const User = require('./models/user')

const app = express();

const port = process.env.PORT

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server started' + port)
})