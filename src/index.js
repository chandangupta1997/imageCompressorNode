const express = require('express')

const multer = require('multer')

const sharp = require('sharp')


const app = express()
app.set('view engine','ejs')

const upload = multer({ dest: 'uploads/' });





app.listen(3030,()=>{console.log("app is running on port 3030")})

app.get("/",function(req,res){

    res.send("welcome to the home app is running smoothly")
})


app.get("/xyz",function(req,res){

    res.render("abc")
})

// app.post("/xyz",function(req,res){

//     console.log("inside  the function")
//     let file = req.body.file


//     console.log(file)
// })



// Set up a route to handle the image upload and compression
app.post('/upload', upload.single('image'), (req, res) => {
  // Set the desired width and height of the compressed image
  const width = 200;
  const height = 200;

  // Use sharp to retrieve the original image's dimensions
  sharp(req.file.path)
    .metadata()
    .then(metadata => {
      // Calculate the aspect ratio
      const aspectRatio = metadata.width / metadata.height;

      // Calculate the new dimensions
      let newWidth, newHeight;
      if (width / height > aspectRatio) {
        newHeight = height;
        newWidth = height * aspectRatio;
      } else {
        newWidth = width;
        newHeight = width / aspectRatio;
      }

      // Use sharp to create a new image with the new dimensions
      console.log(req.file.path)
      return sharp(req.file.path)
        .resize(Math.round(newWidth), Math.round(newHeight))
        .toFormat(`png`)  
        .toFile('compressed/' + req.file.filename); // binary 
    })
    .then(() => {
      // Send the user's browser to the compressed image's URL
      res.send('/compressed/' + req.file.filename);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});