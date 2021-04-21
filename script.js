// let itemNum = 1;

const taskList = document.querySelector('.scn-listing ul');

const newTaskInput = document.getElementById('inp-new-task');
newTaskInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    insertTask(e.target.value);
  }
});

const newTaskBtn = document.querySelector('.btn-new-task');
newTaskBtn.addEventListener('click', () => insertTask(newTaskInput.value));

function getLastNum() {
  let lastChild = taskList.lastElementChild;
  return lastChild ? lastChild.dataset.id : 0;
}

function insertTask(desc) {
  const task = document.createElement('li');

  let taskNum = Number(getLastNum()) + 1;
  task.dataset.id = taskNum;

  task.innerHTML = `
      <input type="checkbox" name="task-${taskNum}" id="task-${taskNum}">
      <label for="task-${taskNum}">${desc}</label>
      <button type="button">-</button>
  `;

  task.querySelector('input[type="checkbox"]').addEventListener('change', toggleTask);

  taskList.appendChild(task);
}

function toggleTask(e) {
    e.target.parentElement.classList.toggle('complete');
}