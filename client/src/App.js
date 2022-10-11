import './App.css';
import React from 'react';
import axios from 'axios'
import * as XLSX from 'xlsx'
function App() {
const [ft , setFt]=React.useState();
const [fileName ,setFileName]=React.useState();
const [res , setRes]=React.useState();
const [workbook1,setWorkbook1]=React.useState()
const [fontcolor,setFontcolor]=React.useState()
const [disable ,setDisable]=React.useState(true)
var workbook ;
let worksheets = {};

const get =async(e)=>{
  if(ft!==undefined && ft!==""){
    setDisable(false)
  }
const [file] = e.target.files;
const reader = new FileReader();
// console.log(file.name)
setFileName(file.name)
reader.onload = async (evt) => {
  const bstr = evt.target.result; 
  workbook = XLSX.read(bstr, { type: "binary" });  
  setWorkbook1(XLSX.read(bstr, { type: "binary" }))
 console.log(workbook1)
for (let i=0;i<=workbook.SheetNames.length-1;i++) {
worksheets[workbook.SheetNames[i]] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);  

}
};
reader.readAsBinaryString(file); 
}
const onTextChange=(e)=>{  
setFt(e.target.value)
if(workbook1!==undefined){
  setDisable(false)
}

}

const top_up =async()=>{
  
  if(workbook1 !== undefined && ft !=="" && ft!== undefined){
    setRes(" * Requested Top up is in progress....please wait")
    setFontcolor("Green")
    await axios.post('http://10.44.244.33:5000/',{workbook1,ft}).then(function (response) {
     if(response.data.unsuccessful.length!==0){
      const file = `Unsuccessful-${fileName}`;
 
      const ws= XLSX.utils.json_to_sheet(response.data.unsuccessful);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'error');
    
      XLSX.writeFile(wb, file);
       setRes(` * Please check the Unsuccessful-${fileName} File downloaded to check failed topups and try again`)
       setFontcolor("red")
     }else{
       setRes(" * Top up Successfull!")
       setFontcolor("green")
     }

  
  })
  }else{
    setRes("* please upload excel file and provide FT Number")
    setFontcolor("red")
    // console.log("Please Upload excell file")
  }
  
}
return (
      
<div className='container'>
<div className='header' children>
<h2 style={{color:"lightgrey",fontSize:"30px",paddingLeft:"30%",paddingTop:20}}> BULK Top Up</h2>
</div>
<h5 className='info' style={{color:fontcolor}}>{res}</h5>
<div className='form'>

<input className='excel' type="text" value={fileName} disabled />
<label className="button" >

<input type="file" onChange={get}/>
Upload Excel File

</label>
<input type="text" className='ft_input' placeholder=' FT Number' onChange={onTextChange} ></input>
<button className='button1' disabled={disable} onClick={()=>top_up()}>TOP UP</button>

</div>

<table id='students'>
              <tbody>
                {/* <tr>{renderTableHeader()}</tr> */}
                
                {/* {renderTableData()} */}
              </tbody>
          </table>
</div>
);
}

export default App;
