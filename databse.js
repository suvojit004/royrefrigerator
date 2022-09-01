const mongoose = require('mongoose');
if(process.env.NODE_ENV !=="production"){
  require('dotenv').config();
}
async function main() {
  await mongoose.connect('mongodb+srv://'+process.env.M_USER_NAME+':'+process.env.M_PASSWORD+'@cluster0.xjezkib.mongodb.net/?retryWrites=true&w=majority');
}
main().catch(err => console.log(err,process.env.M_USER_NAME));
const customer = new mongoose.Schema(
    {
      name:{type: String, required:true},
      number:{type:String, required:true},
      email:{type:String, required:true},
      type:{type:String, required:true},
      problem:{type:String, required:true},
      d_no:{type:Number},
      add:{type:String},
      status:{type:String, enum:['suc','pen','new'], default:'new'},
      date: { type: Date, default: Date.now}
    });
const testimonial= new mongoose.Schema({
    title:{type: String, required: true},
    description:{type: String, required: true},
});
const essential=new mongoose.Schema({
    picture:{type: String, required: true},
    apicture:{type: String, required: true},
    about:{type: String, default:" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit fugit soluta animi maxime inventore et reprehenderit tempore. Numquam neque quam, accusamus temporibus consectetur nam ullam eum, omnis tenetur nemo nostrum!"},
    password:{type: String, required:true}
});


 const Customer= mongoose.model('customer', customer);
 const Testimonial= mongoose.model('testimonial', testimonial);
 const Essential= mongoose.model('essential', essential);
 





module.exports=[Customer,Testimonial,Essential];