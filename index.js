
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname, 'FMC-data');
var csvOut = new Object();

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    // process all files using forEach

    files.forEach(function (file) {
      var filename = directoryPath + '/' + file;
      readCsv(filename, csvOut); 
      writeCsv(csvOut);
    });
});

// read the csv file
function readCsv(filename, csvOut) {

  const csv = require('csv-parser')
  const fs = require('fs')
  const results = [];
  console.log('filename ' + filename)
  fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
    console.log(results);
    var csvIn = results[0];
    var d = Date();
    csvOut.timestamp = d.substring(0,24);
    csvOut.submission_id = csvIn.submission_id;
    csvOut.court = csvIn.court;
    csvOut.user_type = csvIn.user_type;
   
    if (csvIn.hasOwnProperty('another_reason')) {
      console.log('another ')
      csvOut.another_reason = csvIn.another_reason;
      }
    else {
      csvOut.another_reason = "";
      }

    if (csvIn.hasOwnProperty('facilities')) {
      console.log('facilities ')
      csvOut.facilities = csvIn.facilities;
      }
    else {
      console.log('no facilities ')

      csvOut.facilities = "";
      }

    if (csvIn.hasOwnProperty('staff'))  {
      console.log('staff ')
      csvOut.staff = csvIn.staff;
      }
    else {
      csvOut.staff = "";
      }

    if (csvIn.hasOwnProperty('security_and_safety')) {
      console.log('safety ')
      csvOut.security_and_safety = csvIn.security_and_safety;
      }
    else {
      csvOut.security_and_safety = "";
      }

    if (csvIn.hasOwnProperty('information_and_guidance')) {
      console.log('info ')
      csvOut.information_and_guidance = csvIn.information_and_guidance;
      }
    else {
      csvOut.information_and_guidance = "";
      }

    if (csvIn.hasOwnProperty('something_else'))  {
      console.log('something ')
      csvOut.something_else = csvIn.something_else;
      }
    else {
      csvOut.something_else = "";
      }

    csvOut.what_happened = csvIn.what_happened;
    csvOut.want_reply = csvIn.want_reply;

    if (csvIn.hasOwnProperty('email_address'))  {
      console.log('email_address ')
      csvOut.email_address = csvIn.email_address;
      }
    else {
      csvOut.email_address = "";
    }

  str = JSON.stringify(csvOut);
  console.log('csvOut ' + str);
  console.log('csvOut ' + csvOut);

  });
} // end csvRead

function writeCsv(csvOut) { 

// write to court file

  const pathnameCourt = path.join(__dirname, csvOut.court, '-fmc-responses.csv');
  console.log('pathnameCourt ' + pathnameCourt );
  const createCsvWriterCourt = require('csv-writer').createObjectCsvWriter;
  const csvWriterCourt = createCsvWriterCourt({
    path: pathnameCourt,
    header: [
    'timestamp',
    'submission_id', 
    'court', 
    'user_type',
    'another_reason',
    'facilities',
    'staff',
    'security_and_safety',
    'information_and_guidance',
    'something_else',
    'what_happened',
    'want_reply',
    'email_address'],
    append: 'true'
    });
  const recordsCourt = [
   csvOut
  ];
   
  csvWriterCourt.writeRecords(recordsCourt)       // returns a promise
    .then(() => {
        console.log('...Done');
   });

// write to central file
  var pathname = 'fmc-responses.csv'
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: pathname,
    header: [
    'timestamp',
    'submission_id', 
    'court', 
    'user_type',
    'another_reason',
    'facilities',
    'staff',
    'security_and_safety',
    'information_and_guidance',
    'something_else',
    'what_happened',
    'want_reply',
    'email_address'],
    append: 'true'
    });
  const records = [
   csvOut
  ];
   
  csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
   });
} // end writeCsv  

