import React, { useRef, useEffect } from 'react';
import { Copy, Download, Terminal, ShieldCheck, Loader2 } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface ScriptPreviewProps {
  script: string;
  onAnalyze: () => void;
  analysisStatus: AnalysisStatus;
}

const ScriptPreview: React.FC<ScriptPreviewProps> = ({ script, onAnalyze, analysisStatus }) => {
  const scrollRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    // Could add a toast here in a real app
  };

  const handleDownload = () => {
    // Add BOM (\uFEFF) to ensure Windows recognizes the file as UTF-8
    const blob = new Blob(['\uFEFF' + script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clean_c_drive.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple syntax highlighting simulation
  const highlightSyntax = (code: string) => {
    // Split by regex to handle both \n and \r\n
    return code.split(/\r?\n/).map((line, i) => {
      // Comments
      if (line.trim().startsWith('::') || line.trim().startsWith('REM')) {
        return <div key={i} className="text-slate-500">{line}</div>;
      }
      // Echo commands
      if (line.trim().toLowerCase().startsWith('echo')) {
        // Simple visual fix for lines that are just commands
        return (
          <div key={i}>
            <span className="text-purple-400">echo</span>
            <span className="text-green-300">{line.substring(4)}</span>
          </div>
        );
      }
      // Labels
      if (line.trim().startsWith(':')) {
        return <div key={i} className="text-yellow-400 font-bold">{line}</div>;
      }
      
      // Standard highlighting for commands (simple heuristic)
      const parts = line.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1).join(' ');
      
      return (
        <div key={i}>
           <span className="text-blue-400 font-semibold">{cmd}</span>
           <span className="text-slate-300"> {args}</span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-slate-400" />
          <span className="text-sm font-mono text-slate-300">preview.bat</span>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={onAnalyze}
            disabled={analysisStatus === AnalysisStatus.LOADING}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/30 transition-colors disabled:opacity-50"
          >
            {analysisStatus === AnalysisStatus.LOADING ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShieldCheck size={14} />
            )}
            AI 安全检查
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 relative bg-[#0d1117] overflow-hidden group">
        <pre 
          ref={scrollRef}
          className="absolute inset-0 p-4 font-mono text-sm overflow-auto"
        >
          {highlightSyntax(script)}
        </pre>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <button 
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          <Copy size={16} />
          复制代码
        </button>
        <button 
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Download size={16} />
          下载 .bat
        </button>
      </div>
    </div>
  );
};

export default ScriptPreview;