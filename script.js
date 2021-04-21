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

// ============
// USER ACTIONS
// ============

function insertTask(desc) {
  const task = document.createElement('li');

  let taskNum = Number(getLastNum()) + 1;
  task.dataset.id = taskNum;

  task.innerHTML = `
      <input type="checkbox" name="box-task-${taskNum}" id="box-task-${taskNum}">
      <label for="box-task-${taskNum}">${desc}</label>
      <input type="text" name="inp-task-${taskNum}" value="${desc}" hidden>
      <button type="button" class="btn-edit-task">E</button>
      <button type="button" class="btn-del-task">D</button>
  `;

  task.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleCompletion(task));
  task.querySelector('.btn-del-task').addEventListener('click', () => deleteTask(task));
  task.querySelector('.btn-edit-task').addEventListener('click', () => toggleEdition(task));
  task.querySelector('input[type="text"]').addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      editTask(task, event.target.value);
    }
  });
  
  taskList.appendChild(task);
}

function toggleCompletion(task) {
  task.querySelector('label').classList.toggle('complete');
}

function deleteTask(task) {
  task.remove();
}

function toggleEdition(task) {
  let label = task.querySelector('label');
  let input = task.querySelector('input[type="text"]');
  
  toggleElement(label);
  toggleElement(input);
}

function editTask(task, desc) {
  let label = task.querySelector('label');
  let input = task.querySelector('input[type="text"]');

  label.textContent = desc;

  toggleElement(label);
  toggleElement(input);

  input.value = desc;
}

// ================
// HELPER FUNCTIONS
// ================
function getLastNum() {
  let lastChild = taskList.lastElementChild;
  return lastChild ? lastChild.dataset.id : 0;
}

function toggleElement(element) {
  element.toggleAttribute('hidden');
}

// function onInputEnter(element, callback) {
//   element.addEventListener('keyup', event => {
//     if (event.key === 'Enter') {
//       callback(event.target.value);
//     }
//   });
// }

// ================
// INITIALIZATION
// ================
insertTask('Task 1');
insertTask('Task 2');
insertTask('Task 3');