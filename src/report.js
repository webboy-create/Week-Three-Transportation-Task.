

const { getTrips, getDriver, getVehicle } = require('api');


/**

* This function should return the data for drivers in the specified format

*

* Question 4

*

* @returns {any} Driver report data

*/

async function myDriverReport() {

  // Your code goes here

  const driverTrips = await getTrips();
  const removeComma = (amt) => parseInt(amt.toString().replace(',', ''));
  const driverLog = {};
  const drivers_List = [];


  for (const trip of driverTrips) {

    const tripInfo = {
      user: trip.user.name,

      created: trip.created,

      pickup: trip.pickup,

      destination: trip.destination,

      billed: trip.billedAmount,

      isCash: trip.isCash

    };

    
    
    
    
    
    if (!Object.keys(driverLog).includes(trip.driverID)) {

      const driverInfo = await fetchDriver(trip.driverID);    /**this line greatly slows down my code */

     
     
     
      const tripDriver = {

        fullName: driverInfo.name,    /** */

        id: trip.driverID,

        phone: driverInfo.phone,    /** */

        noOfVehicles: driverInfo.vehicleID.length,   /** */

        vehicles: driverInfo.vehicles,    /** */

        noOfCashTrips: trip.isCash ? 1 : 0, //ternary operator

        noOfNonCashTrips: trip.isCash ? 0 : 1,  //ternary operator

        totalCashAmount: trip.isCash ? removeComma(trip.billedAmount) : 0,

        totalNonCashAmount: trip.isCash ? 0 : removeComma(trip.billedAmount),

        driverTrips: [tripInfo]

      };

      drivers_List.push(tripDriver);

      driverLog[trip.driverID] = tripDriver;

    } else {

     
     
      if (trip.isCash) {
        driverLog[trip.driverID].noOfCashTrips++;
        driverLog[trip.driverID].totalCashAmount += removeComma(trip.billedAmount);
      } else {

        driverLog[trip.driverID].noOfNonCashTrips++;
        driverLog[trip.driverID].totalNonCashAmount += removeComma(trip.billedAmount);
      }
      driverLog[trip.driverID].driverTrips.push(tripInfo);

    }
    driverLog[trip.driverID].totalAmountEarned = driverLog[trip.driverID].totalCashAmount + driverLog[trip.driverID].totalNonCashAmount;

  }

  console.log(driverLog);

  return drivers_List;




 
 
 
 
 
 
 
 
  /**Returns an object containing driver details, including vehicles */

  async function fetchDriver(driverID) {

    let driverInfo;

    try {

      driverInfo = await getDriver(driverID);  // this line greatly slows down my code

      driverInfo.vehicles = await fetchVehicles();

    }

    catch (error) {

     
     
     
     
     
      driverInfo = {

        vehicleID: [],

        name: '',

        gender: '',

        agent: '',

        email: '',

        phone: '',

        DOB: '',

        address: ''

      };

    }

    return driverInfo;




    async function fetchVehicles() {

      const vehicles = [];

      for (const vehicleID of driverInfo.vehicleID) {

        vehicles.push(await getVehicle(vehicleID));

      }

      return vehicles;

    }

  }

}




myDriverReport();

module.exports = myDriverReport;
