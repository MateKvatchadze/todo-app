const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoUl = document.getElementById("todoUl");
const todo_key = "todo_key";
let todoObj = [];

  todoUl.addEventListener("click", function(e){
    const btn = e.target.closest(".todoDeleteBtn");
    if(!btn) return;
    const li = btn.closest("li");
    if(!li) return

    const id = li.dataset.id;

    const index = todoObj.findIndex((t) => t.id === id);
   if(index === -1)return;

     todoObj.splice(index, 1);
   lStorageSave();
  
  })


    todoBtn.onclick = function todoInsert() {
      let todoInpValue = todoInput.value.trim();
      if (todoInpValue === "") {
        alert("you must enter something");
        return;
      }
    const todo = {
      id: crypto.randomUUID(),
      text: todoInpValue
    };
      todoObj.push(todo);
   lStorageSave();
      todoInput.value = "";
      todoInput.focus();
    };

function lStorageSave(){
   saveTodos();
    renderTodos();
}
function saveTodos(){
  localStorage.setItem(todo_key, JSON.stringify(todoObj))
}

function loadTodos(){
  const raw = localStorage.getItem(todo_key);
  todoObj = raw? JSON.parse(raw) : [];
}
loadTodos();
renderTodos();


    function renderTodos(){
    let html = ""

    todoObj.forEach((el) =>{
    html+=`
    <li data-id="${el.id}">${el.text}
    <button class="todoDeleteBtn">Delete</button>
    </li>`
    })
    todoUl.innerHTML = html;
    }