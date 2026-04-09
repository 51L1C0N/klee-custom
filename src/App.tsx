import { motion } from 'motion/react';
import { Github, FileType, Zap, Info, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-bottom border-gray-200 bg-white px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileType className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Klee-Custom Font Project</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Workflow Ready
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-extrabold mb-4">字體「手術」方案：Klee-Custom</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              將「霞鶩文楷 TC」的優美硬筆書法風格與「Klee One」的日文風格標點符號完美融合。
              由於中文字體文件龐大，本地環境無法處理，我們已為您準備了 <strong>GitHub Actions</strong> 自動化方案。
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                方案一：字形替換 (已優化 UPM 縮放)
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                修復：Node.js 24 環境適配
              </div>
            </div>
          </motion.div>
        </section>

        {/* The Plan Grid */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">核心邏輯</h3>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg mt-1">
                  <span className="text-blue-600 font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-bold">定位 Unicode 編碼</h4>
                  <p className="text-sm text-gray-500">精確鎖定所有標點符號（如 ，。！？「」）的 Unicode 位置。</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg mt-1">
                  <span className="text-blue-600 font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-bold">路徑數據移植 (Path Data)</h4>
                  <p className="text-sm text-gray-500">從 Klee One 提取字形路徑，覆蓋至 霞鶩文楷 的對應位置。</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg mt-1">
                  <span className="text-blue-600 font-bold">03</span>
                </div>
                <div>
                  <h4 className="font-bold">重命名與導出</h4>
                  <p className="text-sm text-gray-500">將字體家族命名為「Klee-Custom」，生成全新的 TTF 文件。</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">GitHub Action 部署指南</h3>
            <div className="bg-[#1a1a1a] text-white rounded-xl p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">1. 將此項目推送到您的 GitHub 倉庫。</p>
                <p className="text-sm text-gray-400">2. 進入 <strong>Actions</strong> 選項卡。</p>
                <p className="text-sm text-gray-400">3. 選擇 <strong>Build Klee-Custom Font</strong> 流程。</p>
                <p className="text-sm text-gray-400">4. 點擊 <strong>Run workflow</strong>。</p>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">build_font.py + workflow.yml</span>
                  <Github className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* File List */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">已生成的關鍵文件</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'build_font.py', desc: 'Python 字體處理腳本', icon: <FileType className="w-5 h-5" /> },
              { name: 'font-build.yml', desc: 'GitHub Action 配置文件', icon: <Github className="w-5 h-5" /> },
              { name: 'metadata.json', desc: '項目元數據', icon: <Info className="w-5 h-5" /> },
            ].map((file) => (
              <div key={file.name} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4">
                <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">
                  {file.icon}
                </div>
                <div>
                  <div className="font-bold text-sm">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning/Note */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
          <AlertCircle className="text-amber-600 w-6 h-6 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-bold mb-1">為什麼不在這裡直接生成？</p>
            <p>
              中文字體文件通常超過 10MB，處理時需要消耗大量內存（約 2GB+）。
              預覽環境的內存限制會導致進程崩潰。使用 GitHub Actions 可以利用其強大的計算資源免費完成轉換。
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>© 2026 Klee-Custom Font Project · Powered by Python & GitHub Actions</p>
      </footer>
    </div>
  );
}
