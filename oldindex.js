const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const csvToJson = require('csvtojson')
const excelJS = require('exceljs');
var dataOut = new Object();
let csvIn = new Object();
var fileList = [];

const directoryPath = path.join(__dirname, 'FMC-data');

function main() {
  console.log('**************** main ************')
  // read all the files in the directory

  fs.readdir( directoryPath, function( error, files) {
    if ( error ) {
        return console.log("Error reading directory contents.");
    };
    for (var i=0; i<files.length; i++) {
    
      // copy the files into the fileList
      fileList.push(files[i]);
      console.log('files[i] ' + files[i])
    };
    console.log('fileList fs.readdir ' + fileList);
    console.log('fileList length ' + fileList.length);
    // call the read write handler
    processEachFile(fileList, function(error, retval) {
      if ( error ) {
        return console.log("Error processing each file.");
      };
    });

  });
};
// 
function processEachFile(fileList) {
  console.log('**************** processEachFile ************')
// for each file - call the Read, write row and write file fns 
  for (var i=0; i<fileList.length; i++) {

    let fileLocation = directoryPath + '/' + fileList[i];
    var isCsvFile = fileLocation.includes(".csv")
    console.log('fileLocation processEachFile ' + fileLocation);
    if (isCsvFile) {
      console.log('* csv file *')

      readCsv(fileLocation, function (error, csvIn) {
        if (error) {
          return console.log('cannot readCsv: ' + error);
        };
      });
    }
    else {
      console.log('* non csv file found *' + fileLocation)
    }
  };
};
// read the csv file

function readCsv(fileLocation) {
  console.log('**************** readCsv ************')
  console.log('fileLocation readCsv ' + fileLocation);

  csvToJson()
  .fromFile(fileLocation)
  .then((csvIn)=>{
    console.log('csvIn csvToJson ' + JSON.stringify(csvIn))
    writeRow(csvIn, function (error, dataOut) {
      if (error) {
      return console.log('cannot writeRow: ' + error);
      };
    });
  });

};
// end csvRead

function writeRow(csvIn) {
  console.log('**************** writeRow ************')

  console.log('csvIn writeRow' + JSON.stringify(csvIn));
  console.log(csvIn);

  var dateTime = csvIn[0].submission_at.replace(/[T,Z]/g," ");
  dataOut.timestamp = dateTime;
  dataOut.submission_id = csvIn[0].submission_id;
  dataOut.court = csvIn[0].court;
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

  const filenameCourt = path.resolve(__dirname,'FixMyCourt-' + dataOut.court + '-submissions.xlsx');
  // const courtName = dataOut.court

  initWorkbook(filenameCourt, dataOut.court)
  .then( workbook => {
    workbook.xlsx.writeFile(filenameCourt)
    .then(function() {
      console.log("all done");
    });  
  }).catch( err => { 
    console.error( err );
  });

  writeXlsx(filenameCourt, dataOut, function (error, retval) {
    if (error) {
      return console.log('cannot writeXlsx: ' + error);
    };
  });

};

function writeXlsx(filenameCourt, dataOut) {
  console.log('**************** writeXlsx ************')
  console.log('filenameCourt ' + filenameCourt );


  // write to court file
  str = JSON.stringify(dataOut);
  console.log('dataOut writeXlsx ' + str);
  //  const filenameCourt = path.join(__dirname, dataOut.court, '-fmc-responses.xlsx');
//  const createCsvWriterCourt = require('csv-writer').createObjectCsvWriter;
  var workbook = new excelJS.Workbook();
  var worksheet = workbook.getWorksheet(1);
  workbook.xlsx.readFile(filenameCourt)
  .then(function() {
    console.log('writexlsx worksheet ' + worksheet);
    worksheet.addRow(dataOut);
    worksheet.commit();

    workbook.xlsx.writeFile(filenameCourt)
    .then(() => {
      console.log("saved");
    })
    .catch((error) => {
      console.log("error", error);
    });
  });
};
// end writeXlsx

function initWorkbook (path, courtname) {
var workbook1 = new excel.Workbook();
workbook1.creator = 'HMCTS';
workbook1.lastModifiedBy = 'HMCTS';
workbook1.created = new Date();
workbook1.modified = new Date();
var sheet1 = workbook1.addWorksheet('courtName');
var reColumns=[
    {header:'Date submitted',key:'dateSubmitted'},
    {header:'User type',key:'userType'},
    {header:'Another user type',key:'anotherUserType'},
    {header:'About facilities',key:'aboutFacilities'},
    {header:'About staff',key:'aboutStaff'},
    {header:'About security and safety',key:'aboutSecuritySafety'},
    {header:'About information and guidance',key:'aboutInformationGuidance'},
    {header:'About something else',key:'aboutSomethingElse'},
    {header:'More information',key:'moreInformation'}
];
sheet1.columns = reColumns;

  var workbook = new excelJS.Workbook();
  var worksheet;
  return new Promise( function (resolve, reject ) {
      try {  
        if (fs.existsSync(path)) {
          console.log( "output exists" );
 
        } else {
          // create workbook
          console.log( "output doesn't exist" );
          workbook1.xlsx.writeFile(path).then(function() {
              console.log("xlsx file is written.");
          });
          workbook.commit()
          .then(function() {
          console.log("xlsx file is committed.");

          });
        }
      }
      catch( err ){
        reject();
      };

  });
}


console.log('**************** main is called ************')

main ();
