const mongoose  = require('mongoose');


const mongoURI = 'mongodb+srv://ANsari1996:1996Ansari@cluster0.rekllej.mongodb.net/Thor?retryWrites=true&w=majority'

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo successfully")
    })
}
module.exports = connectToMongo;