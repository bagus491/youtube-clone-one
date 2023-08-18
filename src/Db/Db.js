const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/cloneyt'



mongoose.connect(url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
}) .then((error,result) => {
        console.log(`success connect db`)
    })