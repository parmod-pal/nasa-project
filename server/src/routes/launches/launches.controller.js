const { getAllLaunches,scheduleNewLaunch,existWithLaunchId,abortLaunchId } = require('../../models/launches.model');

async function httpGetAllLaunches(req,res){
    return res.status(200).json(await getAllLaunches());
}
async function httpAddnewLaunch(req,res){
    launch = req.body;
    launch.launchDate = new Date(launch.launchDate);

    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
        return res.status(400).json({
            "error": "Please enter correct launch details."
        });
    }
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            "error": "Please enter correct launch date."
        });

    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    if(!existWithLaunchId(launchId)){
        return res.status(404).json({
            error : 'Launch not found'
        })
    }
    const aborted = abortLaunchId(launchId);
    return res.status(200).json(aborted);

}

module.exports = {
    httpGetAllLaunches,
    httpAddnewLaunch,
    httpAbortLaunch,
    
}