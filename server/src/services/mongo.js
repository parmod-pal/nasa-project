const mongoose = require('mongoose');
const MONGO_URL = 'mongodb+srv://nasa-api:if6alwwBN0vArDEf@nasa.1kagxpg.mongodb.net/nasa?retryWrites=true&w=majority';//process.env.MONGO_URL_CONSTANT;

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection is ready');
});

mongoose.connection.on('error',(err)=>{
    console.error(err)
});

module.exports = {
    mongoose,
    MONGO_URL
}