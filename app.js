if(process.env.NODE_ENV !=="production"){
  require('dotenv').config();
}
const port = process.env.PORT||3000;
const express= require('express');
const mongoose = require('mongoose');

const mongoSanitize = require('express-mongo-sanitize');

const compression = require('compression');
const dateTime = require('get-date');
const session= require('express-session');

const [Customer,Testimonial,Essential]= require('./databse.js');
const app= express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(session({secret:process.env.SECRET,resave: false,
saveUninitialized: true}));
app.use(express.urlencoded({extended: true,
  }));
app.use(mongoSanitize());
app.use(express.static('public'));

app.use(compression());

app.get('/',async (req, res) => {
  let query=req.query;
  let data =await Essential.find({}).then(data=> data);
  let tetstimonial= await Testimonial.find({}).then(data=> data);
  let src=`src=${data[0].picture}`;
  let src2=`src=${data[0].apicture}`;
  let about=data[0].about
  res.render('index', {data,src,src2,query,about, tetstimonial});
  });
app.post('/form',async(req,res)=>{
let cdata=new Customer({name:`${req.body.name}`,number:`${req.body.number}`,add:`${req.body.add}`,email:`${req.body.email}`,type:`${req.body.type}`,problem:`${req.body.problem}`,d_no:Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)});
cdata.save();
console.log(Customer);
  res.redirect(`/?a=true&d=${cdata.d_no}`);
});
app.get('/login',(req,res)=>{
res.render('partials/adminlogin');
});
app.post('/login',async(req,res)=>{
let pass=await Essential.find({}).then(data=>data);
if(req.body.password=== pass[0].password)
{
 req.session.sid=pass[0]._id;
  res.redirect('/admin');
}
res.redirect('/login');
});
app.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');

})
app.get('/admin',(req,res,next)=>{
  if(req.session.sid){
    next();
  }
  else{
    res.redirect('/login');
  }
},async (req, res) => {
  if(req.query.q==='new'){
    let data =await Customer.find({}).then(data=> data);
    let q=req.query.q;
    res.render('admin',{data: data, q:q});
  }
  else if(req.query.q==='pen'){
    let data =await Customer.find({}).then(data=> data);
    let q=req.query.q;
    res.render('admin',{data: data,q:q});}
  else if(req.query.q==='suc'){
      let data =await Customer.find({}).then(data=> data);
      let q=req.query.q;
      res.render('admin',{data: data,q:q});}
  else if(req.query.q==='adandessn'){
    let data =await Essential.find({}).then(data=> data);
    let q=req.query.q;
    res.render('admin',{data: data,q:q});}
  else if(req.query.q==='test'){
    let data =await Testimonial.find({}).then(data=> data);
    let q=req.query.q;
    res.render('admin',{data: data,q:q});}
  else{
    res.redirect('/admin?q=new');
  } 
  })  
app.post('/admin/:db',(req,res,next)=>{
  if(req.session.sid){
    next();
  }
  else{
    res.redirect('/login');
  }
},async (req,res)=>{
  if(req.params.db==='cdata')
  {
    Customer.findByIdAndUpdate(req.body.id,{status:req.body.status}).catch(e=>{throw Error(e)});
    res.redirect('/admin');
  }
  else if(req.params.db==='pen')
  {
    Customer.findByIdAndUpdate(req.body.id,{status:req.body.status}).catch(e=>{throw Error(e)});
    res.redirect('/admin?q=pen');
  }
  else if(req.params.db==='suc')
  {
    Customer.findByIdAndUpdate(req.body.id,{status:req.body.status}).catch(e=>{throw Error(e)});
    res.redirect('/admin?q=suc');
  }
  else if(req.params.db==='essen'){
    Essential.findByIdAndUpdate(req.body.id,{picture:req.body.picture,apicture:req.body.apicture,about:req.body.about}).catch(e=>{throw Error(e)})
    res.redirect('/admin?q=adandessn');
  }
  else if(req.params.db==='feedback'){
    Testimonial.findByIdAndUpdate(req.body.id,{title:req.body.title,description:req.body.description}).then(data=>console.log(data));
    res.redirect('/admin?q=test');
  }
  else if(req.params.db==='del')
  {
    await Customer.deleteMany({ status:'suc'}).catch(e=>{throw Error(e)});
    res.redirect('/admin?q=new');
  }
  else{
    
    res.redirect('/admin');
  }
});
app.get('/admin/ref',(req,res,next)=>{
  if(req.session.sid){
    next();
  }
  else{
    res.redirect('/login');
  }
},
async (req,res)=>{
  const currentDate=Number(dateTime().toString().slice(0,2));
    const data=await Customer.find({}).then(data=>data)
        data.forEach(async element=>{
          let d_date=Number(element.date.toString().slice(8, 11));
          
          if(currentDate!==d_date){
            element.status='pen'
            await element.save();    
          }
        }); 
  res.redirect('/admin');
})
app.use((err,req,res,next)=>{
 res.send(err);
})
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
  