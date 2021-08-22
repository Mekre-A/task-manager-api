const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASECONN, {
    useNewUrlParser:true,
    useCreateIndex:true
})
