const mongoose = require('mongoose');


const taskSchema = mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
}, {
    timestamps:true
} 

)


const Task = mongoose.model('Task', taskSchema)

module.exports = Task;