showNotes(); 

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
document.getElementById('timestamp').value = formattedDateTime;


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
    let notesdate=localStorage.getItem("notesdate");

    if (notes == null||noteshead==null||notesdate==null) {
        notesObj = [];   
        notesheadObj=[];
        notesdateObj=[];
    }
    else {
        notesObj = JSON.parse(notes);
        notesheadObj=JSON.parse(noteshead);
        notesdateObj=JSON.parse(notesdate);
    }

    let addTxt = document.getElementById("addTxt").value;  
    let addhead=document.getElementById("addhead").value;
    let addDate=document.getElementById('timestamp').value;
    if (addTxt=="" && addhead ==""){
        return;
    }
    notesObj.push(addTxt);  
    notesheadObj.push(addhead);
    notesdateObj.push(addDate);
    localStorage.setItem("notes", JSON.stringify(notesObj)); 
    localStorage.setItem("noteshead",JSON.stringify(notesheadObj));
    localStorage.setItem("notesdate",JSON.stringify(notesdateObj));
    document.getElementById("addTxt").value = "";  
    document.getElementById("addhead").value= "";
    document.getElementById('timestamp').value = formattedDateTime;
    showNotes(); 
    reload();
}

function showNotes() {
    let notes = localStorage.getItem("notes");  //obtaining the notes list
    let noteshead = localStorage.getItem("noteshead");
    let notesdate=localStorage.getItem("notesdate");

    if (notes == null||noteshead==null) {
        notesObj = [];   //creating notes Object 
        notesheadObj=[]; //creating notes Head Object 
        notesdateObj=[];
    }
    else {
        notesObj = JSON.parse(notes); //converting strings of notes array to object
        notesheadObj=JSON.parse(noteshead);
        notesdateObj=JSON.parse(notesdate);
    }
    let html = "";

    notesObj.forEach(function (element, index) { 
        let nhead=Object.values(notesheadObj)[index];
        let ndate=(Object.values(notesdateObj)[index]).replace("T"," ");
        
        html = `<div class="noteCard my-2 mx-2 card" style="width: 90%; margin-left: 10px;">
       <div class="card-body">
            <p style="text-align: right; margin-top: 0px; margin-bottom: 0px;">${ndate}</p>
            <h3 class="card-title" style="margin-top: 0px;" id="title-${index}">${nhead}</h3>
            <p class="card-text" id="text-${index}" style="flex: 1; margin-top: 1px;">${element}</p>
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
    let notes = localStorage.getItem("notes");  //obtaining the notes list
    let noteshead = localStorage.getItem("noteshead");
    let notesdate=localStorage.getItem("notesdate");

    if (notes == null||noteshead==null) {
        notesObj = [];   //creating notes Object 
        notesheadObj=[]; //creating notes Head Object 
        notesdateObj=[];
    }
    else {
        notesObj = JSON.parse(notes);  
        notesheadObj=JSON.parse(noteshead);
        notesdateObj=JSON.parse(notesdate);
    }

    notesObj.splice(index, 1); 
    notesheadObj.splice(index,1);
    notesdateObj.splice(index,1);
    localStorage.setItem("notes", JSON.stringify(notesObj));  
    localStorage.setItem("noteshead",JSON.stringify(notesheadObj));
    localStorage.setItem("notesdate",JSON.stringify(notesdateObj));
    showNotes(); 
}

document.getElementById("downloadNotes").addEventListener("click", function (e) {
    e.preventDefault(); // prevent anchor default behavior

    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    let heads = JSON.parse(localStorage.getItem("noteshead") || "[]");
    let dates = JSON.parse(localStorage.getItem("notesdate") || "[]");

    if (notes.length === 0 || heads.length === 0) {
        alert("No notes available to download.");
        return;
    }

    let content = "";
    for (let i = 0; i < notes.length; i++) {
        content += `DATE:${dates[i]} \nHEADING: ${heads[i]}\nNOTE: ${notes[i]}\n********************************************************\n`;  // heading newline paragraph newline
    }

    let blob = new Blob([content], { type: "text/plain" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "MyNotes.txt";
    a.click();

    URL.revokeObjectURL(url);  // cleanup
});

document.getElementById("uploadNotes").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;

        const entries = content.split("********************************************************\n");
        let notes = [];
        let heads = [];
        let dates = [];

        entries.forEach(entry => {
            const dateMatch = entry.match(/DATE:\s*(.*)/);
            const headMatch = entry.match(/HEADING:\s*(.*)/);
            const noteMatch = entry.match(/NOTE:\s*([\s\S]*)/);

            const date = dateMatch ? dateMatch[1].trim() : "";
            const head = headMatch ? headMatch[1].trim() : "";   // allow empty
            const note = noteMatch ? noteMatch[1].trim() : "";   // allow empty

            // Avoid pushing completely empty entries
            if (head !== "" || note !== "") {
                if (head.includes("NOTE:")){
                    heads.push("");
                }
                else{
                    heads.push(head);
                }

                if (note.includes("HEADING:")){
                    note.push("");
                }else{
                    notes.push(note);
                }
                dates.push(date);
                
                
            }
        });

        if (heads.length === 0 && notes.length === 0) {
            alert("No valid notes found in the file.");
            return;
        }

        const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
        const existingHeads = JSON.parse(localStorage.getItem("noteshead") || "[]");
        const existingDates = JSON.parse(localStorage.getItem("notesdate") || "[]");
        const mergedNotes = existingNotes.concat(notes);
        const mergedHeads = existingHeads.concat(heads);
        const mergedDates = existingDates.concat(dates);

        localStorage.setItem("notes", JSON.stringify(mergedNotes));
        localStorage.setItem("noteshead", JSON.stringify(mergedHeads));
        localStorage.setItem("notesdate", JSON.stringify(mergedDates));

        showNotes();
    };

    reader.readAsText(file);
});