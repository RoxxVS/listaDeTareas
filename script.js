// Selección de elementos del DOM
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
// Carga datos de tareas desde localStorage o inicializa con un array vacío si no existen datos
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};
// Función para agregar o actualizar una tarea
const addOrUpdateTask = () => {
  if (!titleInput.value.trim()) {
    alert("Por favor, proporciona un título.");
    return;
  }
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  currentTask.title = titleInput.value;
  currentTask.date = dateInput.value;
  currentTask.description = descriptionInput.value;
  if (dataArrIndex > -1) taskData.splice(dataArrIndex, 1); // Elimina la tarea existente si se edita
  taskData.push(currentTask); // Añade la tarea nueva o editada
  localStorage.setItem("data", JSON.stringify(taskData)); // Guarda en localStorage
}
// Renderiza las tareas en el contenedor
const renderTasks = () => {
  tasksContainer.innerHTML = "";
  if (taskData.length < 1) {
    tasksContainer.innerHTML = "<p>No hay tareas guardadas</p>";
    return;
  }
  taskData.map((task) => {
    // Crea el elemento de tarea con opciones de edición y borrado
    const taskElem = document.createElement("div");
    taskElem.className = "task";
    taskElem.innerHTML = `
    <div class="tarea">
      <p><strong>${task.title}</strong> - ${task.date}</p>
      <p>${task.description}</p>
      <div class="flex">
        <button class="btn edit-task-btn">Editar</button>
        <button class="btn delete-task-btn">Eliminar</button>
      </div>
    </div>
    `;
    // Evento para editar la tarea
    taskElem.querySelector(".edit-task-btn").onclick = () => {
      taskForm.classList.remove("hidden");
      openTaskFormBtn.classList.add("hidden");
      currentTask = task; // Establece la tarea actual
      titleInput.value = currentTask.title;
      dateInput.value = currentTask.date;
      descriptionInput.value = currentTask.description;
    };
    // Evento para eliminar la tarea
    taskElem.querySelector(".delete-task-btn").onclick = () => {
      const index = taskData.findIndex((item) => item.id === task.id);
      if (index > -1) taskData.splice(index, 1); // Elimina la tarea del array
      localStorage.setItem("data", JSON.stringify(taskData)); // Actualiza localStorage
      renderTasks(); // Vuelve a renderizar las tareas
    };
    tasksContainer.appendChild(taskElem);
  });
};
// Configura el formulario y los botones
const setupForm = () => {
  openTaskFormBtn.onclick = () => {
    taskForm.classList.remove("hidden");
    openTaskFormBtn.classList.add("hidden");
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    currentTask = {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`, // ID único
    };
  };
  addOrUpdateTaskBtn.onclick = (e) => {
    e.preventDefault();
    addOrUpdateTask();
    renderTasks();
    taskForm.classList.add("hidden");
    openTaskFormBtn.classList.remove("hidden");
  };
  closeTaskFormBtn.onclick = () => {
    if (!titleInput.value && !dateInput.value && !descriptionInput.value) {
      taskForm.classList.add("hidden");
      openTaskFormBtn.classList.remove("hidden");
      return;
    }
    confirmCloseDialog.showModal();
  };
  discardBtn.onclick = () => {
    confirmCloseDialog.close();
    taskForm.classList.add("hidden");
    openTaskFormBtn.classList.remove("hidden");
  };
  cancelBtn.onclick = () => confirmCloseDialog.close();
};
// Inicializa el formulario y renderiza las tareas al cargar la página
setupForm();
renderTasks();
