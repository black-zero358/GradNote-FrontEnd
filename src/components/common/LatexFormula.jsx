import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * LaTeX公式渲染组件
 * @param {Object} props - 组件属性
 * @param {string} props.formula - LaTeX公式
 * @param {boolean} props.block - 是否为块级公式
 * @param {Object} props.options - KaTeX渲染选项
 * @returns {JSX.Element}
 */
const LatexFormula = ({ formula, block = false, options = {} }) => {
  if (!formula) return null;

  const defaultOptions = {
    throwOnError: false,
    strict: false,
    ...options
  };

  return block ? (
    <BlockMath math={formula} errorColor={'#f5222d'} {...defaultOptions} />
  ) : (
    <InlineMath math={formula} errorColor={'#f5222d'} {...defaultOptions} />
  );
};

export default LatexFormula;
