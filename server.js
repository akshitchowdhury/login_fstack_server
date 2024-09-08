
  const express = require('express');
  const connectDB = require('./mongoDb')
const Alias = require('./models/Alias')

// cloudinary and multer part
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Razorpay = require('razorpay')

const crypto = require('crypto')
const razorpay = new Razorpay({
key_id: 'rzp_test_06rtsoPDppcS1n',
   key_secret: 'Ru0L1LXfQg0CWmKwhXfGkk5K'
})
// cloudinary and multer part

const app = express()
var cors = require('cors')
app.use(cors())

// app.use(cors({
//   origin: 'https://login-fstack-client.vercel.app/', // Specify your frontend domain here
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   credentials: true, // If you need to send cookies
// }));


// let corsOptions = {
//   origin: [ 'https://login-fstack-client.vercel.app/', 'http://localhost:3000' ]
// };

const port = process.env.PORT || 3030
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

app.get("/:id", async (req, res) => {
  try {
      const aliasId = req.params.id;
      const alias = await Alias.findById(aliasId);
      if (!alias) {
          return res.status(404).json({ message: 'Alias not found' });
      }
      res.json(alias);
  } catch (error) {
      res.status(400).json('Error: ' + error);
  }
});

app.post("/login",upload.single('image'), async(req,res)=>{
    try {
    const newAlias = new Alias({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        imageUrl: req.file ? req.file.path : null ,
        isFavorite: req.body.isFavorite,
        currency: req.body.currency,
        amount: req.body.amount
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

app.put("/update/:id", upload.single('image'), async (req, res) => {
    try {
      const aliasId = req.params.id;
  
      // Find the existing document by ID
      const alias = await Alias.findById(aliasId);
  
      if (!alias) {
        return res.status(404).json({ message: 'Alias not found' });
      }
  
      // Update fields if they are present in the request body
      alias.username = req.body.username || alias.username;
      alias.firstName = req.body.firstName || alias.firstName;
      alias.lastName = req.body.lastName || alias.lastName;
      alias.password = req.body.password || alias.password;
      alias.isFavorite = req.body.isFavorite || alias.isFavorite;
      alias.currency = req.body.currency || alias.currency;
      alias.amount = req.body.amount || alias.amount;
  
      // Handle the image update if a new file is uploaded
      if (req.file) {
        // Delete the old image from Cloudinary (optional but recommended)
        if (alias.imageUrl) {
          const publicId = alias.imageUrl.split('/').pop().split('.')[0]; // Extract public_id from URL
          await cloudinary.uploader.destroy(publicId);
        }
        
        // Save the new image URL
        alias.imageUrl = req.file.path;
      }
  
      // Save the updated alias
      const updatedAlias = await alias.save();
      res.json(updatedAlias);
  
    } catch (error) {
      res.status(400).json('Error: ' + error);
    }
  });

  //Razorpay_route
  app.post('/order', async (req, res) => {
    // initializing razorpay
    const razorpay = new Razorpay({
        key_id: req.body.keyId,
        key_secret: req.body.keySecret,
    });

    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "any unique id for every order",
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
       res.status(400).send('Not able to create order. Please try again!');
    }
});
  
//payment_capture

const secret_key = 'DevAshura666'

app.post('/paymentCapture', (req, res) => {

   // do a validation

const data = crypto.createHmac('sha256', secret_key)

   data.update(JSON.stringify(req.body))

   const digest = data.digest('hex')

if (digest === req.headers['x-razorpay-signature']) {

       console.log('request is legit')

       //We can send the response and store information in a database.

       res.json({

           status: 'ok'

       })

} else {

       res.status(400).send('Invalid signature');

   }

})