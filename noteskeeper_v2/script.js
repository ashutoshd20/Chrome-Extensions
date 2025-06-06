showNotes(); 
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");

    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("show");
        });
    }
});

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
        
        html = `<div class="noteCard my-2 mx-2 card" style="width: 90%; margin-left: 10px;">
       <div class="card-body">
            <h3 class="card-title" id="title-${index}">${v}</h3>
            <p class="card-text" id="text-${index}" style="flex: 1;">${element}</p>
            <button class="btn btn-sm copy-btn" data-id="${index}" title="Copy Text">📋</button>
            <button data-id="${index}"="e${index}"  class="btn edit-btn" id="edit-btn" title="Edit">✎</button>
            <button data-id="${index}"="${index}"  class="btn delete-btn" title="Delete">🗑️</button>
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
            if (this.textContent === "✎") {
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
    document.querySelectorAll(".copy-btn").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-id");
            let text = document.getElementById(`text-${index}`).innerText;
    
            navigator.clipboard.writeText(text).then(() => {
                this.textContent = "✅";
                setTimeout(() => {
                    this.textContent = "📋";
                }, 1000);
            }).catch(() => {
                alert("Failed to copy text");
            });
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

document.getElementById("downloadNotes").addEventListener("click", function (e) {
    e.preventDefault(); // prevent anchor default behavior

    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    let heads = JSON.parse(localStorage.getItem("noteshead") || "[]");

    if (notes.length === 0 || heads.length === 0) {
        alert("No notes available to download.");
        return;
    }

    let content = "";
    for (let i = 0; i < notes.length; i++) {
        content += `HEADING: ${heads[i]}\nNOTE: ${notes[i]}\n********************************************************\n`;  // heading newline paragraph newline
    }

    let blob = new Blob([content], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "MyNotes.txt";
    a.click();

    URL.revokeObjectURL(url);  // cleanup
});