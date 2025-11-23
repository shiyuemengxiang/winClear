import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeScript = async (scriptContent: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const prompt = `
      你是一位 Windows 系统管理专家。
      请分析以下 Windows 批处理脚本 (Batch Script)。
      
      脚本内容:
      \`\`\`bat
      ${scriptContent}
      \`\`\`
      
      请提供以下分析：
      1. 简要总结这个脚本的主要功能。
      2. 列出任何潜在的风险或副作用（例如：“清空回收站是不可逆的操作”）。
      3. 确认语法在 Windows 环境下是否看起来有效。
      
      请使用中文回答，并使用 Markdown 格式，通过项目符号列表来清晰展示。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "无法生成分析结果。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("脚本分析失败，请重试。");
  }
};