import React, { useState, useEffect } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import '../App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, [categoryFilter]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/todos', { params: { category: categoryFilter } });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTask = async () => {
    if (input.trim() !== '') {
      try {
        const newTodo = { text: input, completed: false, category: 'incomplete' };
        const response = await axios.post('http://127.0.0.1:8000/todos', newTodo);
        setTodos([...todos, response.data]);
        setInput('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editTask = async (id, newText) => {
    try {
      const updatedTodo = todos.find(todo => todo.id === id);
      if (updatedTodo) {
        updatedTodo.text = newText;
        await axios.put(`http://127.0.0.1:8000/todos/${id}`, updatedTodo);
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      }
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const toggleCompleted = async (id) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/todos/${id}`);
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEditingTextChange = (e) => {
    setEditingText(e.target.value);
  };

  const saveEdit = (id) => {
    editTask(id, editingText);
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-r from-amber-600 to-amber-100 bg-center bg-cover'>
      <div className='bg-orange-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4'>
        <h1 className='text-5xl font-bold text-center text-orange-600 mb-4'>Todo App</h1>
        <div className='flex'>
          <input
            type="text"
            placeholder='Add to todo'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='py-2 px-4 border rounded w-full focus:outline-none mr-2'
          />
          <button
            onClick={addTask}
            className='bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded'
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <div className='bg-orange-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4'>
        <div className="flex justify-center mb-4">
          <button onClick={() => handleCategoryChange('all')} className={`mr-2 p-2 rounded ${categoryFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>All</button>
          <button onClick={() => handleCategoryChange('incomplete')} className={`mr-2 p-2 rounded ${categoryFilter === 'incomplete' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'}`}>Incomplete</button>
          <button onClick={() => handleCategoryChange('completed')} className={`p-2 rounded ${categoryFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>Completed</button>
        </div>
        <ul>
          {todos
            .map((todo) => (
              <li key={todo.id} className={`flex items-center justify-between bg-white p-3 rounded shadow-md mb-3 ${todo.completed ? 'line-through' : ''}`}>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleCompleted(todo.id)}
                    className={`mr-2 p-2 ${todo.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded`}
                  >
                    <FaCheck />
                  </button>
                  {editingId === todo.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editingText}
                        onChange={handleEditingTextChange}
                        className='py-2 px-4 border rounded w-full focus:outline-none mr-2'
                      />
                      <div>
                        <button onClick={() => saveEdit(todo.id)} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ml-2">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className='text-lg'>{todo.text}</span>
                  )}
                </div>
                <div>
                  {editingId !== todo.id && (
                    <>
                      <button onClick={() => setEditingId(todo.id)} className='mr-2 p-2 bg-gradient-to-r bg-orange-500 hover:bg-orange-600 text-white rounded'>
                        <FaPencilAlt />
                      </button>
                      <button onClick={() => deleteTask(todo.id)} className='p-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded'>
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex flex-col items-center absolute bottom-4">
        <p className="text-lg mt-2  text-white">✨ Muhammad Raihan Zulfi - 2602229673</p>
      </div>
    </div>
  );
}

export default App;
