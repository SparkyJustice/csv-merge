
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
var results = [];
// var csvIn = new Object();
const csvToJson = require('csvtojson')

function main () {

  //joining path of directory where the csv files are held

  const directoryPath = path.join(__dirname, 'FMC-data');

  let fileLocation = directoryPath + '/6cf582ef-f6f2-4f35-ab84-e5308056c7a3-answers.csv';
  // read the csv file

  let csvIn = createArrayFromCsv(fileLocation, function (error, csvIn) {
    if (error) {
      return console.log('cannot createArrayFromCsv: ' + error);
    };
  });

}; 


async function createArrayFromCsv(fileLocation) {
  console.log('**************** createArrayFromCsv ************')
  await csvToJson().fromFile(fileLocation);
};// end createArrayFromCsv

main (function (error, retval){
  if (error) {
    return console.log('cannot readCsv: ' + error);
  };
}); 