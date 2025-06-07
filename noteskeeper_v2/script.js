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
    let notes_list=localStorage.getItem("notes_list");
    if(notes_list==null){
        notes_listObj=[];
    }
    else {
        notes_listObj = JSON.parse(notes_list);
    }

    let addTxt = document.getElementById("addTxt").value;  
    let addhead=document.getElementById("addhead").value;
    let addDate=document.getElementById('timestamp').value;

    if (addTxt=="" && addhead ==""){
        return;
    }

    let new_note = {'notes':addTxt,'noteshead':addhead,'notesdate':addDate};
    notes_listObj.push(new_note);
    localStorage.setItem("notes_list", JSON.stringify(notes_listObj)); 

    document.getElementById("addTxt").value = "";  
    document.getElementById("addhead").value= "";
    document.getElementById('timestamp').value = formattedDateTime;
    showNotes(); 
    reload();
}

function showNotes() {
    let notes_list=localStorage.getItem("notes_list");

    if (notes_list==null) {
        notes_listObj = [];   
    }
    else {
        notes_listObj = JSON.parse(notes_list);
    }
    let html = "";

    for (let index = 0; index < notes_listObj.length; index++) {

        let nhead = notes_listObj[index]['noteshead'];
        let ndate = (notes_listObj[index]['notesdate']).replace("T"," ");
        let element =  notes_listObj[index]['notes'];
        
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

    };

    let notesElm = document.getElementById('notes');  
    if (notes_listObj.length != 0) {
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

                let notes = JSON.parse(localStorage.getItem("notes_list")) || [];
                notes[index]['notes'] = updatedText;
                notes[index]['noteshead'] = updatedTitle;
                localStorage.setItem("notes_list", JSON.stringify(notes));
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
    let notes_list=localStorage.getItem("notes_list");

    if (notes_list==null) {
        notes_listObj = [];   
    }
    else {
        notes_listObj = JSON.parse(notes_list);
    }


    notes_listObj.splice(index, 1); 
    localStorage.setItem("notes_list",JSON.stringify(notes_listObj));
    showNotes(); 
}

document.getElementById("downloadNotes").addEventListener("click", function (e) {
    e.preventDefault();

    let notes_list = JSON.parse(localStorage.getItem("notes_list") || "[]");
    if (notes_list.length === 0) {
        alert("No notes available to download.");
        return;
    }

    let content = "";
    for (let i = 0; i < notes_list.length; i++) {
        content += `DATE:${notes_list[i]['notesdate']} \nHEADING: ${notes_list[i]['noteshead']}\nNOTE: ${notes_list[i]['notes']}\n********************************************************\n`;  // heading newline paragraph newline
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
        const unotes_list = [];

        entries.forEach(entry => {
            const unote={};
            const dateMatch = entry.match(/DATE:\s*(.*)/);
            const headMatch = entry.match(/HEADING:\s*(.*)/);
            const noteMatch = entry.match(/NOTE:\s*([\s\S]*)/);

            const date = dateMatch ? dateMatch[1].trim() : "";
            const head = headMatch ? headMatch[1].trim() : "";   // allow empty
            const note = noteMatch ? noteMatch[1].trim() : "";   // allow empty

            // Avoid pushing completely empty entries
            if (head !== "" || note !== "") {
                if (head.includes("NOTE:")){
                    unote['noteshead']="";
                }
                else{
                    unote['noteshead']= head;
                }

                if (note.includes("HEADING:")){
                    unote['notes']="";
                }else{
                    unote['notes']=note;
                }
                unote['notesdate']=date;
                unotes_list.push(unote);    
            }
        });

        if (unotes_list.length === 0) {
            alert("No valid notes found in the file.");
            return;
        }

        const existingNotes = JSON.parse(localStorage.getItem("notes_list") || "[]");
        const mergedNotes = existingNotes.concat(unotes_list);
        localStorage.setItem("notes_list", JSON.stringify(mergedNotes));
        showNotes();
    };

    reader.readAsText(file);
});


document.getElementById("searchBar").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const allCards = document.querySelectorAll(".noteCard");

    allCards.forEach(card => {
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      const text = card.querySelector(".card-text").textContent.toLowerCase();

      if (title.includes(query) || text.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
});

  
