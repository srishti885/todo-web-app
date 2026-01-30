import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { fetchTodos, createTodo, updateTodo, deleteTodo, updateBoard } from '../api'; 
import { Plus, Sparkles, Zap, Edit2, Loader2 } from 'lucide-react'; 
import TodoItem from './TodoItem';

const BoardCard = ({ board }) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);

  const [localSuggestions, setLocalSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false); 
  const [isInputFocused, setIsInputFocused] = useState(false); 
  
  const smartContext = {
    gym: ["Workout Session", "Protein Shake", "Track Water", "Leg Day", "Cardio", "Gym Gear"],
    study: ["Review Notes", "Read Chapter", "Solve Paper", "Assignment", "Library Session"],
    work: ["Team Meeting", "Send Email", "Fix Bug", "Code Review", "Update Jira", "Client Call"],
    trip: ["Book Tickets", "Pack Bags", "Hotel Check", "Plan Route", "Travel Insurance"],
    home: ["Buy Groceries", "Clean Room", "Laundry", "Pay Bills", "Kitchen Restock"]
  };

  const quickActions = [
    "Review Notes", "Update Status", "Send Email", "Research", "Meeting",
    "Complete Assignment", "Fix Bug", "Deployment", "Database Backup",
    "Client Call", "Project Planning", "UI Design", "Testing", "Documentation",
    "Code Review", "Market Analysis", "Coffee Break", "Gym Session", "Buy Groceries"
  ];

  useEffect(() => {
    loadTodos();
  }, [board._id]);

  useEffect(() => {
    const handleSuggestions = async () => {
      const boardTitle = board.title.toLowerCase();
      let activeSuggestions = quickActions;
      
      Object.keys(smartContext).forEach(key => {
        if (boardTitle.includes(key)) {
          activeSuggestions = [...smartContext[key], ...quickActions];
        }
      });

      const input = task.toLowerCase();
      let subTaskPreview = [];
      if (input.includes("exam") || input.includes("study")) {
        subTaskPreview = ["Review syllabus", "Solve sample paper", "Final revision"];
      } else if (input.includes("project") || input.includes("work")) {
        subTaskPreview = ["Research & Outline", "Draft content", "Proofread & Submit"];
      } else if (input.includes("trip") || input.includes("travel")) {
        subTaskPreview = ["Book tickets/Hotel", "Pack bags", "Set out of office mail"];
      } else if (input.includes("gym") || input.includes("fitness")) {
        subTaskPreview = ["Workout session", "Drink protein shake", "Track water intake"];
      } else if (input.includes("code") || input.includes("bug")) {
        subTaskPreview = ["Fix logic error", "Run local tests", "Push to production"];
      }

      if (task.length > 0) {
        const filtered = activeSuggestions.filter((a, index, self) => 
          a.toLowerCase().includes(task.toLowerCase()) && self.indexOf(a) === index
        ).slice(0, 6);
        setLocalSuggestions([...subTaskPreview, ...filtered]);
      } else {
        setLocalSuggestions(activeSuggestions.slice(0, 6));
      }

      if (task.length >= 1) { 
        setIsAiLoading(true);
        try {
          const res = await axios.post('http://localhost:5000/api/ai/suggest', {
            boardTitle: board.title,
            currentTask: task
          });
          if (res.data.suggestions) {
            setLocalSuggestions(prev => {
               const others = [...prev, ...res.data.suggestions];
               return [...new Set(others)].slice(0, 10);
            });
          }
        } catch (err) {
          console.error("AI Fetch Error");
        } finally {
          setIsAiLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(handleSuggestions, 300); 
    return () => clearTimeout(debounceTimer);
  }, [task, board.title]); 

  const loadTodos = async () => {
    try {
      const res = await fetchTodos(board._id);
      setTodos(res.data);
    } catch (err) {
      console.error("Error loading todos", err);
    }
  };

  const handleUpdateBoardTitle = async () => {
    try {
      await updateBoard(board._id, { title: newTitle });
      setIsEditingTitle(false);
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to update board", err);
    }
  };

  const handleAddTodo = async (e) => {
    if (e) e.preventDefault();
    if (!task) return;

    let subTasks = [];
    const input = task.toLowerCase();

    
    if (input.includes("exam") || input.includes("study")) {
      subTasks = ["Review syllabus", "Solve sample paper", "Final revision"];
    } else if (input.includes("project") || input.includes("work")) {
      subTasks = ["Research & Outline", "Draft content", "Proofread & Submit"];
    } else if (input.includes("trip") || input.includes("travel")) {
      subTasks = ["Book tickets/Hotel", "Pack bags", "Set out of office mail"];
    } else if (input.includes("gym") || input.includes("fitness")) {
      subTasks = ["Workout session", "Drink protein shake", "Track water intake"];
    } else if (input.includes("code") || input.includes("bug")) {
      subTasks = ["Fix logic error", "Run local tests", "Push to production"];
    }

    try {
      // Pehla main task create karo
      await createTodo({ task: task, boardId: board._id, isSubTask: false });
      
      // Fir saare sub-tasks create karo with isSubTask: true flag
      if (subTasks.length > 0) {
        await Promise.all(subTasks.map(t => createTodo({ task: t, boardId: board._id, isSubTask: true })));
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
        {isEditingTitle ? (
          <div className="flex gap-2">
            <input 
              className="bg-white/50 border rounded px-2 py-1 text-sm font-bold outline-none text-gray-900"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <button onClick={handleUpdateBoardTitle} className="text-green-600 text-xs font-bold">SAVE</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase italic">{newTitle}</h3>
            <Edit2 size={14} className="text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <div className="flex items-center gap-2">
          {isAiLoading && <Loader2 size={16} className="text-blue-500 animate-spin" />}
          <Sparkles size={18} className="text-blue-500 animate-pulse" />
        </div>
      </div>
      
      <div className="relative mb-6">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 bg-white/40 p-3 rounded-xl border border-white/20 focus:border-blue-500 focus:bg-white/60 outline-none text-sm transition-all placeholder:text-gray-500 font-bold text-gray-900"
            placeholder="Add something smart..."
            value={task}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
            <Plus size={20} />
          </button>
        </form>

        {isInputFocused && localSuggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-30 overflow-hidden">
            {localSuggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTask(s);
                  setLocalSuggestions([]);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center gap-2 text-gray-700 hover:bg-blue-500 hover:text-white"
              >
                <Zap size={10} fill="currentColor" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

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
              updateTodoText={async (id, newTask) => { await updateTodo(id, { task: newTask }); loadTodos(); }}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default BoardCard;