const express = require('express');

const { httpGetAllLaunches,
    httAddnewLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httAddnewLaunch);

module.exports = launchesRouter;