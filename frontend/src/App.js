// --- React Frontend Setup Instructions ---
// 1. If you haven't already, create a new React app:
//    npx create-react-app my-todo-app
//    cd my-todo-app
//
// 2. Install Tailwind CSS (if not already set up):
//    npm install -D tailwindcss postcss autoprefixer
//    npx tailwindcss init -p
//    (Then configure your tailwind.config.js to scan your files)
//
// 3. Replace the content of src/App.js with the code below.
//
// 4. Start the React development server:
//    npm start
//
//    Ensure your Django backend is also running (python manage.py runserver)
//    The React app typically runs on http://localhost:3000

import React, { useState, useEffect } from 'react';

// Main App component for the To-Do application
function App() {
  // State to hold the list of To-Do items
  const [todos, setTodos] = useState([]);
  // State for the new To-Do title input field
  const [newTodoTitle, setNewTodoTitle] = useState('');
  // State for the new To-Do description input field
  const [newTodoDescription, setNewTodoDescription] = useState('');
  // State to manage the currently edited To-Do item
  const [editingTodo, setEditingTodo] = useState(null);

  // Base URL for the Django API
  const API_BASE_URL = 'http://localhost:8000/api/item/';

  // useEffect hook to fetch To-Do items when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch To-Do items from the Django API
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data); // Update the state with fetched todos
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Function to add a new To-Do item
  const addTodo = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!newTodoTitle.trim()) return; // Don't add empty titles

    const newTodo = {
      title: newTodoTitle,
      description: newTodoDescription,
      completed: false, // New todos are not completed by default
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json(); // We don't necessarily need the response data, but consume it
      setNewTodoTitle(''); // Clear the input field
      setNewTodoDescription(''); // Clear the description input field
      fetchTodos(); // Re-fetch todos to update the list
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Function to toggle the completion status of a To-Do item
  const toggleComplete = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      const response = await fetch(`${API_BASE_URL}${todo.id}/`, {
        method: 'PUT', // Use PUT for full update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      fetchTodos(); // Re-fetch to reflect the change
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Function to delete a To-Do item
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // No content in DELETE response, just check for success status
      fetchTodos(); // Re-fetch to remove the deleted item from the list
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Function to start editing a To-Do item
  const startEditing = (todo) => {
    setEditingTodo({ ...todo }); // Set a copy of the todo to be edited
  };

  // Function to handle changes in the editing form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to save the edited To-Do item
  const saveEdit = async () => {
    if (!editingTodo || !editingTodo.title.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}${editingTodo.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setEditingTodo(null); // Clear editing state
      fetchTodos(); // Re-fetch to update the list
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          My To-Do List
        </h1>

        {/* To-Do Input Form */}
        <form onSubmit={addTodo} className="mb-8 space-y-4">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add new todo title"
            className="w-full p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <textarea
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="Description (optional)"
            rows="3"
            className="w-full p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-105 shadow-md"
          >
            Add Todo
          </button>
        </form>

        {/* To-Do List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No todos yet! Add one above.</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg shadow-md transition duration-200 ease-in-out
                  ${todo.completed ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-50 border-l-4 border-blue-500'}`
                }
              >
                {editingTodo && editingTodo.id === todo.id ? (
                  // Editing mode
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={editingTodo.title}
                      onChange={handleEditChange}
                      className="w-full p-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                      name="description"
                      value={editingTodo.description || ''}
                      onChange={handleEditChange}
                      rows="2"
                      className="w-full p-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={saveEdit}
                        className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-purple-700 transition duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-500 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="flex-1 pr-4">
                    <h3
                      className={`text-lg font-semibold cursor-pointer ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                      onClick={() => toggleComplete(todo)}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-sm text-gray-600 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.description}
                      </p>
                    )}
                    <span className="text-xs text-gray-400 mt-1 block">
                      Created: {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {!editingTodo || editingTodo.id !== todo.id ? (
                  <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-3 md:mt-0">
                    <button
                      onClick={() => startEditing(todo)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-yellow-600 transition duration-200 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition duration-200 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
