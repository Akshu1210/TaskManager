document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');
    const statsTotal = document.getElementById('totalTasks');
    const statsCompleted = document.getElementById('completedTasks');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Function to save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    };

    // Update statistics
    const updateStats = () => {
        statsTotal.textContent = `Total: ${tasks.length}`;
        const completed = tasks.filter(task => task.completed).length;
        statsCompleted.textContent = `Completed: ${completed}`;
    };

    // Function to render tasks
    const renderTasks = () => {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `priority-${task.priority}`;
            
            const date = new Date(task.dateAdded).toLocaleDateString();
            li.innerHTML = `
                <div class="task-content">
                    <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                    <span class="date-added">${date}</span>
                </div>
                <div class="task-buttons">
                    <button class="complete-btn" onclick="toggleTask(${index})">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    // Add task function
    window.addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                text,
                completed: false,
                priority: prioritySelect.value,
                dateAdded: new Date().toISOString()
            });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    };

    // Toggle task completion
    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    // Delete task
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    // Filter handlers
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.id.replace('show', '').toLowerCase();
            renderTasks();
        });
    });

    // Clear completed tasks
    document.getElementById('clearCompleted').addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    // Event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial render
    updateStats();
    renderTasks();
}); 