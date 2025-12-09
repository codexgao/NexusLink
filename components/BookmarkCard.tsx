import React from 'react';
import { ExternalLink, Trash2, Tag, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Bookmark } from '../types';
import { CATEGORY_COLORS, DEFAULT_TAG_COLOR } from '../constants';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onVote: (id: string, type: 'like' | 'dislike') => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete, onVote }) => {
  const categoryStyle = CATEGORY_COLORS[bookmark.category] || CATEGORY_COLORS['默认'];

  return (
    <div className="group relative bg-surface/80 dark:bg-surface/50 backdrop-blur-sm border border-zinc-200 dark:border-white/5 rounded-xl p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-1 flex flex-col h-full shadow-sm dark:shadow-none">
      
      {/* 顶部：分类与操作 */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryStyle}`}>
          {bookmark.category}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className="text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="删除"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* 内容：标题与描述 */}
      <div className="flex-grow">
        <a 
          href={bookmark.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group-hover:text-primary transition-colors duration-200"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
            {bookmark.title}
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </h3>
        </a>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {bookmark.description}
        </p>
      </div>

      {/* 底部：标签与投票 */}
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-end gap-2">
        
        {/* 左侧：标签 (限制高度，溢出隐藏) */}
        <div className="flex flex-wrap gap-2 content-start flex-1 min-w-0">
          {bookmark.tags.map((tag, index) => (
            <span 
              key={`${bookmark.id}-tag-${index}`} 
              className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap ${DEFAULT_TAG_COLOR}`}
            >
              <Tag size={8} />
              {tag}
            </span>
          ))}
        </div>

        {/* 右侧：投票按钮 */}
        <div className="flex gap-3 items-center shrink-0 ml-2">
            <button 
                onClick={() => onVote(bookmark.id, 'like')}
                className={`flex items-center gap-1 text-xs font-medium transition-all active:scale-95 ${
                    bookmark.userVote === 'like' 
                    ? 'text-primary' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
            >
                <ThumbsUp size={14} className={bookmark.userVote === 'like' ? 'fill-current' : ''} />
                <span>{bookmark.likes}</span>
            </button>

            <button 
                onClick={() => onVote(bookmark.id, 'dislike')}
                className={`flex items-center gap-1 text-xs font-medium transition-all active:scale-95 ${
                    bookmark.userVote === 'dislike' 
                    ? 'text-red-500' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
            >
                <ThumbsDown size={14} className={bookmark.userVote === 'dislike' ? 'fill-current' : ''} />
                <span>{bookmark.dislikes}</span>
            </button>
        </div>
      </div>
      
      {/* 装饰性光晕 */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 rounded-xl blur transition duration-500 -z-10"></div>
    </div>
  );
};

export default BookmarkCard;