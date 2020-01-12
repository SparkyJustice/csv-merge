
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
// const csv = require('csv-parser');
// const ExcelJS = require('exceljs');
// var results = [];
let csvIn = new Object();
const csvToJson = require('csvtojson')
var dataOut = new Object();

function main () {

  //joining path of directory where the csv files are held

  const directoryPath = path.join(__dirname, 'FMC-data');

  let fileLocation = directoryPath + '/6cf582ef-f6f2-4f35-ab84-e5308056c7a3-answers.csv';
  // read the csv file

  csvToJson()
  .fromFile(fileLocation)
  .then((csvIn)=>{
//    csvIn = jsonObj;
    console.log('csvIn csvToJson ' + JSON.stringify(csvIn))
    writeRow(csvIn);
  })

  console.log('csvIn main ' + JSON.stringify(csvIn));
  console.log(csvIn);

};
function writeRow(csvIn) {
  console.log('**************** writeRow ************')

  console.log('csvIn writeRow' + JSON.stringify(csvIn));
  console.log(csvIn);
  console.log('csvIn[0].submission_at writeRow ' + csvIn[0].submission_at);


  var dateTime = csvIn[0].submission_at.replace("T"," ");
  dataOut.timestamp = dateTime;
  dataOut.submission_id = csvIn[0].submission_id;
  dataOut.court = csvIn[0].court;
   console.log('dataOut.submission_id ' + dataOut.submission_id);
   console.log('dataOut.court ' + dataOut.court);
  console.log('csvIn[0].court ' + csvIn[0].court);
  console.log('csvIn[0].submission_id ' + csvIn[0].submission_id);

  dataOut.user_type = csvIn[0].user_type;

  if (csvIn[0].hasOwnProperty('another_reason')) {
//      console.log('another ')
    dataOut.another_reason = csvIn[0].another_reason;
    }
  else {
    dataOut.another_reason = "";
    }

  if (csvIn[0].hasOwnProperty('facilities')) {
//      console.log('facilities ')
    dataOut.facilities = csvIn[0].facilities;
    }
  else {
    dataOut.facilities = "";
    }

  if (csvIn[0].hasOwnProperty('staff'))  {
//      console.log('staff ')
    dataOut.staff = csvIn[0].staff;
    }
  else {
    dataOut.staff = "";
    }

  if (csvIn[0].hasOwnProperty('security_and_safety')) {
//      console.log('safety ')
    dataOut.security_and_safety = csvIn[0].security_and_safety;
    }
  else {
    dataOut.security_and_safety = "";
    }

  if (csvIn[0].hasOwnProperty('information_and_guidance')) {
//      console.log('info ')
    dataOut.information_and_guidance = csvIn[0].information_and_guidance;
    }
  else {
    dataOut.information_and_guidance = "";
    }

  if (csvIn[0].hasOwnProperty('something_else'))  {
//      console.log('something ')
    dataOut.something_else = csvIn[0].something_else;
    }
  else {
    dataOut.something_else = "";
    }

  dataOut.what_happened = csvIn[0].what_happened;
  dataOut.want_reply = csvIn[0].want_reply;

  if (csvIn[0].hasOwnProperty('email_address'))  {
//      console.log('email_address ')
    dataOut.email_address = csvIn[0].email_address;
    }
  else {
    dataOut.email_address = "";
  }

  str = JSON.stringify(dataOut);
  console.log('dataOut writeRow ' + str);
};

main (); 