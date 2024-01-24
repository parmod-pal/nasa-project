const http = require('http');

//require('dotenv').config();

const app = require('./app');

const { mongoose, MONGO_URL } = require('./services/mongo');

const { loadsPlanetData } = require('./models/planets.model');

const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadsPlanetData();
    await loadLaunchesData();
    server.listen(PORT,()=>{
        console.log('Listening on port :', PORT);
    });
}

startServer();

