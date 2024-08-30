
  const express = require('express');
  const connectDB = require('./mongoDb')
const Alias = require('./models/Alias')

// cloudinary and multer part
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
// cloudinary and multer part

const app = express()
var cors = require('cors')
app.use(cors())
const port = process.env.PORT || 3000
app.use(express.json());
connectDB()

//cloudinary config
cloudinary.config({
    cloud_name: 'dplhw2tlf',
    api_key: '421961992166418',
    api_secret: 'W1jzO_QZK7RjT8co8mPFwq8xRls'
  });

  // Multer-Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads', // Folder in your Cloudinary account
      allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
    },
  });

  const upload = multer({ storage: storage });


//cloudinary config

app.listen(port, ()=>
{
    console.log(`listening to port ${port}`)
})


app.get("/", async(req,res)=>{

    try {
        const alias = await Alias.find()
        res.json(alias)
    } catch (error) {
        res.status(400).json('Error: ' + error);

    }
})

app.post("/login",upload.single('image'), async(req,res)=>{
    try {
    const newAlias = new Alias({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        imageUrl: req.file ? req.file.path : null 
    })      
    const alias = await newAlias.save();
    res.json(alias)
    } catch (error) {
        res.status(400).json('Error: ' + error);
    }
})

app.delete("/delete/:id", async(req,res)=>{
    try {
        const aliasId = req.params.id
        const deleteAlias = await Alias.findByIdAndDelete(aliasId)
        
        res.json(deleteAlias)
    } catch (error) {
        res.status(400).json('Error: ' + error);
    }
})

