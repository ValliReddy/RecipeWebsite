const express = require('express');
const RegisterUser=require('./model');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const middleware=require('./middleware');
const cors=require('cors');


const app = express();
app.use(express.json());
app.use(cors({origin:"*"}))

mongoose.connect("mongodb+srv://vallirani:NewPass@cluster0.ykmsdrg.mongodb.net/React-nodeDB?retryWrites=true&w=majority&appName=Cluster0",{ useNewUrlParser: true, useUnifiedTopology: true}
).then(()=>console.log("DB connected successfully"))


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/register',async(req,res)=>{
    try{
        const{username,email,password,confirmPassword}=req.body;
        let exist=await RegisterUser.findOne({email:email})
        if(exist){
            return res.status(400).send('User Already Exist')
        }
        if(password!==confirmPassword){
            return res.send(400).send('Passwords are not matching');
        }
        let newUser=new RegisterUser({
            username,
            email,
            password,
            confirmPassword
        })
        await newUser.save();
        res.status(200).send('Registered Successfully')
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internal server error')
    }
})

app.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        let exist=await RegisterUser.findOne({email:email});
        if(!exist){
            return res.status(400).send('User not found');
        }
        if(exist.password!==password){
           return res.status(400).send('Invalid credentials');
        }
        let payload={
            user:{
                id:exist.id
            }
        }
        jwt.sign(payload,'jwtsecret',{expiresIn:3600000},(err,token)=>{
            if(err) throw err;
            return res.json({token})
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/myprofile', middleware, async (req, res) => {
    try {
        let exist = await RegisterUser.findById(req.user.id);
        if (!exist) {
            return res.status(400).send('User not found');
        }
        res.json(exist);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});







app.listen(5000, () => {
  console.log("Server is running ..");
});
