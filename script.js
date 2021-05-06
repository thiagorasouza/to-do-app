// ================
// EVENT ATTACHMENT
// ================

const taskList = document.querySelector('.listing ul');

const newTaskInput = document.getElementById('inp-new');
// Task insertion is triggered when enter key is pressed
newTaskInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    newTaskHandler(event);
  }
});

const newTaskBtn = document.querySelector('.btn-new');
newTaskBtn.addEventListener('click', newTaskHandler);

function newTaskHandler(event) {
  let name = newTaskInput.value;

  // Only inserts non empty tasks
  if (name.trim()) {
    newTask(name);
    newTaskInput.value = '';

    // If only complete tasks are being shown, switches filter to show all tasks
    if (getCurrentFilter() === 'complete') {
      document.getElementById('filter-all').checked = true;
      refreshFiltering();
    } 
  }
}

const filterRadios = document.querySelectorAll('.filters input[type="radio"]');
filterRadios.forEach(radio => {
  radio.addEventListener('change', event => {
    filterTasks(event.target.value);
  });
});

// ===============
// TASK OPERATIONS
// ===============

function newTask(name) {
  let id = getLastId() + 1;
  let datetime = isoDateNow();

  insertTask(id, name, datetime, false);
  saveTask(id, name, datetime, false);
}

// Inserts a new task visually
function insertTask(id, name, datetime, complete) {
  const task = document.createElement('li');

  task.dataset.id = id;
  let dateObj = new Date(Date.parse(datetime));
  let date = dateObj.toLocaleDateString();
  let time = dateObj.toLocaleTimeString();

  task.innerHTML = `
      <input type="checkbox" name="box-${id}" id="box-${id}" ${complete && 'checked'}>
      <div class="info">
        <label for="box-${id}" class="${complete && 'complete'}">${name}</label>
        <time datetime="${datetime}" class="hidden">Created on ${date} at ${time}</time>
      </div>
      <input type="text" name="inp-task-${id}" value="${name}" class="hidden">
      <button type="button" class="btn-info" title="View creation date"></button>
      <button type="button" class="btn-edit" title="Edit task"></button>
      <button type="button" class="btn-del" title="Delete task"></button>
  `;

  task.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
    let complete = event.target.checked;
    toggleCompletion(task, complete);
    saveTask(id, name, datetime, complete);
    refreshFiltering();
  });
  task.querySelector('.btn-del').addEventListener('click', () => deleteTask(task, id));
  task.querySelector('.btn-edit').addEventListener('click', () => toggleEdition(task));
  task.querySelector('input[type="text"]').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      let newName = event.target.value;
      editTask(task, newName);
      saveTask(id, newName, datetime);
    }
  });
  task.querySelector('.btn-info').addEventListener('click', () => toggleDateInfo(task));

  taskList.appendChild(task);
}

// Edits a task visually
function editTask(task, name) {
  let label = task.querySelector('label');
  let input = task.querySelector('input[type="text"]');
  
  label.textContent = name;
  input.value = name;
  
  toggleEdition(task);
}

// Delete a task both visually and storage-wise
function deleteTask(task, id) {
  let tasks = getStoredTasks();
  delete tasks[id];
  storeTasks(tasks);
  
  task.remove();
}

function saveTask(id, name, datetime, complete = null) {
  let storedTasks = getStoredTasks();
  let currentTask = {
    [id]: {
      name,
      datetime,
      complete: complete ?? storedTasks[id].complete
    }
  };

  storeTasks(Object.assign(storedTasks, currentTask));  
}

// =========
// FILTERING
// =========

function filterTasks(filterName) {
  const filterFunctions = {
    all: () => true,
    complete: completion => completion,
    active: completion => !completion
  }

  if (filterName in filterFunctions === false) return;

  let filter = filterFunctions[filterName];

  Array.from(taskList.children).forEach((task) => {
    let completion = task.querySelector('input[type="checkbox"]').checked;

    if (filter(completion)) {
      showElement(task);
    } else {
      hideElement(task);
    }
  });
}

function getCurrentFilter() {
  return document.querySelector('.filters input[type="radio"]:checked').value;
}

function refreshFiltering() {
  filterTasks(getCurrentFilter());
}

// =================
// TOGGLE OPERATIONS
// =================

function toggleCompletion(task, complete) {
  let label = task.querySelector('label');

  if (complete) {
    label.classList.add('complete');
  } else {
    label.classList.remove('complete');
  }
}


function toggleEdition(task) {
  let info = task.querySelector('.info');
  let input = task.querySelector('input[type="text"]');
  
  toggleElement(info);
  toggleElement(input);
}

function toggleDateInfo(task) {
  let time = task.querySelector('time');

  toggleElement(time);
}

function toggleElement(element) {
  element.classList.toggle('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function showElement(element) {
  element.classList.remove('hidden');
}

// ========================
// LOCAL STORAGE OPERATIONS
// ========================

function getStoredTasks() {
  return jsonParse(localStorage.getItem('tasks'));
}

function storeTasks(tasks) {
  return localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ================
// HELPER FUNCTIONS
// ================

function getLastId() {
  let lastChild = taskList.lastElementChild;
  return lastChild ? Number(lastChild.dataset.id) : 0;
}

function jsonParse(str) {
  try {
    return JSON.parse(str) || {};
  } catch {
    return {};
  }
}

function isoDateNow() {
  return (new Date()).toISOString();
}

// ================
// INITIALIZATION
// ================

function loadStoredTasks() {
  let storedTasks = getStoredTasks();

  for (id in storedTasks) {
    const {name, datetime, complete} = storedTasks[id];
    insertTask(id, name, datetime, complete);
  } 
}

loadStoredTasks();