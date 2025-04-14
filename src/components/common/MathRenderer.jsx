import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import styled from 'styled-components';
import 'katex/dist/katex.min.css';
import { formatLatexText, containsLatex } from '../../utils/formatters';
import { Typography } from 'antd';

const { Text } = Typography;

const MarkdownContainer = styled.div`
  & p {
    margin: 0.5em 0;
  }
  
  & .katex-display {
    margin: 1em 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5em 0;
  }
  
  & .katex {
    font-size: 1.1em;
  }
  
  & code {
    background-color: rgba(0, 0, 0, 0.06);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
  }
  
  & pre {
    background-color: rgba(0, 0, 0, 0.06);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  & pre code {
    background-color: transparent;
    padding: 0;
  }
  
  & blockquote {
    margin: 0.5em 0;
    padding-left: 1em;
    border-left: 4px solid #ddd;
    color: rgba(0, 0, 0, 0.65);
  }
  
  & ul, & ol {
    padding-left: 2em;
    margin: 0.5em 0;
  }
  
  & img {
    max-width: 100%;
  }
  
  /* 移动端适配 */
  @media (max-width: 768px) {
    & .katex-display {
      font-size: 0.9em;
    }
  }
`;

/**
 * 数学公式和Markdown渲染组件
 * @param {Object} props - 组件属性
 * @param {string} props.content - 要渲染的内容（包含Markdown和LaTeX）
 * @param {Object} props.options - 渲染选项
 * @returns {JSX.Element}
 */
const MathRenderer = React.memo(({ content, options = {} }) => {
  // 如果没有内容，返回null
  if (!content) return null;
  
  // 格式化内容，处理LaTeX格式问题
  const formattedContent = useMemo(() => formatLatexText(content), [content]);
  
  // 检测是否包含LaTeX公式或Markdown语法
  const hasLatexOrMarkdown = useMemo(() => {
    // 检测是否包含LaTeX公式
    const hasLatex = containsLatex(formattedContent);
    
    // 检测是否包含Markdown语法（简单检测）
    const markdownPatterns = [
      /#{1,6}\s.+/,  // 标题
      /\*\*.+?\*\*/,  // 粗体
      /\*.+?\*/,      // 斜体
      /\[.+?\]\(.+?\)/,  // 链接
      /!\[.+?\]\(.+?\)/,  // 图片
      /```[\s\S]+?```/,   // 代码块
      /`[^`]+`/,          // 行内代码
      /^\s*[-*+]\s+/m,    // 无序列表
      /^\s*\d+\.\s+/m,    // 有序列表
      /^\s*>\s+/m,        // 引用
    ];
    
    const hasMarkdown = markdownPatterns.some(pattern => pattern.test(formattedContent));
    
    return hasLatex || hasMarkdown;
  }, [formattedContent]);
  
  // 如果不包含LaTeX公式或Markdown语法，直接使用Typography.Text渲染
  if (!hasLatexOrMarkdown) {
    return <Text>{formattedContent}</Text>;
  }
  
  // 包含LaTeX公式或Markdown语法，使用ReactMarkdown渲染
  return (
    <MarkdownContainer>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // 自定义组件渲染
          p: ({ node, ...props }) => <p style={{ margin: '0.5em 0' }} {...props} />,
          // 可以添加更多自定义组件渲染
        }}
        {...options}
      >
        {formattedContent}
      </ReactMarkdown>
    </MarkdownContainer>
  );
});

export default MathRenderer;
