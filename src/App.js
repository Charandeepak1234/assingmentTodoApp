import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: token }
      });
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post('/api/tasks', { title: taskTitle }, {
        headers: { Authorization: token }
      });
      setTasks([...tasks, response.data]);
      setTaskTitle('');
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const handleLogin = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);  // Add fetchTasks to the dependency array
  

  return (
    <div>
      <h1>Todo App</h1>
      {token ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          <button onClick={() => handleLogin('your-jwt-token')}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
