try {
    console.log("start");
    
    let a=document.getElementById('a1');
    a.addEventListener("click",function(e){
        console.log("bhow");
        document.querySelector("html").style.filter="invert(1) hue-rotate(180deg)";
    })
    throw new Error("lol");
    console.log("end");
   


  } catch (e) {
    console.error(e);
  }


