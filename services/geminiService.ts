import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// 初始化 Gemini 客户端
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * 使用 Gemini 分析 URL 并返回结构化数据
 * 启用了 Google Search Grounding 以获取最新网页信息
 */
export const analyzeUrlWithGemini = async (url: string): Promise<AIAnalysisResult> => {
  const ai = getAiClient();
  
  const prompt = `
    请分析以下网址（或网站名称）："${url}"。
    请利用 Google Search 工具去了解这个网站的具体内容。
    
    请返回一个 JSON 对象，包含以下字段：
    - title: 网站的简短名称（不超过 15 个字符）。
    - description: 一句话概括该网站的主要功能（不超过 30 个字，中文）。
    - category: 该网站所属的广泛分类（例如：开发工具、设计灵感、学习资源、新闻资讯、娱乐、人工智能等，不超过 4 个字）。
    - tags: 一个包含 3-4 个关键词的数组，用于描述该网站的核心特性。
    
    如果无法访问，请根据 URL 的字面意思进行合理推测。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // 启用搜索接地，允许模型“看到”真实的网站内容
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "category", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    const result = JSON.parse(text) as AIAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // 返回一个兜底结果，避免 UI 崩溃
    return {
      title: "未知网站",
      description: "无法自动获取描述，请手动输入。",
      category: "未分类",
      tags: ["待整理"]
    };
  }
};