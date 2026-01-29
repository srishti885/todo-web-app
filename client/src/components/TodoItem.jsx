import React from 'react';
// 1. Alias 
import { Lock as LockIcon, CheckCircle, Trash2, ChevronRight, Fingerprint, ShieldAlert } from 'lucide-react';

const TodoItem = ({ todo, isLocked, toggleStatus, deleteTodo }) => {
  const isSubTask = todo.task.startsWith('↳');

  return (
    <li 
      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ease-out relative overflow-hidden ${
        isLocked 
        ? 'bg-black/10 border-white/5 opacity-40 scale-[0.98] cursor-not-allowed select-none grayscale' 
        : 'bg-white/40 border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.1)] hover:bg-white/90 hover:-translate-y-1'
      } ${isSubTask ? 'ml-8 border-l-2 border-l-blue-500/50 bg-gradient-to-r from-blue-500/5 to-transparent' : ''}`}
    >
      {/* Visual Indicator for Subtasks */}
      {isSubTask && !isLocked && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
      )}

      <div className="flex items-center gap-3 z-10">
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
        
        <div className="flex flex-col">
          <span className={`text-sm font-black tracking-tight transition-all duration-300 ${
            todo.status === 'completed' 
            ? "line-through text-gray-400 font-bold opacity-60" 
            : "text-gray-800"
          } ${isSubTask ? "text-blue-900/70 italic flex items-center gap-1 font-bold" : ""}`}>
            {todo.task}
          </span>
          
          {isLocked && (
            <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em] mt-1 flex items-center gap-1 italic">
              <ShieldAlert size={10} /> Sector_Locked_001
            </span>
          )}
        </div>
      </div>

      {!isLocked && (
        <div className="flex items-center gap-2 z-10">
           {/* Scan Line Effect on Hover */}
           <div className="h-8 w-px bg-gray-200 group-hover:bg-blue-200 transition-colors hidden sm:block" />
           
           <button 
            onClick={() => deleteTodo(todo._id)}
            className="opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-all duration-300 transform hover:rotate-12 active:scale-90 shadow-sm"
            title="Terminate node"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Background Decorative Fingerprint for "Vault" Feel */}
      {!isLocked && (
        <Fingerprint size={40} className="absolute -right-2 -bottom-2 text-blue-500/5 rotate-12 group-hover:scale-150 transition-transform duration-700" />
      )}
    </li>
  );
};

export default TodoItem;