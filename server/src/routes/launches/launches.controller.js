const { getAllLaunches,addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req,res){
    return res.status(200).json(getAllLaunches());
}
function httAddnewLaunch(req,res){
    launch = req.body;
    launch.launchDate = new Date(launch.launchDate);

    if(launch.mission.length == 0 || launch.rocket.length == 0 || launch.destination.length == 0 || launch.launchDate.length == 0){
        return res.status(400).json({
            "error": "Please enter correct launch details."
        });
    }
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            "error": "Please enter correct launch date."
        });

    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httAddnewLaunch
}