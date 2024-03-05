document.addEventListener('DOMContentLoaded', function () {
  const inputTodo = document.querySelector('.new-todo');
  const todoList = document.querySelector('.todo-list');
  const clearCompletedButton = document.querySelector('.clear-completed');
  const filters = document.querySelectorAll('.filters li a');
  const todoCount = document.querySelector('.todo-count');
  const toggleAllCheckbox = document.querySelector('.toggle-all[type="checkbox"]'); // Updated selector for the checkbox

  let todos = [];

  function renderTodos() {
    const currentFilter = document.querySelector('.filters li a.selected').innerText.toLowerCase();
    const filteredTodos = {
      all: todos,
      active: todos.filter(todo => !todo.completed),
      completed: todos.filter(todo => todo.completed)
    }[currentFilter];

    todoList.innerHTML = filteredTodos.map(todo => `
      <li data-id="${todo.id}"${todo.completed ? ' class="completed"' : ''}>
        <div class="view">
          <input class="toggle" type="checkbox"${todo.completed ? ' checked' : ''}>
          <label>${todo.title}</label>
          <button class="destroy">❌</button>
        </div>
      </li>
    `).join('');

    const activeTodoCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeTodoCount} ${activeTodoCount === 1 ? 'item' : 'items'} left`;


    toggleAllCheckbox.checked = todos.length > 0 && todos.every(todo => todo.completed);
  }

  inputTodo.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
      todos.push({ id: Date.now(), title: this.value.trim(), completed: false });
      renderTodos();
      this.value = '';
    }
  });

  todoList.addEventListener('change', function (e) {
    if (e.target.classList.contains('toggle')) {
      const todoId = parseInt(e.target.closest('li').dataset.id);
      todos.find(todo => todo.id === todoId).completed = e.target.checked;
      renderTodos();
    }
  });

  todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('destroy')) {
      todos = todos.filter(todo => todo.id !== parseInt(e.target.closest('li').dataset.id));
      renderTodos();
    }
  });

  clearCompletedButton.addEventListener('click', function () {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
  });

  filters.forEach(filter => {
    filter.addEventListener('click', function (e) {
      e.preventDefault();
      filters.forEach(f => f.classList.toggle('selected', f === filter));
      renderTodos();
    });
  });


  toggleAllCheckbox.addEventListener('change', function () {
    const isChecked = this.checked;
    todos.forEach(todo => todo.completed = isChecked);
    renderTodos();
  });

  renderTodos();
});