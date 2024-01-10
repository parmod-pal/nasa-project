const launches = new Map();
latestFlightNumber = 100;
const launch = {
  flightNumber : 100,
  mission : 'Kepler Exploration X',
  rocket : 'Explorer IS1',
  launchDate : new Date ('December 27, 2030'),
  target : 'Kepler-442 b',
  customer : ['ZTM','NASA'],
  upcoming : true,
  success : true
};

launches.set(launch.flightNumber,launch);

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

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existWithLaunchId,
  abortLaunchId
}