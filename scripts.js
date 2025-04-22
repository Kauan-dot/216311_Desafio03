function renderTasksProgressData(tasks) {
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');

    if (tasksProgressDOM) tasksProgress = tasksProgressDOM;
    else {
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementById('board-footer').appendChild(newTasksProgressDOM);
        tasksProgress = newTasksProgressDOM;
    }

    const completedTasks = tasks.filter(task => task.checked).length;
    tasksProgress.textContent = `${completedTasks} tarefa concluída`;
}

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
};

const setTaskInLocalStorage = () => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
};

const createTaskItem = (task) => {
    const item = document.createElement("li");
    const checkbox = getCheckboxInput(task.id, task.name, task.tag, task.data, task.checked);
    item.appendChild(checkbox);
    return item;
};

function checkedTask(button, label, taskId) {
    const isChecked = button.classList.toggle("checked");
    label.classList.toggle("checked", isChecked);
    button.textContent = "";

    if (isChecked) {
        const checkItem = document.createElement("i");
        checkItem.className = "fa-solid fa-check";
        button.appendChild(checkItem);
    } else {
        button.textContent = "Concluir";
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].checked = isChecked;
        setTaskInLocalStorage();
        renderTasksProgressData(tasks);
    }
}

function getCheckboxInput(id, name, tag, data, isChecked = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = `checkbox-${id}`;
    button.className = "task-checkbox";
    button.textContent = isChecked ? "" : "Concluir";

    const label = document.createElement("label");
    label.htmlFor = button.id;
    label.className = "task-name";
    label.textContent = name;
    label.classList.toggle("checked", isChecked);

    if (isChecked) {
        const checkIcon = document.createElement("i");
        checkIcon.className = "fa-solid fa-check";
        button.appendChild(checkIcon);
        button.classList.add("checked");
    }

    button.addEventListener("click", () => {
        checkedTask(button, label, id);
    });

    const tagSpan = document.createElement("span");
    tagSpan.className = "task-tag";
    tagSpan.textContent = tag;

    const dateSpan = document.createElement("span");
    dateSpan.className = "task-date";
    dateSpan.textContent = data;

    const infoLine = document.createElement("div");
    infoLine.className = "task-info-line";
    infoLine.appendChild(tagSpan);
    infoLine.appendChild(dateSpan);

    const descriptionTask = document.createElement("div");
    descriptionTask.className = "task-description";
    descriptionTask.appendChild(label);
    descriptionTask.appendChild(infoLine);

    const wrapper = document.createElement("div");
    wrapper.className = "task-wrapper";
    wrapper.appendChild(descriptionTask);
    wrapper.appendChild(button);

    return wrapper;
}

const getNewtaskId = () => {
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
};

const getNewTaskData = (event) => {
    const task = event.target.elements.task.value;
    const tag = event.target.elements.tag.value;
    const id = getNewtaskId();

    return {
        id,
        name: task,
        tag,
        data: 'Criado em: ' + new Date().toLocaleDateString(),
        checked: false
    };
};

const createTask = (event) => {
    event.preventDefault();

    const newTaskData = getNewTaskData(event);
    const todo = createTaskItem(newTaskData);
    document.getElementById("task-list").prepend(todo);

    tasks.push(newTaskData);
    setTaskInLocalStorage(tasks);
    renderTasksProgressData(tasks);

    event.target.reset();
};

let tasks = getTasksFromLocalStorage();

window.onload = function () {
    const form = document.getElementById("form-tasks");
    const taskList = document.getElementById("task-list");
    form.addEventListener('submit', createTask);

    tasks.forEach(task => {
        const todo = createTaskItem(task);
        taskList.prepend(todo); // adiciona no topo
    });

    renderTasksProgressData(tasks);
};

