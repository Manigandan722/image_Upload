const express = require('express');
const multer = require('multer');
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const Image = require('./uploads/models/imageModel')

const app = express();

app.use(express.static(path.join(__dirname,'uploads')))
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://manivedi722:QSdRAneQUUmSV86c@cluster0.vnuhdxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/imageDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log("db is connected"))
.catch((err)=>console.log(err))
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,"image"+"-"+ Date.now()  + path.extname(file.originalname) )
    },
    
})

const upload = multer({storage:storage})

app.get('/',async(req,res)=>{
   try {
    const images = await Image.find();
    res.json(images)
    
   } catch (error) {
    
   }
})

app.post('/upload',upload.single('images'),async(req,res)=>{

    if(!req.file){
        res.status(400).send('no file upload')
    }
    try {
        const imagePath = `${req.file.filename}`;
        const newImage = new Image({imagePath})
       await newImage.save();
       res.send("fileupload sucessfully").status(201)
    } catch (error) {
        
    }

    
})

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})