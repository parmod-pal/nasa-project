const axios = require('axios');
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FlGHT_NUMBER = 100;

async function getAllLaunches(skip,limit){
  return await launchesDB
  .find({},{'_id': 0,'__v': 0 })
  .sort( { "flightNumber": 1 } )
  .skip(skip)
  .limit(limit);
}

async function findLaunch(filter){
  return await launchesDB
  .findOne(filter);
}

async function existWithLaunchId(launchId){
  return await findLaunch({
    flightNumber : launchId
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
  const planet = await planets.findOne({
    'keplerName' : launch.target
  });

  if(!planet){
    throw new Error(`${launch.target} No matching planet found`)
  }
  const newFlightNumber = await getLastestFlightNumber() + 1;
  const newLaunch = Object.assign(launch,{
    success : true,
    upcoming : true,
    customers : ['Zero to Master','NASA'],
    flightNumber : newFlightNumber
  });
  await saveLaunch(newLaunch);

}

async function loadLaunchesData(){
  const checkExsitingLauch =  await findLaunch({
    flightNumber : 1,
    mission : 'FalconSat',
    rocket : 'Falcon 1'
  });

  if(checkExsitingLauch){
    console.log('SpaceX Launch data already exists.');
    return;
  }
  await loadSpaceXData();

}

async function loadSpaceXData(){
  console.log('Downloading Launch data...');

  const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

  const spaceXApiData =  await axios.post(SPACEX_API_URL,{
    options: {
      pagination:false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if( spaceXApiData.status !=200){
    console.log('Problem in downloading SpaceX Api Data.')
    throw new Error('Failed to download data SpaceX Api Aata')

  }

  const spacexLaunchData = spaceXApiData.data.docs;

  for(const spacexLaunch of spacexLaunchData){
    const payloads = spacexLaunch['payloads'];
    const customers = payloads.flatMap((payload)=>{
      return payload['customers'];
    })
    const launch = {
      flightNumber : spacexLaunch['flight_number'],
      mission : spacexLaunch['name'],
      rocket : spacexLaunch['rocket']['name'],
      launchDate : spacexLaunch['date_local'],      
      upcoming : spacexLaunch['upcoming'],
      success : spacexLaunch['success'],
      customers,

    };
    await saveLaunch(launch);
  }

}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existWithLaunchId,
  abortLaunchId
}