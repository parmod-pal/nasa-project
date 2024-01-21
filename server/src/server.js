const http = require('http');

const moongose = require('mongoose');

const app = require('./app');

const { loadsPlanetData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:if6alwwBN0vArDEf@nasa.1kagxpg.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

moongose.connection.once('open',()=>{
    console.log('MongoDB connection is ready');
});
moongose.connection.on('error',(err)=>{
    console.error(err)
})

async function startServer(){
    await moongose.connect(MONGO_URL);
    await loadsPlanetData();
    server.listen(PORT,()=>{
        console.log('Listening on port :', PORT);
    });
}

startServer();

