let checkString ="";
const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');
form2.classList.add("hidden");
const dropHandler = (event)=>{
  event.preventDefault();
    form1.classList.add("hidden");
    form2.classList.remove("hidden");
    form2.classList.add("form2");
  let fileInput = document.getElementById('fileInput');
  fileInput.files=event.dataTransfer.files;

  var formdata = new FormData();
  formdata.append("video", fileInput.files[0]);
  var ajax = new XMLHttpRequest();
  ajax.responseType = 'json';
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "http://localhost:3000/uploadfile"); // http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP
  //use file_upload_parser.php from above url
  ajax.send(formdata);

}
const dragOverHandler=(event)=>{
  event.preventDefault();
  drop_area.classList.add("dragover");
}
const toggleDragOverClass=(event)=>{
  event.preventDefault();
  const drop_area=document.getElementById('drop_area');
  drop_area.classList.remove("dragover");
}
const onFileChange=(event)=>{
  form1.classList.add("hidden");
  form2.classList.remove("hidden");
  form2.classList.add("form2");
  var formdata = new FormData();
  formdata.append("video", event.target.files[0]);
  var ajax = new XMLHttpRequest();
  ajax.responseType = 'json';
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "http://localhost:3000/uploadfile"); // http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP
  //use file_upload_parser.php from above url
  ajax.send(formdata);
}
function progressHandler(event) {

  var percent = (event.loaded / event.total) * 100;
  document.getElementById("progressBar").style.width = Math.round(percent)+ '%';
  document.getElementById("status").innerHTML = Math.round(percent)+ '%';

}

function completeHandler(event) {
  document.getElementById("status").innerHTML = event.target.response.message;

  let pathInput=document.getElementById("path");
  pathInput.value = event.target.response.path;
  
  checkString=event.target.response.message;
}

function errorHandler(event) {
  document.getElementById("status").innerHTML = "Upload Failed";
}

function abortHandler(event) {
  document.getElementById("status").innerHTML = "Upload Aborted";
}
document.getElementById('submit').addEventListener("keyup",(event)=>{
  event.preventDefault();
    if (event.keyCode === 13&&checkString==="File uploaded") {

        form2.submit();

    }
});
