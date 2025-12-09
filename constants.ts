import { Bookmark } from './types';

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: '1',
    url: 'https://github.com',
    title: 'GitHub',
    description: '全球最大的代码托管平台，开发者必备工具。',
    category: '开发工具',
    tags: ['代码', 'Git', '开源'],
    createdAt: 1715000000000,
    likes: 124,
    dislikes: 2,
    userVote: 'like'
  },
  {
    id: '2',
    url: 'https://dribbble.com',
    title: 'Dribbble',
    description: '设计师灵感社区，发现顶尖设计作品。',
    category: '设计灵感',
    tags: ['UI', 'UX', '设计'],
    createdAt: 1715000100000,
    likes: 89,
    dislikes: 5,
    userVote: null
  },
  {
    id: '3',
    url: 'https://developer.mozilla.org',
    title: 'MDN Web Docs',
    description: 'Web 开发技术的权威文档资源。',
    category: '学习资源',
    tags: ['HTML', 'CSS', 'JS', '文档'],
    createdAt: 1715000200000,
    likes: 256,
    dislikes: 0,
    userVote: 'like'
  },
  {
    id: '4',
    url: 'https://chatgpt.com',
    title: 'ChatGPT',
    description: 'OpenAI 开发的先进 AI 聊天机器人。',
    category: '人工智能',
    tags: ['AI', 'LLM', '助手'],
    createdAt: 1715000300000,
    likes: 999,
    dislikes: 12,
    userVote: null
  }
];

// 使用 dark: 前缀来适配深色模式，浅色模式使用较深的颜色以保证对比度
export const CATEGORY_COLORS: Record<string, string> = {
  '开发工具': 'text-blue-600 dark:text-blue-400 border-blue-600/30 dark:border-blue-400/30 bg-blue-600/10 dark:bg-blue-400/10',
  '设计灵感': 'text-pink-600 dark:text-pink-400 border-pink-600/30 dark:border-pink-400/30 bg-pink-600/10 dark:bg-pink-400/10',
  '学习资源': 'text-green-600 dark:text-green-400 border-green-600/30 dark:border-green-400/30 bg-green-600/10 dark:bg-green-400/10',
  '人工智能': 'text-purple-600 dark:text-purple-400 border-purple-600/30 dark:border-purple-400/30 bg-purple-600/10 dark:bg-purple-400/10',
  '默认': 'text-zinc-600 dark:text-zinc-400 border-zinc-600/30 dark:border-zinc-400/30 bg-zinc-600/10 dark:bg-zinc-400/10'
};

export const DEFAULT_TAG_COLOR = 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50';