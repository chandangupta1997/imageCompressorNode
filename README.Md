To create an image compressor tool in Node.js, you can follow these steps:

Begin by installing the necessary dependencies. You will need the multer and sharp packages to handle file uploads and image manipulation, respectively. You can install these packages using the following command:
Copy code
npm install multer sharp
Create a form on your website where users can upload an image. You can do this using the <form> and <input type="file"> tags in HTML.

In the form's action attribute, specify a route in your Node.js server that will handle the image upload and compression.

In your Node.js server, use the multer middleware to handle the file upload and save the uploaded image to a specified location on your server.

Use the sharp package to retrieve the width and height of the image, and then use these values to calculate the aspect ratio.

Use the sharp() function to create a new image with the same aspect ratio but with reduced dimensions.

Use the toFile() function to save the compressed image to a specified location on your server.

Finally, use the res.send() function to send the user's browser to the compressed image's URL, so that it can be displayed or downloaded.

Here is an example of a simple Node.js server that accomplishes these tasks:

Copy code
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

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
      return sharp(req.file.path)
        .resize(Math.round(newWidth), Math.round(newHeight))
        .toFile('compressed/' + req.file.filename);
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

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
This example uses the multer middleware to handle the