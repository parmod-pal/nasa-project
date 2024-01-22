const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FlGHT_NUMBER = 100;


latestFlightNumber = 100;
const launch = {
  flightNumber : 100,
  mission : 'Kepler Exploration X',
  rocket : 'Explorer IS1',
  launchDate : new Date ('December 27, 2030'),
  target : 'Kepler-62 f',
  customers : ['ZTM','NASA'],
  upcoming : true,
  success : true
};

saveLaunch(launch);



async function getAllLaunches(){
return await launchesDB.find({},{'_id': 0,'__v': 0 })
}

async function existWithLaunchId(launchId){
  return await launchesDB
  .findOne({
    'flightNumber' : launchId
  });
}
  

async function abortLaunchId(launchId){  
  const aborted =  await launchesDB.updateOne({
    'flightNumber' : launchId
  },{
    'upcoming' : false,
    'success' : false
  });
  return aborted.acknowledged === true && aborted.modifiedCount === 1 ;

}

async function saveLaunch(launch){
  const planet = await planets.findOne({
    'keplerName' : launch.target
  });

  if(!planet){
    throw new Error(`${launch.target} No matching planet found`)
  }

  try{
    await launchesDB.findOneAndUpdate({
      flightNumber : launch.flightNumber
    },launch,{
      upsert : true
    })

  } catch(err){
    console.log(`Error:${err}`)
  }
}

async function getLastestFlightNumber(){
  const latestLaunch = await launchesDB
  .findOne({})
  .sort('-flightNumber');

  if(!latestLaunch){
    return DEFAULT_FlGHT_NUMBER;
  }

  return latestLaunch.flightNumber;

}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLastestFlightNumber() + 1;
  const newLaunch = Object.assign(launch,{
    success : true,
    upcoming : true,
    customers : ['Zero to Master','NASA'],
    flightNumber : newFlightNumber
  });
  await saveLaunch(newLaunch);

}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existWithLaunchId,
  abortLaunchId
}