let todos = JSON.parse(localStorage.getItem('todos')) || []
let currentFilter = 'all';
function addTodo(todos, task) {
  const newTodo = {
    id: Date.now(),
    task: task,
    completed: false,
  }

  console.log({task})

  todos.push(newTodo)
  updateLocalStorage(todos)

  return todos
}

function removeTodo(todos, id) {
  const updatedTodos = todos.filter((todo) => todo.id !== parseInt(id))
  updateLocalStorage(updatedTodos)
  return updatedTodos
}

function toggleTodoStatus(todos, id) {
  const updatedTodos = todos.map((todo) => {
    if (todo.id === parseInt(id)) {
      return { ...todo, completed: !todo.completed }
    }
    return todo
  })
  updateLocalStorage(updatedTodos)
  return updatedTodos
}

function updateLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos))
}

function getTodos(todos, filter = 'all') {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed)
    case 'completed':
      return todos.filter((todo) => todo.completed)
    default:
      return todos
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const addTodoInput = document.getElementById('new-todo')
  const todoListDiv = document.getElementById('todo-list')
  const addTodoButton = document.getElementById('add-todo')

  addTodoInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
    if (addTodoInput.value.trim() === '') {
            addTodoInput.classList.add('error');
            return; 
    } else {
        addTodoInput.classList.remove('error');
    }
    
todos = addTodo(todos, addTodoInput.value.trim())
      addTodoInput.value = '';

      render(todos) 
    }
    })


  addTodoButton.addEventListener('click', () => {
    if (addTodoInput.value.trim() === '') {
            addTodoInput.classList.add('error');
            return; 
    } else {
        addTodoInput.classList.remove('error');
    }
    
todos = addTodo(todos, addTodoInput.value.trim())
      addTodoInput.value = '';

      render(todos) 
  })

  todoListDiv.addEventListener('click', (e) => {
    if (e.target.className === 'delete') {
      todos = removeTodo(todos, e.target.dataset.id)
      render(todos)
    } else if (e.target.type === 'checkbox') {
      todos = toggleTodoStatus(todos, e.target.dataset.id)
      render(todos)
    }
  })

  function filterActive() {
    document.getElementById('filter-active').addEventListener('click', function () {
        if (currentFilter !== 'active') {
          render(todos, 'active');
          currentFilter = 'active';
        }
      });
  }

  function filterAll() {
    document.getElementById('filter-all').addEventListener('click', function () {
        if (currentFilter !== 'all') {
          render(todos);
          currentFilter = 'all';
        }
      })
  }

  function filterCompleted() {
    document.getElementById('filter-completed').addEventListener('click', function () {
        if (currentFilter !== 'completed') {
          render(todos, 'completed');
          currentFilter = 'completed';
        }
      });
  }

  
  function taskEdit () {
    todoListDiv.addEventListener('click', (event) => {
        const targetSpan = event.target.closest('span');
        if (!targetSpan) return;

        const span = targetSpan;
        span.contentEditable = true;
        span.focus();

        span.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                span.contentEditable = false;
                const taskId = span.parentElement.querySelector('.custom-checkbox').dataset.id;
                const newText = span.innerText;
                saveEditedTask(taskId, newText);
            }
        });

        span.addEventListener('blur', () => {
            span.contentEditable = false;
            const taskId = span.parentElement.querySelector('.custom-checkbox').dataset.id;
            const newText = span.innerText;
            saveEditedTask(taskId, newText);
        });
    });
}

function saveEditedTask(taskId, newText) {
    todos = todos.map(todo => {
        if (todo.id === parseInt(taskId)) {
            todo.task = newText;
        }
        return todo;
    });
    render(todos, currentFilter);
    updateLocalStorage(todos);
}

  function render(todos, filter = 'all') {
    todoListDiv.innerHTML = getTodos(todos, filter)
      .map(
        (todo) => `
            <div class="task__input">
                <input class="custom-checkbox" type="checkbox" ${
                  todo.completed ? 'checked' : ''
                } data-id="${todo.id}">
                <span class=${todo.completed ? 'completed' : ''}>${todo.task}</span>
                <button class="delete" data-id="${todo.id}">Удалить</button>
            </div>
        `
      )
      .join('')
  }
  
  filterAll();
  filterActive();
  filterCompleted();
  render(todos);
  taskEdit();
})

