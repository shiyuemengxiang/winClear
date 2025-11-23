import { CleanerOption } from './types';

export const CLEANER_OPTIONS: CleanerOption[] = [
  {
    id: 'userTemp',
    label: '用户临时文件',
    description: '删除 %TEMP% 目录下的临时文件',
    command: 'del /f /s /q "%temp%\\*.*" & rd /s /q "%temp%" & md "%temp%"',
    category: 'disk',
    riskLevel: 'low'
  },
  {
    id: 'sysTemp',
    label: '系统临时文件',
    description: '删除 C:\\Windows\\Temp 下的文件',
    command: 'del /f /s /q "%windir%\\Temp\\*.*" & rd /s /q "%windir%\\Temp" & md "%windir%\\Temp"',
    category: 'system',
    riskLevel: 'medium'
  },
  {
    id: 'prefetch',
    label: '预读取文件 (Prefetch)',
    description: '清除 Windows 预读取缓存 (可能略微减慢首次启动速度)',
    command: 'del /f /s /q "%windir%\\Prefetch\\*.*"',
    category: 'system',
    riskLevel: 'low'
  },
  {
    id: 'recycleBin',
    label: '清空回收站',
    description: '永久删除回收站中的所有文件',
    command: 'rd /s /q %systemdrive%\\$Recycle.bin',
    category: 'disk',
    riskLevel: 'medium'
  },
  {
    id: 'logFiles',
    label: 'Windows 日志文件',
    description: '删除系统根目录下的 .log 日志文件',
    command: 'del /f /s /q "%windir%\\*.log"',
    category: 'system',
    riskLevel: 'low'
  },
  {
    id: 'flushDns',
    label: '刷新 DNS 缓存',
    description: '重置网络 DNS 解析缓存',
    command: 'ipconfig /flushdns',
    category: 'network',
    riskLevel: 'low'
  },
  {
    id: 'explorerRestart',
    label: '重启资源管理器',
    description: '重启 Explorer 进程以刷新图标和缓存',
    command: 'taskkill /f /im explorer.exe & start explorer.exe',
    category: 'system',
    riskLevel: 'low'
  }
];

export const INITIAL_CONFIG: Record<string, boolean> = {
  userTemp: true,
  sysTemp: true,
  prefetch: false,
  recycleBin: false,
  logFiles: false,
  flushDns: true,
  explorerRestart: false
};