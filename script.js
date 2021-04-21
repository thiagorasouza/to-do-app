// ================
// EVENT ATTACHMENT
// ================
const taskList = document.querySelector('.scn-listing ul');

const newTaskInput = document.getElementById('inp-new-task');
newTaskInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    insertTask(e.target.value);
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

  let idf = 'task-' + taskNum;

  task.innerHTML = `
      <input type="checkbox" name="task-${taskNum}" id="task-${taskNum}">
      <label for="task-${taskNum}">${desc}</label>
      <button type="button" data-id="${taskNum}">-</button>
  `;

  task.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTask(task));
  task.querySelector('button').addEventListener('click', () => deleteTask(task));

  taskList.appendChild(task);
}

function toggleTask(task) {
  task.classList.toggle('complete');
}

function deleteTask(task) {
  task.remove();
}

// ================
// HELPER FUNCTIONS
// ================
function getLastNum() {
  let lastChild = taskList.lastElementChild;
  return lastChild ? lastChild.dataset.id : 0;
}

// ================
// INITIALIZATION
// ================
insertTask('Task 1');
insertTask('Task 2');
insertTask('Task 3');