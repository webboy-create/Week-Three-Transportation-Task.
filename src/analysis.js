const { getTrips , getDriver} = require('api');


/**

* This function should return the trip data analysis

*

* Question 3

* @returns {any} Trip data analysis

*/

async function analysis() {

  // Your code goes here

  const _driverTrips = await getTrips()

  let no1DriverID = _driverTrips[0].driverID

  let output = {

    "noOfCashTrips": 0,
    "noOfNonCashTrips": 0,
    "billedTotal": 0,
    "cashBilledTotal": 0,
    "nonCashBilledTotal": 0,
    "noOfDriversWithMoreThanOneVehicle": 0,
    "mostTripsByDriver": {},
    "highestEarningDriver": {}

  }
  
    
  function changeBill(billsString){

    let removedComma = billsString.toString().replaceAll(',', '')

    return removedComma

  }

  let tripDriversID = []
  let cashTrips = 0
  let nonCashTrips = 0
  let cashTotal = 0
  let nonCashTotal = 0
  let noOfDriversWithManyVehicles = 0
  let driverDetails = []

  for(const trip of _driverTrips){

    if(trip.isCash){

      cashTrips++

      cashTotal += parseInt(changeBill(trip.billedAmount))
      //cashTotal = cashTotal + parseInt(changeBill(trip.billedAmount))

    }else{

      nonCashTrips++

      nonCashTotal += parseInt(changeBill(trip.billedAmount))
      //nonCashTotal = nonCashTotal + parseInt(changeBill(trip.billedAmount))

    }


    tripDriversID.push(trip.driverID)

  }  
  
  
  
  const allDriversID = [...new Set(tripDriversID)]

  
  
  for(const driverID of allDriversID){

    let driverDetail = {

      id: driverID,
      name: '',
      email: '',
      phone: '',
      noOfTrips: getDriverTrips(driverID),
      totalAmountEarned: getTotalAmount(driverID),

    }

    try{

      let presentDriver = await getDriver(driverID)

      if(presentDriver.vehicleID.length > 1){

        noOfDriversWithManyVehicles++

      }

      driverDetail.name = presentDriver.name
      driverDetail.email = presentDriver.email
      driverDetail.phone = presentDriver.phone

    }

    catch{

      driverDetail.name = null
      driverDetail.email = null
      driverDetail.phone = null

    }

    driverDetails.push(driverDetail)

  }

  
  
  function getDriverTrips(id){

    return tripDriversID.filter(d => d === id).length

  }

  function getTotalAmount(id){

    let total = 0

    for(const trip of _driverTrips){

      if(trip.driverID === id){

        total += parseInt(changeBill(trip.billedAmount))
       // total = total + parseInt(changeBill(trip.billedAmount))

      }

    }

    return Number(total.toFixed(2))

  }

  
  
  
  
  
  
  function highestTrips(){

    let highestTripsByDriver

    let highestTripsNum = 0

    for(const driver of driverDetails){

      if(driver.noOfTrips > highestTripsNum){
        highestTripsByDriver = driver
        highestTripsNum = driver.noOfTrips

      }

    }

    return {

      name: highestTripsByDriver.name,
      email: highestTripsByDriver.email,
      phone: highestTripsByDriver.phone,
      noOfTrips: highestTripsNum,
      totalAmountEarned : highestTripsByDriver.totalAmountEarned

    }



  }








  function highestEarner(){

    let topEarningDriver

    let highestAmount = 0

    for(const driver of driverDetails){

      if(driver.totalAmountEarned > highestAmount){

        topEarningDriver = driver

        highestAmount = driver.totalAmountEarned

      }

    }

    return {

      name: topEarningDriver.name,

      email: topEarningDriver.email,

      phone: topEarningDriver.phone,

      noOfTrips: topEarningDriver.noOfTrips,

      totalAmountEarned : highestAmount

    }




  }


  
  
  
  output.noOfCashTrips = cashTrips
  output.noOfNonCashTrips = nonCashTrips
  output.cashBilledTotal = Number(cashTotal.toFixed(2))
  output.nonCashBilledTotal = Number(nonCashTotal.toFixed(2))
  output.billedTotal = Number((output.cashBilledTotal + output.nonCashBilledTotal).toFixed(2))
  output.noOfDriversWithMoreThanOneVehicle = noOfDriversWithManyVehicles
  output.highestTripsByDriver = highestTrips()
  output.highestEarningDriver = highestEarner()
  console.log(output)
  return output

}

analysis()

module.exports = analysis;