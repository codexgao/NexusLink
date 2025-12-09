import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, AlertCircle, Sun, Moon, Monitor } from 'lucide-react';
import { Bookmark, ThemeMode } from './types';
import { INITIAL_BOOKMARKS } from './constants';
import BookmarkCard from './components/BookmarkCard';
import AddBookmarkModal from './components/AddBookmarkModal';

const App: React.FC = () => {
  // State: Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('nexus_bookmarks');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Data Migration: Ensure new fields exist for old data
      return parsed.map((b: any) => ({
        ...b,
        likes: b.likes ?? 0,
        dislikes: b.dislikes ?? 0,
        userVote: b.userVote ?? null,
      }));
    }
    return INITIAL_BOOKMARKS;
  });

  // State: Theme
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nexus_theme');
    return (saved as ThemeMode) || 'system';
  });

  // State: UI
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  // Persistence: Bookmarks
  useEffect(() => {
    localStorage.setItem('nexus_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Theme Logic
  useEffect(() => {
    localStorage.setItem('nexus_theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    const applyTheme = (mode: 'light' | 'dark') => {
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
            root.classList.add('light'); // Optional depending on CSS setup, but good for clarity
        }
    };

    if (theme === 'system') {
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(systemIsDark ? 'dark' : 'light');
    } else {
        applyTheme(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === 'system') {
            const root = window.document.documentElement;
            if (mediaQuery.matches) {
                root.classList.add('dark');
                root.classList.remove('light');
            } else {
                root.classList.remove('dark');
                root.classList.add('light');
            }
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  // Derived Data: Categories
  const categories = useMemo(() => {
    const cats = new Set(bookmarks.map(b => b.category));
    return ['全部', ...Array.from(cats)];
  }, [bookmarks]);

  // Derived Data: Filtered Bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      // 1. Category Filter
      if (activeCategory !== '全部' && bookmark.category !== activeCategory) {
        return false;
      }
      
      // 2. Search Query Filter
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.description.toLowerCase().includes(query) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(query)) ||
        bookmark.url.toLowerCase().includes(query)
      );
    });
  }, [bookmarks, searchQuery, activeCategory]);

  // Handlers
  const handleAddBookmark = (data: Omit<Bookmark, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'userVote'>) => {
    const newBookmark: Bookmark = {
      ...data,
      id: Date.now().toString(),
      createdAt: Date.now(),
      likes: 0,
      dislikes: 0,
      userVote: null
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const handleDeleteBookmark = (id: string) => {
    if (confirm('确定要删除这个收藏吗？')) {
      setBookmarks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleVote = (id: string, type: 'like' | 'dislike') => {
    setBookmarks(prev => prev.map(bookmark => {
      if (bookmark.id !== id) return bookmark;

      let newLikes = bookmark.likes;
      let newDislikes = bookmark.dislikes;
      let newUserVote = bookmark.userVote;

      // 如果点击的是当前已经选中的状态（例如已赞点赞），则取消投票
      if (newUserVote === type) {
        if (type === 'like') newLikes--;
        if (type === 'dislike') newDislikes--;
        newUserVote = null;
      } else {
        // 如果之前有其他投票，先撤销之前的
        if (newUserVote === 'like') newLikes--;
        if (newUserVote === 'dislike') newDislikes--;

        // 应用新的投票
        if (type === 'like') newLikes++;
        if (type === 'dislike') newDislikes++;
        newUserVote = type;
      }

      return {
        ...bookmark,
        likes: newLikes,
        dislikes: newDislikes,
        userVote: newUserVote
      };
    }));
  };

  return (
    <div className="min-h-screen bg-background text-zinc-900 dark:text-zinc-100 font-sans selection:bg-primary/30 transition-colors duration-300">
      
      {/* 背景装饰 (仅深色模式或适当调整) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      {/* 主容器 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 头部：Logo 与 搜索 */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-4 z-40 bg-surface/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* 新 Logo: Tri-Node Nexus */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <svg className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* 核心节点 */}
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.25" stroke="none" />
                {/* 连接线 */}
                <path d="M12 12 L12 6.5" />
                <path d="M12 12 L16.76 14.75" />
                <path d="M12 12 L7.24 14.75" />
                {/* 外部节点 */}
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                <circle cx="17.2" cy="15" r="1.5" fill="currentColor" />
                <circle cx="6.8" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
                NexusLink
              </h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest hidden sm:block">Personal Gateway</p>
            </div>
          </div>

          <div className="flex-1 w-full md:w-auto max-w-xl relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="text-zinc-400 group-focus-within:text-primary transition-colors" size={18} />
            </div>
            <input
              type="text"
              placeholder="搜索书签、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all shadow-inner"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <span className="text-xs text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                  {filteredBookmarks.length} 结果
                </span>
              </div>
            )}
          </div>

          <div className="flex w-full md:w-auto gap-2">
             {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all flex items-center justify-center"
              title={`切换主题 (当前: ${theme === 'system' ? '系统' : theme === 'light' ? '浅色' : '深色'})`}
            >
              {getThemeIcon()}
            </button>

            {/* 全新设计的 "添加" 按钮 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                group relative 
                flex-1 md:flex-none 
                px-8 py-3.5 
                rounded-2xl 
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
                text-white font-bold text-base tracking-wide
                shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)]
                hover:shadow-[0_20px_30px_-10px_rgba(79,70,229,0.6)]
                hover:-translate-y-1 
                active:scale-95 
                transition-all duration-300 ease-out
                overflow-hidden
                flex items-center justify-center gap-2
              "
            >
              {/* Shimmer 光影特效层 */}
              <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shimmer pointer-events-none"></div>
              
              <Plus size={22} className="stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
              <span>添加新网址</span>
            </button>
          </div>
        </header>

        {/* 分类标签栏 */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-primary/10 text-primary border-primary/50 shadow-sm'
                  : 'bg-surface text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 书签网格 */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBookmarks.map(bookmark => (
              <BookmarkCard 
                key={bookmark.id} 
                bookmark={bookmark} 
                onDelete={handleDeleteBookmark} 
                onVote={handleVote}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-600">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800">
              <AlertCircle size={32} />
            </div>
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">未找到相关书签</p>
            <p className="text-sm">尝试更换搜索词或添加新网址</p>
          </div>
        )}

      </div>

      {/* 模态框 */}
      <AddBookmarkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddBookmark} 
      />
    </div>
  );
};

export default App;