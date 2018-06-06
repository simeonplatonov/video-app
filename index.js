const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require('knex');
const upload = require("express-fileupload");
const fs = require('fs');

//Create an app object
const app = express();
//Create a database connection
const db = knex({
  client: 'pg',

  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '1234',
    database : 'video_app'
  },

});
//Use cors
app.use(cors());
//Use bodyparser
app.use(bodyParser.json());
//Use fileupload
app.use(upload({
  abortOnLimit:false,
}));
//Use folder public for serving static files
app.use(express.static("public"));

app.post("/uploadfile",(req,res)=>{
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  const title="video";
  const video=req.files.video;
  let name=`${title}-${Date.now()}.mp4`;
  name = name.replace(/\s/g,'');
  //This line moves vide to /uploads folder
  video.mv(`${__dirname}/uploads/videos/${name}`);
  //This line adds video title and path to the database
  db("videos").insert({title:title,path:name}).catch(err=>res.status(400).json("Unable to upload")).then(res.json({message:"File uploaded",path:name}));
});

app.get("/upload",(req,res)=>{
  res.sendFile(__dirname+"/public/upload.html");
});

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/public/index.html");
});

app.get("/videos",(req,res)=>{
  db("videos").where({published:true}).select("*").then(videos=>res.json(videos));
})
app.get("/watch",(req,res)=>{

  res.send(`<video controls style=width:60%;margin-left:20%;margin-right:20%; src=http://localhost:3000/stream?video=${req.query.video} type=video/mp4></video>`);
});

app.get("/stream",(req,res)=>{
  const path = `uploads/videos/${req.query.video}`;
 const stat = fs.statSync(path)
 const fileSize = stat.size
 const range = req.headers.range

 if (range) {
   const parts = range.replace(/bytes=/, "").split("-")
   const start = parseInt(parts[0], 10)
   const end = parts[1]
     ? parseInt(parts[1], 10)
     : fileSize-1
   const chunksize = (end-start)+1
   const file = fs.createReadStream(path, {start, end})
   const head = {
     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
     'Accept-Ranges': 'bytes',
     'Content-Length': chunksize,
     'Content-Type': 'video/mp4',
   }

   res.writeHead(206, head);
   file.pipe(res);
 } else {
   const head = {
     'Content-Length': fileSize,
     'Content-Type': 'video/mp4',
   }
   res.writeHead(200, head)
   fs.createReadStream(path).pipe(res);
}});
app.post("/publish",(req,res)=>{

  const title=req.body.title;
  console.log(req.body.path);
  const path=req.body.path;

  let thumbnailname=`${title}-${Date.now()}.jpeg`;
  thumbnailname = thumbnailname.replace(/\s/g,'');
  if(req.files.thumbnail){
    const thumbnail=req.files.thumbnail;



    thumbnail.mv(`${__dirname}/uploads/thumbnails/${thumbnailname}`);
  }
  db("videos").where({path:path}).update({title:title,thumbnail_path:thumbnailname,published:true}).then(res.redirect("http://localhost:3000/"));


})
app.get("/images",(req,res)=>{
  const path = `uploads/thumbnails/${req.query.image}`;
 const stat = fs.statSync(path)
 const fileSize = stat.size
 const range = req.headers.range

 if (range) {
   const parts = range.replace(/bytes=/, "").split("-")
   const start = parseInt(parts[0], 10)
   const end = parts[1]
     ? parseInt(parts[1], 10)
     : fileSize-1
   const chunksize = (end-start)+1
   const file = fs.createReadStream(path, {start, end})
   const head = {
     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
     'Accept-Ranges': 'bytes',
     'Content-Length': chunksize,
     'Content-Type': 'image/jpeg',
   }

   res.writeHead(206, head);
   file.pipe(res);
 } else {
   const head = {
     'Content-Length': fileSize,
     'Content-Type': 'image/jpeg',
   }
   res.writeHead(200, head)
   fs.createReadStream(path).pipe(res);}
});

app.listen(3000,console.log("App listening at port 3000"));
