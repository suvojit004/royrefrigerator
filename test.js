const dateTime = require('get-date');
const mongoose = require('mongoose');
const [Customer,Testimonial,Essential]= require('./databse.js');
const a=async function(){
    const currentDate=Number(dateTime().toString().slice(0,2));
    const data=await Customer.find({}).then(data=>data)
        data.forEach(async element=>{
          let d_date=Number(element.date.toString().slice(8, 11));
          console.log(currentDate,d_date)
          if(currentDate!==d_date){
            element.status='pen'
            await element.save();    
          }
        }) 
}
a();
console.log(dateTime().toString().slice(0,2));

