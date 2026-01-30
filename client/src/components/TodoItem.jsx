import React, { useState } from 'react'; 
import { Lock as LockIcon, CheckCircle, Trash2, ChevronRight, Fingerprint, ShieldAlert, Edit3, Clock, AlertCircle, CornerDownRight } from 'lucide-react'; 


  const TodoItem = ({ todo, isLocked, toggleStatus, deleteTodo, updateTodoText }) => { 
  const isSubTask = todo.isSubTask || false;

  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState(cleanTaskText); 
  const [isDeleting, setIsDeleting] = useState(false); 
  const [priority, setPriority] = useState('Medium'); 

  const handleUpdate = () => {
    updateTodoText(todo._id, newTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(todo._id);
    }, 400); 
  };

  const priorityColors = {
    High: 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    Medium: 'bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    Low: 'bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
  };

  return (
    <li 
      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ease-out relative overflow-hidden ${
        isLocked 
        ? 'bg-black/10 border-white/5 opacity-40 scale-[0.98] cursor-not-allowed select-none grayscale' 
        : 'bg-white/40 border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.1)] hover:bg-white/90 hover:-translate-y-1'
      } ${isSubTask ? 'ml-8 border-l-2 border-l-blue-500/50 bg-gradient-to-r from-blue-500/5 to-transparent' : ''} 
      ${isDeleting ? 'animate-shake border-red-500/50' : ''}`}
    >
      {isSubTask && !isLocked && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
      )}

      <div className="flex items-center gap-3 z-10 w-full">
        <div className="flex-shrink-0">
          {isLocked ? (
            <div className="bg-gray-800/20 p-2 rounded-xl border border-white/5 animate-pulse">
              <LockIcon size={14} className="text-gray-400" />
            </div>
          ) : (
            <button 
              onClick={() => toggleStatus(todo._id, todo.status)}
              className={`p-0.5 rounded-full transition-all duration-300 transform active:scale-75 relative ${
                todo.status === 'completed' 
                ? 'text-green-500' 
                : 'text-gray-300 hover:text-blue-500'
              }`}
            >
              {todo.status === 'completed' && (
                <div className="absolute inset-0 bg-green-400 blur-md opacity-20" />
              )}
              <CheckCircle 
                size={26} 
                strokeWidth={todo.status === 'completed' ? 2.5 : 1.5}
                fill={todo.status === 'completed' ? "currentColor" : "none"} 
                className="relative"
              />
            </button>
          )}
        </div>
        
        <div className="flex flex-col flex-1">
          {isEditing ? (
            <input 
              className="bg-white/60 border-b border-blue-500 outline-none text-sm font-bold text-gray-800 w-full"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              autoFocus
            />
          ) : (
            <>
              <span 
                onClick={() => !isLocked && setIsEditing(true)}
                className={`text-sm font-black tracking-tight transition-all duration-300 cursor-text flex items-center gap-2 ${
                  todo.status === 'completed' 
                  ? "line-through text-gray-400 font-bold opacity-60" 
                  : "text-gray-800"
                } ${isSubTask ? "text-blue-900/70 italic font-bold" : ""}`}
              >
                {/* 2. EMOJI GONE: Icon used instead */}
                {isSubTask && <CornerDownRight size={14} className="text-blue-500/70" strokeWidth={3} />}
                {cleanTaskText}
              </span>

              {!isLocked && (
                <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    <Clock size={10} strokeWidth={3} />
                    <span>{new Date(todo.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const p = priority === 'High' ? 'Low' : priority === 'Low' ? 'Medium' : 'High';
                      setPriority(p);
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black text-white transition-all transform hover:scale-110 active:scale-95 ${priorityColors[priority]}`}
                  >
                    <AlertCircle size={8} strokeWidth={4} />
                    {priority}
                  </button>
                </div>
              )}
            </>
          )}
          
          {isLocked && (
            <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em] mt-1 flex items-center gap-1 italic">
              <ShieldAlert size={10} /> Sector_Locked_001
            </span>
          )}
        </div>
      </div>

      {!isLocked && (
        <div className="flex items-center gap-2 z-10">
           <div className="h-8 w-px bg-gray-200 group-hover:bg-blue-200 transition-colors hidden sm:block" />
           
           <button 
             onClick={() => setIsEditing(!isEditing)}
             className="opacity-0 group-hover:opacity-100 bg-blue-500/10 text-blue-900 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm"
             title="Edit node"
           >
             <Edit3 size={16} strokeWidth={3} className="text-blue-900" />
           </button>

           <button 
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-all duration-300 transform hover:rotate-12 active:scale-90 shadow-sm"
            title="Terminate node"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {!isLocked && (
        <Fingerprint size={40} className="absolute -right-2 -bottom-2 text-blue-500/5 rotate-12 group-hover:scale-150 transition-transform duration-700" />
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px) rotate(-1deg); }
          40% { transform: translateX(4px) rotate(1deg); }
          60% { transform: translateX(-4px) rotate(-1deg); }
          80% { transform: translateX(4px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </li>
  );
};

export default TodoItem;