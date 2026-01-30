import axios from 'axios';

// Backend URL (Agar aapka server 5000 port par chal raha hai)
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// --- Board API Calls ---
// Naya board banane ke liye
export const createBoard = (boardData) => API.post('/boards', boardData);

// User ke email ke basis par boards load karne ke liye
export const fetchBoards = (email) => API.get(`/boards/${email}`);

// Board delete karne ke liye
export const deleteBoard = (id) => API.delete(`/boards/${id}`);


// --- Todo API Calls ---
// Board ke andar naya task (todo) banane ke liye
export const createTodo = (todoData) => API.post('/todos', todoData);

// Kisi specific board ke saare tasks lane ke liye
export const fetchTodos = (boardId) => API.get(`/todos/${boardId}`);

// Task ka status update karne ke liye (pending to completed)
export const updateTodo = (id, updatedData) => API.put(`/todos/${id}`, updatedData);

// Task delete karne ke liye
export const deleteTodo = (id) => API.delete(`/todos/${id}`);

// --- UPDATE BOARD ADDED BELOW ---
export const updateBoard = (id, boardData) => API.put(`/boards/${id}`, boardData);

export default API;