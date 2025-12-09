import React, { useState } from 'react';
import { X, Sparkles, Loader2, Link as LinkIcon } from 'lucide-react';
import { AIAnalysisResult } from '../types';
import { analyzeUrlWithGemini } from '../services/geminiService';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<import('../types').Bookmark, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'userVote'>) => void;
}

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAIAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    try {
      const result: AIAnalysisResult = await analyzeUrlWithGemini(url);
      setTitle(result.title);
      setDescription(result.description);
      setCategory(result.category);
      setTags(result.tags.join(', '));
    } catch (error) {
      console.error(error);
      alert('AI 识别失败，请检查网络或稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      url,
      title: title || url,
      description,
      category: category || '未分类',
      tags: tags.split(/[,，\s]+/).filter(Boolean), // 支持中英文逗号或空格分割
    });
    // Reset form
    setUrl('');
    setTitle('');
    setDescription('');
    setCategory('');
    setTags('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div className="relative bg-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <LinkIcon className="text-primary" size={20} />
            添加新网址
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* URL 输入与 AI 按钮 */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">网址链接 (URL)</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
              />
              <button
                type="button"
                onClick={handleAIAnalyze}
                disabled={isAnalyzing || !url}
                className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 whitespace-nowrap"
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isAnalyzing ? '分析中...' : 'AI 识别'}
              </button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-600 pt-1">粘贴网址并点击 AI 识别，自动填充下方信息。</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">标题</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="网站名称"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">分类</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="例如：工具、娱乐"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简短描述该网站的功能..."
              rows={3}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-zinc-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">标签</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, 设计, 教程 (用逗号分隔)"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-zinc-900 text-white dark:bg-white dark:text-black px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all"
            >
              保存收藏
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal;