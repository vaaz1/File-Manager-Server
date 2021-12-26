const express = require("express");
const cors = require('cors');
var bodyParser = require('body-parser');
const fs = require('fs');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
  uploadDir: './MY_FILES'
});

// App
const app = express();
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cors());

// Routes
app.get("/getAllMyFiles", (req, res) => {
  fs.readdir('./MY_FILES/', (err, files) => {
    if(err) res.status(500).send(err);
    else {
      files.forEach(file => {
        console.log(file);
      });
      res.status(200).send(files);
    }
  });
});


app.get("/downloadFile", (req, res) => {
  let fileName = './MY_FILES/' + req.query.id;
  console.log('download ', fileName);
  res.download(fileName, req.query.id, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Could not download file."
      })
    }
  });

})

app.post("/addNewFile", (req, res) => {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');
  let fileName = './MY_FILES/' + req.query.id;
  console.log(fileName);
  fs.writeFile(fileName, base64data, 'base64', (err) => {
    if (err) { 
      console.log(err);
      res.status(500).send(err); 
    }
    else {
      console.log("File written successfully");
      res.status(200).send({file: req.query.id});
    }
  });
});

app.listen(3000);