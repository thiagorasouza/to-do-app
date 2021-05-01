// ================
// EVENT ATTACHMENT
// ================

const taskList = document.querySelector('.scn-listing ul');

const newTaskInput = document.getElementById('inp-new-task');
newTaskInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    newTask(event.target.value);
  }
});

const newTaskBtn = document.querySelector('.btn-new-task');
newTaskBtn.addEventListener('click', () => newTask(newTaskInput.value));

const filterRadios = document.querySelectorAll('.scn-selectors input[type="radio"]');
filterRadios.forEach(radio => {
  radio.addEventListener('change', event => {
    filterTasks(event.target.value);
  });
});

// ============
// USER ACTIONS
// ============

function newTask(name) {
  let id = getLastId() + 1;
  let datetime = isoDateNow();

  insertTask(id, name, datetime, false);
  saveTask(id, name, datetime, false);

  newTaskInput.value = '';

  if (getCurrentFilter() === 'complete') {
    document.getElementById('filter-all').checked = true;
    refreshFilter();
  }  
}

function insertTask(id, name, datetime, complete) {
  const task = document.createElement('li');

  task.dataset.id = id;
  let dateObj = new Date(Date.parse(datetime));
  let date = dateObj.toLocaleDateString();
  let time = dateObj.toLocaleTimeString();

  // console.log(name, complete);

  task.innerHTML = `
      <input type="checkbox" name="box-task-${id}" id="box-task-${id}" ${complete && 'checked'}>
      <div class="task-info">
        <label for="box-task-${id}" class="${complete && 'complete'}">${name}</label>
        <time datetime="${datetime}" class="hidden">Created on ${date} at ${time}</time>
      </div>
      <input type="text" name="inp-task-${id}" value="${name}" class="hidden">
      <button type="button" class="btn-info-task">I</button>
      <button type="button" class="btn-edit-task">E</button>
      <button type="button" class="btn-del-task">D</button>
  `;

  task.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
    let complete = event.target.checked;
    toggleCompletion(task, complete);
    saveTask(id, name, datetime, complete);
    refreshFilter();
  });
  task.querySelector('.btn-del-task').addEventListener('click', () => deleteTask(task, id));
  task.querySelector('.btn-edit-task').addEventListener('click', () => toggleEdition(task));
  task.querySelector('input[type="text"]').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      let newName = event.target.value;
      editTask(task, newName);
      saveTask(id, newName, datetime);
    }
  });
  task.querySelector('.btn-info-task').addEventListener('click', () => toggleDateInfo(task));

  taskList.appendChild(task);
}

function getStoredTasks() {
  return jsonParse(localStorage.getItem('tasks'));
}

function storeTasks(tasks) {
  return localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadStoredTasks() {
  let storedTasks = getStoredTasks();
  // console.log(storedTasks);

  for (id in storedTasks) {
    const {name, datetime, complete} = storedTasks[id];
    insertTask(id, name, datetime, complete);
  }  
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

function toggleCompletion(task, complete) {
  if (complete) {
    task.querySelector('label').classList.add('complete');
  } else {
    task.querySelector('label').classList.remove('complete');
  }
}

function deleteTask(task, id) {
  task.remove();

  let tasks = getStoredTasks();
  delete tasks[id];
  storeTasks(tasks);
}

function toggleEdition(task) {
  let info = task.querySelector('.task-info');
  let input = task.querySelector('input[type="text"]');
  
  toggleElement(info);
  toggleElement(input);
}

function editTask(task, name) {
  let info = task.querySelector('.task-info');
  let label = task.querySelector('label');
  let input = task.querySelector('input[type="text"]');

  label.textContent = name;

  toggleElement(info);
  toggleElement(input);

  input.value = name;
}

function toggleDateInfo(task) {
  let time = task.querySelector('time');

  toggleElement(time);
}

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
  return document.querySelector('.scn-selectors input[type="radio"]:checked').value;
}

function refreshFilter() {
  filterTasks(getCurrentFilter());
}

// ================
// HELPER FUNCTIONS
// ================

function getLastId() {
  let lastChild = taskList.lastElementChild;
  return lastChild ? Number(lastChild.dataset.id) : 0;
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

function jsonParse(str) {
  try {
    return JSON.parse(str);
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

loadStoredTasks();
// newTask('Task 1');
// newTask('Task 2');
// newTask('Task 3');