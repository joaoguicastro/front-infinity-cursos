import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AdminSidebar from '../../components/sidebarAdmin/AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<string[]>([]);

  useEffect(() => {
    const savedTasks = Cookies.get('taskList');
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    Cookies.set('taskList', JSON.stringify(taskList), { expires: 7 });
  }, [taskList]);

  const handleAddTask = () => {
    if (task.trim()) {
      setTaskList([...taskList, task.trim()]);
      setTask('');
    }
  };

  const handleRemoveTask = (index: number) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
  };

  return (
    <div id="adminDashboard-container">
      <AdminSidebar />
      <div id="adminDashboard-content">
        <h1 className="adminDashboard-title">Lista de Tarefas</h1>
        <div className="adminDashboard-taskInputContainer">
          <input
            type="text"
            className="adminDashboard-taskInput"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Adicionar nova tarefa"
          />
          <button className="adminDashboard-addTaskButton" onClick={handleAddTask}>
            Adicionar
          </button>
        </div>
        <ul className="adminDashboard-taskList">
          {taskList.map((item, index) => (
            <li key={index} className="adminDashboard-taskItem">
              {item}
              <button
                className="adminDashboard-removeTaskButton"
                onClick={() => handleRemoveTask(index)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
