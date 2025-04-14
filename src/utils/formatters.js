/**
 * 格式化工具函数
 */

/**
 * 处理API返回的可能包含LaTeX的文本
 * @param {string} text - 原始文本
 * @returns {string} - 处理后的文本
 */
export const formatLatexText = (text) => {
  if (!text) return '';
  
  // 处理各种格式问题
  return text
    // 处理双反斜杠问题
    .replace(/\\\\([a-zA-Z]+)/g, '\\$1')
    .replace(/\\\\{/g, '\\{')
    .replace(/\\\\}/g, '\\}')
    // 处理可能的HTML实体
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
};

/**
 * 检测文本是否包含LaTeX公式
 * @param {string} text - 要检测的文本
 * @returns {boolean} - 是否包含LaTeX公式
 */
export const containsLatex = (text) => {
  if (!text) return false;
  
  // 检测常见的LaTeX标记
  const latexPatterns = [
    /\$\$.+?\$\$/s,  // 块级公式 $$...$$
    /\$.+?\$/g,      // 行内公式 $...$
    /\\\(.+?\\\)/s,  // 行内公式 \(...\)
    /\\\[.+?\\\]/s,  // 块级公式 \[...\]
    /\\begin\{.+?\}.+?\\end\{.+?\}/s  // 环境 \begin{...}...\end{...}
  ];
  
  return latexPatterns.some(pattern => pattern.test(text));
};
