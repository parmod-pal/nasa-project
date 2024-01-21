const launchesDB = require('./launches.mongo');
const launches = new Map();
latestFlightNumber = 100;
const launch = {
  flightNumber : 100,
  mission : 'Kepler Exploration X',
  rocket : 'Explorer IS1',
  launchDate : new Date ('December 27, 2030'),
  target : 'Kepler-442 b',
  customers : ['ZTM','NASA'],
  upcoming : true,
  success : true
};
saveLaunch(launch);



function getAllLaunches(){
return Array.from(launches.values());
}

function existWithLaunchId(launchId){
  return launches.has(launchId);
}

function addNewLaunch(launch){
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch,{
      success : true,
      upcoming : true,
      customers : ['Zero to Master','NASA'],
      flightNumber : latestFlightNumber,

    })
  );
}

function abortLaunchId(launchId){
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;

}
async function saveLaunch(launch){
  try{
    await launchesDB.updateOne({
      flightNumber : launch.flightNumber
    },launch,{
      upsert : true
    })

  } catch(err){
    console.log(`Error:${err}`)
  }
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existWithLaunchId,
  abortLaunchId
}