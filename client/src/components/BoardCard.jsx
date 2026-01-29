import React, { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api';
import { Plus, Sparkles, Zap, Lightbulb } from 'lucide-react';
import TodoItem from './TodoItem';

const BoardCard = ({ board }) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  
  //  AUTO-SUGGESTION STATE 
  const [localSuggestions, setLocalSuggestions] = useState([]);
  const quickActions = ["Review Notes", "Update Status", "Send Email", "Research", "Meeting"];

  useEffect(() => {
    loadTodos();
  }, [board._id]);

  // Suggestions filter logic
  useEffect(() => {
    if (task.length > 0) {
      const filtered = quickActions.filter(a => 
        a.toLowerCase().includes(task.toLowerCase())
      );
      setLocalSuggestions(filtered);
    } else {
      setLocalSuggestions([]);
    }
  }, [task]);

  const loadTodos = async () => {
    try {
      const res = await fetchTodos(board._id);
      setTodos(res.data);
    } catch (err) {
      console.error("Error loading todos", err);
    }
  };

  const handleAddTodo = async (e) => {
    if (e) e.preventDefault();
    if (!task) return;

    let tasksToCreate = [task];
    const input = task.toLowerCase();

    if (input.includes("exam") || input.includes("study")) {
      tasksToCreate = [task, "↳ Review syllabus", "↳ Solve sample paper", "↳ Final revision"];
    } else if (input.includes("project") || input.includes("assignment")) {
      tasksToCreate = [task, "↳ Research & Outline", "↳ Draft content", "↳ Proofread & Submit"];
    } else if (input.includes("trip") || input.includes("travel")) {
      tasksToCreate = [task, "↳ Book tickets/Hotel", "↳ Pack bags", "↳ Set out of office mail"];
    }

    try {
      for (const t of tasksToCreate) {
        await createTodo({ task: t, boardId: board._id });
      }
      setTask('');
      setLocalSuggestions([]);
      loadTodos();
    } catch (err) {
      console.error("Failed to add tasks", err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await updateTodo(id, { status: newStatus });
    loadTodos();
  };

  return (
    <div className="glass p-6 rounded-3xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
      <div className="flex justify-between items-center mb-5 border-b border-white/20 pb-3">
        <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase italic">{board.title}</h3>
        <Sparkles size={18} className="text-blue-500 animate-pulse" />
      </div>
      
      {/* Input Form with Suggestions */}
      <div className="relative mb-6">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 bg-white/40 p-3 rounded-xl border border-white/20 focus:border-blue-500 focus:bg-white/60 outline-none text-sm transition-all placeholder:text-gray-500 font-bold"
            placeholder="Add something smart..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
            <Plus size={20} />
          </button>
        </form>

        {/* ---  INLINE AUTO-SUGGESTION DROPDOWN --- */}
        {localSuggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-30 overflow-hidden">
            {localSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setTask(s);
                  setLocalSuggestions([]);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <Zap size={10} fill="currentColor" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Todo List */}
      <ul className="space-y-3">
        {todos.map((todo, index) => {
          const isLocked = index > 0 && todos[index - 1].status !== 'completed';
          
          return (
            <TodoItem 
              key={todo._id}
              todo={todo}
              isLocked={isLocked}
              toggleStatus={toggleStatus}
              deleteTodo={async (id) => { await deleteTodo(id); loadTodos(); }}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default BoardCard;