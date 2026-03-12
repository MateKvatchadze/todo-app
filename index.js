const todoInput = document.getElementById("todoInput");
const todoBtn = document.getElementById("todoBtn");
const todoUl = document.getElementById("todoUl");
const todo_key = "todo_key";
let todoList = [];
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

  const draggedTodo = todoList.find((t) => t.id === draggedId);
  const targetTodo = todoList.find((t) => t.id === targetId);
  if (!draggedTodo || !targetTodo) return;

  if (draggedTodo.done !== targetTodo.done) return;

  const fromIndex = todoList.findIndex((t) => t.id === draggedId);
  const toIndex = todoList.findIndex((t) => t.id === targetId);
  if (fromIndex === -1 || toIndex === -1) return;

  const [movedItem] = todoList.splice(fromIndex, 1);
  todoList.splice(toIndex, 0, movedItem);

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

  const index = todoList.findIndex((t) => t.id === id);
  if (index === -1) return;

  todoList.splice(index, 1);
  lStorageSave();
});

todoUl.addEventListener("change", function (e) {
  const chekbox = e.target.closest(".todoCheckBox");
  if (!chekbox) return;

  const li = chekbox.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  const todo = todoList.find((t) => t.id === id);
  if (!todo) return;

  todo.done = chekbox.checked;
  todoList.sort((a, b) => Number(a.done) - Number(b.done));
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
  todoList.unshift(todo);
  lStorageSave();
  todoInput.value = "";
  todoInput.focus();
};

function lStorageSave() {
  saveTodos();
  renderTodos();
}
function saveTodos() {
  localStorage.setItem(todo_key, JSON.stringify(todoList));
}

function loadTodos() {
  const raw = localStorage.getItem(todo_key);
  todoList = raw ? JSON.parse(raw) : [];
}
loadTodos();
renderTodos();

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;
  li.draggable = !todo.done;

  if (todo.done) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todoCheckBox");
  checkbox.checked = todo.done;
  checkbox.draggable = false;

  const span = document.createElement("span");
  span.classList.add("todoText");
  span.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("todoDeleteBtn");
  button.textContent = "delete";
  button.draggable = false;

  li.append(checkbox, span, button);
  return li;
}

function renderTodos() {
  todoUl.innerHTML = "";

  let filteredTodos = todoList;

  if (currentFilter === "active") {
    filteredTodos = todoList.filter((todo) => !todo.done);
  }
  if (currentFilter === "completed") {
    filteredTodos = todoList.filter((todo) => todo.done);
  }

  filteredTodos.forEach((todo) => {
    const li = createTodoElement(todo);
    todoUl.append(li);
  });
}
