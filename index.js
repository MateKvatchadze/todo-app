const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoUl = document.getElementById("todoUl");
const todo_key = "todo_key";
let todoObj = [];
let draggedId = null;
let dragBlocked = false;

const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterCompleted = document.getElementById("filterCompleted");
let currentFilter = "all";

filterAll.onclick = function () {
  currentFilter = "all";
  renderTodos();
};
filterActive.onclick = function () {
  currentFilter = "active";
  renderTodos();
};

filterCompleted.onclick = function () {
  currentFilter = "completed";
  renderTodos();
};

todoUl.addEventListener("drop", function (e) {
  e.preventDefault();

  const targetLi = e.target.closest("li");
  if (!targetLi) return;

  const targetId = targetLi.dataset.id;
  if (draggedId === targetId) return;

  const draggedTodo = todoObj.find((t) => t.id === draggedId);
  const targetTodo = todoObj.find((t) => t.id === targetId);
  if (!draggedTodo || !targetTodo) return;

  if (draggedTodo.done !== targetTodo.done) return;

  const fromIndex = todoObj.findIndex((t) => t.id === draggedId);
  const toIndex = todoObj.findIndex((t) => t.id === targetId);
  if (fromIndex.done !== toIndex.done) return;
  if (fromIndex === -1 || toIndex === -1) return;

  const [movedItem] = todoObj.splice(fromIndex, 1);
  todoObj.splice(toIndex, 0, movedItem);

  saveTodos();
  renderTodos();
});

todoUl.addEventListener("pointerdown", function (e) {
  dragBlocked =
    !!e.target.closest(".todoDeleteBtn") || !!e.target.closest(".todoCheckBox");
});
todoUl.addEventListener("pointerup", function (e) {
  dragBlocked = false;
});
todoUl.addEventListener("pointercancel", function (e) {
  dragBlocked = false;
});

todoUl.addEventListener("dragstart", function (e) {
  const li = e.target.closest("li");
  if (!li) return;

  if (dragBlocked) {
    e.preventDefault();
    return;
  }

  draggedId = li.dataset.id;
});

todoUl.addEventListener("dragover", function (e) {
  e.preventDefault();
});

todoUl.addEventListener("click", function (e) {
  const btn = e.target.closest(".todoDeleteBtn");
  if (!btn) return;
  const li = btn.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  const index = todoObj.findIndex((t) => t.id === id);
  if (index === -1) return;

  todoObj.splice(index, 1);
  lStorageSave();
});

todoUl.addEventListener("change", function (e) {
  const chekbox = e.target.closest(".todoCheckBox");
  if (!chekbox) return;

  const li = chekbox.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  const todo = todoObj.find((t) => t.id === id);
  if (!todo) return;

  todo.done = chekbox.checked;
  todoObj.sort((a, b) => Number(a.done) - Number(b.done));
  saveTodos();
  renderTodos();
});

todoBtn.onclick = function todoInsert() {
  let todoInpValue = todoInput.value.trim();
  if (todoInpValue === "") {
    alert("you must enter something");
    return;
  }
  const todo = {
    id: crypto.randomUUID(),
    text: todoInpValue,
    done: false,
  };
  todoObj.unshift(todo);
  lStorageSave();
  todoInput.value = "";
  todoInput.focus();
};

function lStorageSave() {
  saveTodos();
  renderTodos();
}
function saveTodos() {
  localStorage.setItem(todo_key, JSON.stringify(todoObj));
}

function loadTodos() {
  const raw = localStorage.getItem(todo_key);
  todoObj = raw ? JSON.parse(raw) : [];
}
loadTodos();
renderTodos();

function renderTodos() {
  let html = "";
  let filteredTodos = todoObj;
  if (currentFilter === "active") {
    filteredTodos = todoObj.filter((todo) => !todo.done);
  }
  if (currentFilter === "completed") {
    filteredTodos = todoObj.filter((todo) => todo.done);
  }
  filteredTodos.forEach((el) => {
    const checked = el.done ? "checked" : "";
    const completed = el.done ? "completed" : "";
    const draggable = el.done ? "false" : "true";
    html += `
    <li data-id="${el.id}" class="${completed}" draggable="${draggable}">
        <input type="checkbox" class="todoCheckBox" ${checked} draggable="false">
      <span class="todoText" >${el.text}</span>
    <button class="todoDeleteBtn" draggable="false">Delete</button>
    </li>`;
  });
  todoUl.innerHTML = html;
}
