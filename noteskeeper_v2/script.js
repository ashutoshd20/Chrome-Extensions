showNotes(); 
let addBtn = document.getElementById('addBtn');  //gettting the html of add button
addBtn.addEventListener("click", function (e) {
    addnotes();
});
function addnotes() {
    let notes = localStorage.getItem("notes"); 
    let noteshead=localStorage.getItem("noteshead");

    if (notes == null||noteshead==null) {
        notesObj = [];   
        notesheadObj=[];
    }
    else {
        notesObj = JSON.parse(notes);
        notesheadObj=JSON.parse(noteshead);
    }

    let addTxt = document.getElementById("addTxt").value;  
    let addhead=document.getElementById("addhead").value;
    notesObj.push(addTxt);  
    notesheadObj.push(addhead);
    localStorage.setItem("notes", JSON.stringify(notesObj)); 
    localStorage.setItem("noteshead",JSON.stringify(notesheadObj));
    document.getElementById("addTxt").value = "";  
    document.getElementById("addhead").value= "";
    showNotes(); 
    reload();
}

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

    notesObj.forEach(function (element, index) { 
        let v=Object.values(notesheadObj)[index];
        
        html = `<div class="noteCard my-2 mx-2 card" style="width: 90%;">
       <div class="card-body">
           <h3 class="card-title" id="title-${index}">${v}</h3>
           <p class="card-text" id="text-${index}">${element}</p>
           <button data-id="${index}"="e${index}"  class="btn btn-primary edit-btn" id="edit-btn">Edit</button>
           <button data-id="${index}"="${index}"  class="btn btn-primary delete-btn">Delete</button>
       </div>
   </div>`+html;       

    });

    let notesElm = document.getElementById('notes');  
    if (notesObj.length != 0) {
        notesElm.innerHTML = html; 
    }
    else {
        notesElm.innerHTML = `Nothing to show here`; 
    
}
    attach_buttons();
}

function attach_buttons(){
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            let id = this.getAttribute("data-id");
            deleteNote(id);
        });
    });
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-id");
            let titleElem = document.getElementById(`title-${index}`);
            let textElem = document.getElementById(`text-${index}`);
            if (this.textContent === "Edit") {
                titleElem.innerHTML = `<input type="text" class="form-control" id="edit-title-${index}" value="${titleElem.textContent}">`;
                textElem.innerHTML = `<textarea class="form-control" id="edit-text-${index}" >${textElem.textContent}</textarea>`;
                this.textContent = "Save";
            } else {
                let updatedTitle = document.getElementById(`edit-title-${index}`).value;
                let updatedText = document.getElementById(`edit-text-${index}`).value;
                let notes = JSON.parse(localStorage.getItem("notes")) || [];
                let noteshead = JSON.parse(localStorage.getItem("noteshead")) || [];
                notes[index] = updatedText;
                noteshead[index] = updatedTitle;
                localStorage.setItem("notes", JSON.stringify(notes));
                localStorage.setItem("noteshead", JSON.stringify(noteshead));
                showNotes(); 
            }
        });
    });
}

function reload() {
    reload = location.reload();
}

function deleteNote(index) {
    let notes = localStorage.getItem("notes");
    let noteshead=localStorage.getItem("noteshead")
    if (notes == null) {
        notesObj = [];
        notesheadObj=[];
    }
    else {
        notesObj = JSON.parse(notes);  
        notesheadObj=JSON.parse(noteshead);
    }
    notesObj.splice(index, 1); 
    notesheadObj.splice(index,1);
    localStorage.setItem("notes", JSON.stringify(notesObj));  
    localStorage.setItem("noteshead",JSON.stringify(notesheadObj));
    showNotes(); 
}