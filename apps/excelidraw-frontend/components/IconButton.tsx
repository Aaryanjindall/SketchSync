import { ReactNode } from "react";

export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return (
      <button 
        className={`m-1 p-3 rounded-xl transition-all duration-200 flex items-center justify-center
          ${activated 
            ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
            : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent"} 
          border`} 
        onClick={onClick}
      >
        {icon}
      </button>
    );
}

