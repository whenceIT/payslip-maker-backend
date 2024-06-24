const express = require("express");
const multer = require('multer')
const cors = require("cors");
var fs = require('fs')
var nodemailer = require("nodemailer");


const app = express();
const port = 5000;
app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    return cb(null,"./payslips")
  },
  filename: function(req,file,cb){
    return cb(null,file.originalname)
  }
})

const upload = multer({storage})

const sendMail =async(email,filename,date)=>{
  var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: 'whenceit@gmail.com',
          pass: 'wjbj adlz dpip knpu',
      },
    });

    var mailOptions = {
      from: 'whenceit@gmail.com',
      to: email,
      subject: `${date} Payslip`,
      attachments:[
        {
          path: `./payslips/${filename}`
        }
      ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
   
      if (error) {
        throw new Error(error);
     
      } else {

        fs.unlinkSync(`./payslips/${filename}`);
        return true;
       
        
      }
    });

   // fs.unlinkSync(`./payslips/${filename}`);
}

app.post("/pdf_upload",upload.single("pdf_file"),async(req,res)=>{
  const {email,filename,date} = req.body
  try{
    sendMail(email,filename,date)
    res.json('It worked!!!!')
  }
  catch{
    res.json('It did not work!!')

  }

 //fs.unlink(`./payslips/${filename}`);

})

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});