import React, { useState, useEffect, useMemo } from 'react';
import { CLEANER_OPTIONS, INITIAL_CONFIG } from './constants';
import { ScriptConfig, AnalysisStatus } from './types';
import OptionCard from './components/OptionCard';
import ScriptPreview from './components/ScriptPreview';
import { analyzeScript } from './services/geminiService';
import { Trash2, Shield, Info, X, ShieldCheck } from 'lucide-react';

function App() {
  const [config, setConfig] = useState<ScriptConfig>(INITIAL_CONFIG);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleToggle = (id: string, checked: boolean) => {
    setConfig(prev => ({ ...prev, [id]: checked }));
    setAnalysisStatus(AnalysisStatus.IDLE); // Reset analysis on change
    setAnalysisResult(null);
  };

  const generateScript = useMemo(() => {
    const timestamp = new Date().toISOString().split('T')[0];
    // CRITICAL: Use CRLF (\r\n) for Windows Batch files. 
    // \n alone can cause command parsing errors on some Windows versions.
    const CRLF = '\r\n';
    
    let script = `@echo off${CRLF}`;
    // Switch to UTF-8 page code immediately to handle Chinese characters correctly
    script += `chcp 65001 >nul${CRLF}`;
    script += `:: Windows C 盘清理脚本生成于 ${timestamp}${CRLF}`;
    script += `:: 请以管理员身份运行以获得最佳效果${CRLF}${CRLF}`;
    
    script += `title WinClean Generator Output${CRLF}`;
    script += `color 0A${CRLF}`;
    script += `cls${CRLF}`; // Clear any garbage output from chcp or initial read
    
    script += `echo ==================================================${CRLF}`;
    script += `echo           开始系统清理流程${CRLF}`;
    script += `echo ==================================================${CRLF}${CRLF}`;

    script += `echo 正在检查管理员权限...${CRLF}`;
    script += `net session >nul 2>&1${CRLF}`;
    script += `if %errorLevel% == 0 (${CRLF}    echo 成功: 确认拥有管理员权限。${CRLF}) else (${CRLF}    echo 失败: 当前权限不足。${CRLF}    echo 请右键点击脚本并选择 "以管理员身份运行"。${CRLF}    pause${CRLF}    exit${CRLF})${CRLF}${CRLF}`;

    CLEANER_OPTIONS.forEach(option => {
      if (config[option.id]) {
        script += `:: ${option.label}${CRLF}`;
        script += `echo 正在清理: ${option.label}...${CRLF}`;
        script += `${option.command}${CRLF}`;
        script += `echo 完成。${CRLF}${CRLF}`;
      }
    });

    script += `echo ==================================================${CRLF}`;
    script += `echo             清理任务执行完毕${CRLF}`;
    script += `echo ==================================================${CRLF}`;
    script += `pause${CRLF}`;

    return script;
  }, [config]);

  const handleAnalyze = async () => {
    setAnalysisStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzeScript(generateScript);
      setAnalysisResult(result);
      setAnalysisStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      setAnalysisResult("脚本分析出错。请检查您的网络连接或 API 密钥。");
      setAnalysisStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Trash2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">WinClean Gen</h1>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Windows 批处理生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Shield size={14} className="text-green-400" />
              安全 & 本地生成
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)] min-h-[600px]">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">清理选项</h2>
              <p className="text-slate-400 text-sm">选择您想要包含在清理脚本中的组件。</p>
            </div>

            <div className="grid gap-3">
              {CLEANER_OPTIONS.map(option => (
                <OptionCard 
                  key={option.id}
                  option={option}
                  checked={config[option.id]}
                  onChange={handleToggle}
                />
              ))}
            </div>

            <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-xl flex gap-3">
              <Info className="flex-shrink-0 text-blue-400 mt-0.5" size={20} />
              <div className="text-sm text-blue-200/80">
                <p className="font-medium text-blue-200 mb-1">使用提示</p>
                生成的脚本必须以 <strong>管理员身份</strong> 运行，以便系统能够访问 <code>C:\Windows\Temp</code> 等受保护的文件夹。
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">脚本预览</h2>
              <p className="text-slate-400 text-sm">下载前请检查生成的代码。</p>
            </div>
            
            <div className="flex-1 min-h-0">
              <ScriptPreview 
                script={generateScript} 
                onAnalyze={handleAnalyze}
                analysisStatus={analysisStatus}
              />
            </div>
          </div>
        </div>
      </main>

      {/* AI Analysis Modal */}
      {analysisResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="text-green-400" size={24} />
                <h3 className="text-lg font-semibold text-white">AI 安全分析报告</h3>
              </div>
              <button 
                onClick={() => setAnalysisResult(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="prose prose-invert prose-sm max-w-none">
                 {/* Simple rendering of the markdown text from Gemini */}
                 {analysisResult.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">
                      {line.startsWith('-') || line.startsWith('*') ? (
                         <span className="flex gap-2">
                           <span className="text-blue-400">•</span>
                           <span>{line.replace(/^[-\*]\s/, '')}</span>
                         </span>
                      ) : (
                        line
                      )}
                    </p>
                 ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
              <button 
                onClick={() => setAnalysisResult(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                关闭分析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;