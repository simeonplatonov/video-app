const displayVideos=()=>{
  let display_area = document.getElementById('display_area');
  fetch("http://localhost:3000/videos",{method:"get",
  headers:{"Content-Type":"application/json"}
  }).then(response=>response.json()).then(videos=>{
  for(i=0;i<videos.length;i++){
      display_area.innerHTML+=`<div class="video"><a href="http://localhost:3000/watch/?video=${videos[i].path}"><div><img width="246" height="138" src="http://localhost:3000/images/?image=${videos[i].thumbnail_path}"></div><div><h2>${videos[i].title}</h2></div></a></div>`;
  }

  });

}
displayVideos();
