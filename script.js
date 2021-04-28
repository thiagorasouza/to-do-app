// ================
// EVENT ATTACHMENT
// ================

const taskList = document.querySelector('.scn-listing ul');

const newTaskInput = document.getElementById('inp-new-task');
newTaskInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    insertTask(event.target.value);
  }
});

const newTaskBtn = document.querySelector('.btn-new-task');
newTaskBtn.addEventListener('click', () => insertTask(newTaskInput.value));


const filterRadios = document.querySelectorAll('.scn-selectors input[type="radio"]');
filterRadios.forEach(radio => {
  radio.addEventListener('change', event => {
    filterTasks(event.target.value);
  });
});

// ============
// USER ACTIONS
// ============

function insertTask(name) {
  const task = document.createElement('li');

  let taskNum = getLastNum() + 1;
  task.dataset.id = taskNum;

  let dateObj = new Date();
  let date = dateObj.toLocaleDateString();
  let time = dateObj.toLocaleTimeString();
  console.log(date);
  // todo date

  task.innerHTML = `
      <input type="checkbox" name="box-task-${taskNum}" id="box-task-${taskNum}">
      <div class="task-info">
        <label title="Created on ${date} at ${time}" for="box-task-${taskNum}">${name}</label>
        <time datetime="${dateObj.toISOString()}" class="hidden">Created on ${date} at ${time}</time>
      </div>
      <input type="text" name="inp-task-${taskNum}" value="${name}" class="hidden">
      <button type="button" class="btn-info-task">&nbsp;I&nbsp;</button>
      <button type="button" class="btn-edit-task">E</button>
      <button type="button" class="btn-del-task">D</button>
  `;

  task.querySelector('input[type="checkbox"]').addEventListener('change', () => {
    toggleCompletion(task);
    refreshFilter();
  });
  task.querySelector('.btn-del-task').addEventListener('click', () => deleteTask(task));
  task.querySelector('.btn-edit-task').addEventListener('click', () => toggleEdition(task));
  task.querySelector('input[type="text"]').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      editTask(task, event.target.value);
    }
  });
  task.querySelector('.btn-info-task').addEventListener('click', () => toggleDateInfo(task));

  newTaskInput.value = '';

  taskList.appendChild(task);

  if (getCurrentFilter() === 'complete') {
    document.getElementById('filter-all').checked = true;
    refreshFilter();
  }  
}

function toggleCompletion(task) {
  task.querySelector('label').classList.toggle('complete');
}

function deleteTask(task) {
  task.remove();
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

function getLastNum() {
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

// ================
// INITIALIZATION
// ================

insertTask('Task 1');
insertTask('Task 2');
insertTask('Task 3');