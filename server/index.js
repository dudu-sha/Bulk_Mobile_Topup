var express = require('express');
var axios = require('axios')
 require('dotenv').config()
var cors = require('cors');
const XLSX = require("xlsx");
const bodyParser = require('body-parser');
var app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/', async  function (req, res) {
  var response= {
    Topups:[],
    unsuccessful : []
  }
  

let worksheets = {};
for (const sheetName of req.body.workbook1.SheetNames) {
    worksheets[sheetName] = XLSX.utils.sheet_to_json(req.body.workbook1.Sheets[sheetName]);    
    
}

for(const sheetName of req.body.workbook1.SheetNames){
  let quantity=0;
// console.log(sheetName)
 for( i=0;i<=worksheets[sheetName].length-1;i++){
  
   if(worksheets[sheetName][i].Mobile!==undefined && worksheets[sheetName][i].Total!==undefined){
    // console.log(worksheets[sheetName][i].Mobile)
    // console.log(worksheets[sheetName][i].Total)
           const body = {
      "Password": process.env.PASSWORD,
      "Username": process.env.USER_NAME,
      "MSISDN2": worksheets[sheetName][i].Mobile ,		
      "AMOUNT":worksheets[sheetName][i].Total,
      "FT": req.body.ft 
  };
  headers={

  }
   await axios.post(process.env.URL,body, { headers })
    .then(function (response) {
    // console.log(i+" phone :"+worksheets.Sheet1[i].phone + "       amount :"+worksheets.Sheet1[i].amount + "  response "+ JSON.stringify(response.data))
      // console.log("RES"+response.data.split(`"`)[3]);
      quantity++;
    })
    .catch(function (error) {
    response.unsuccessful.push({"Mobile":worksheets[sheetName][i].Mobile,"Total":worksheets[sheetName][i].Total})
      console.log("error is "+error);
    });
    
   }else{
    console.log("undefined :: "+worksheets[sheetName][i].Total)
   }
 
 }
 
 response.Topups.push({"Sheet":sheetName , "Amount":quantity})
}
console.log(response.Topups)
res.send(response);
});


 app.listen(5000, function () {
    console.log('Node server is running..');
});