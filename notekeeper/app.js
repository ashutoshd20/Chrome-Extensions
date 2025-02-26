console.log("welcome");
showNotes(); //calling the show notes function

let addBtn = document.getElementById('addBtn');  //gettting the html of add button
addBtn.addEventListener("click", function (e) {

    
    let notes = localStorage.getItem("notes");  //considering an element of local storage
    let noteshead=localStorage.getItem("noteshead");

    if (notes == null||noteshead==null) {
        notesObj = [];   //creating notes Object 
        notesheadObj=[]; //creating notes Head Object 
    }
    else {
        notesObj = JSON.parse(notes); //converting strings of notes array to object
        notesheadObj=JSON.parse(noteshead);
    }

    let addTxt = document.getElementById("addTxt").value;  //from the entered text extracting the text value
    let addhead=document.getElementById("addhead").value;
    notesObj.push(addTxt);  //adding the newly obtained text to list of notes obj
    notesheadObj.push(addhead);
    localStorage.setItem("notes", JSON.stringify(notesObj));  //converting notes list to array of string and saving in local storage
    localStorage.setItem("noteshead",JSON.stringify(notesheadObj));
    document.getElementById("addTxt").value = "";  //clearing the entered text
    document.getElementById("addhead").value= "";
    //console.log(notesObj);
      
    showNotes(); //showing the newly appended website
    reload();
})

function showNotes() {
    let notes = localStorage.getItem("notes");  //obtaining the notes list
    let noteshead = localStorage.getItem("noteshead");
    if (notes == null||noteshead==null) {
        notesObj = [];   //creating notes Object 
        notesheadObj=[]; //creating notes Head Object 
    }
    else {
        notesObj = JSON.parse(notes); //converting strings of notes array to object
        notesheadObj=JSON.parse(noteshead);
    }
    let html = "";

    notesObj.forEach(function (element, index) {    //making html for each item in object
        let v=Object.values(notesheadObj)[index];
        
        html = `<div class="noteCard my-2 mx-2 card" style="width: 18rem;">
       <div class="card-body">
           <h5 class="card-title"> ${v}</h5>
           <p class="card-text"> ${element}</p>
           <button id="${index}"  class="btn btn-primary">Delete Now</button>
       </div>
   </div>`+html;       //onclick="deleteNote(this.id)"
   

    
   document.addEventListener('DOMContentLoaded', function() {
       let a=String(index);
       var link = document.getElementById(index);
         // onClick's logic below:
       link.addEventListener('click', function() {
             deleteNote(index);
             reload();
          });
      });

    });

    let notesElm = document.getElementById('notes');  //finding the html element which needs to be appended
    if (notesObj.length != 0) {
        notesElm.innerHTML = html;  //changing the inner html to the compiled html above
    }
    else {
        notesElm.innerHTML = `Nothing to show here`;   //message in case if the notes are empty
    }
    
}


   function reload() {
    reload = location.reload();
   }


function deleteNote(index) {
    console.log(`I am deleting this shit`, index);

    let notes = localStorage.getItem("notes");
    let noteshead=localStorage.getItem("noteshead")
    if (notes == null) {
        notesObj = [];
        notesheadObj=[];
    }
    else {
        notesObj = JSON.parse(notes);  //finding the list of notes array and converting them to array
        notesheadObj=JSON.parse(noteshead);
    }
    notesObj.splice(index, 1);  //removing the desired object
    notesheadObj.splice(index,1);
    localStorage.setItem("notes", JSON.stringify(notesObj));  
    localStorage.setItem("noteshead",JSON.stringify(notesheadObj));
    showNotes();  //calling the showNotes function to update the html
}

let search = document.getElementById("searchTxt");
search.addEventListener("input", function () {
    let inputVal = search.value;  //finding the entered value
    //console.log(inputVal);
//creating the way to make only appearing shared here

    let noteCards = document.getElementsByClassName("noteCard");
    Array.from(noteCards).forEach(function(element ) {
        let cardTxt = element.getElementsByTagName("p")[0].innerText;
        if (cardTxt.includes(inputVal)) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    })

})