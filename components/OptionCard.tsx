import React from 'react';
import { CleanerOption } from '../types';
import { HardDrive, Network, Settings, AlertTriangle } from 'lucide-react';

interface OptionCardProps {
  option: CleanerOption;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, checked, onChange }) => {
  const getIcon = () => {
    switch (option.category) {
      case 'disk': return <HardDrive size={18} className="text-blue-400" />;
      case 'network': return <Network size={18} className="text-green-400" />;
      case 'system': return <Settings size={18} className="text-purple-400" />;
      default: return <Settings size={18} />;
    }
  };

  const getRiskBadge = () => {
    if (option.riskLevel === 'high') {
      return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-900/50 text-red-200 border border-red-700">HIGH RISK</span>;
    }
    if (option.riskLevel === 'medium') {
      return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-900/50 text-yellow-200 border border-yellow-700">MEDIUM</span>;
    }
    return null;
  };

  return (
    <div 
      onClick={() => onChange(option.id, !checked)}
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
        ${checked 
          ? 'bg-slate-800 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}
      `}
    >
      <div className={`mt-1 flex-shrink-0 ${checked ? 'text-blue-400' : 'text-slate-500'}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-medium text-sm ${checked ? 'text-slate-100' : 'text-slate-400'}`}>
            {option.label}
          </h3>
          {getRiskBadge()}
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {option.description}
        </p>
      </div>

      <div className="flex-shrink-0 mt-0.5">
        <div className={`
          w-5 h-5 rounded border flex items-center justify-center transition-colors
          ${checked ? 'bg-blue-600 border-blue-500' : 'border-slate-600 bg-transparent'}
        `}>
          {checked && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionCard;
