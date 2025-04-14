import React, { useState } from 'react';
import { Card, Typography, Input, Button, Divider } from 'antd';
import styled from 'styled-components';
import MathRenderer from '../components/common/MathRenderer';
import LatexFormula from '../components/common/LatexFormula';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PageContainer = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const ExampleContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

const ActionContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

/**
 * 测试数学公式渲染页面
 * @returns {JSX.Element}
 */
const TestMathPage = () => {
  const [inputText, setInputText] = useState('函数$y = \\mathrm{e}^{x}+\\frac{\\mathrm{e}^{-x}}{2}$的最小值为$\\sqrt{2}$．');
  const [renderText, setRenderText] = useState('函数$y = \\mathrm{e}^{x}+\\frac{\\mathrm{e}^{-x}}{2}$的最小值为$\\sqrt{2}$．');
  
  // 示例数据
  const examples = [
    {
      title: '简单行内公式',
      content: '这是一个行内公式 $E=mc^2$ 示例。'
    },
    {
      title: '块级公式',
      content: '以下是一个块级公式：\n\n$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$\n\n这是积分的基本定理。'
    },
    {
      title: '矩阵',
      content: '矩阵可以表示为：\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$'
    },
    {
      title: '分段函数',
      content: '分段函数示例：\n\n$$f(x) = \\begin{cases} x^2, & \\text{if } x \\geq 0 \\\\ -x^2, & \\text{if } x < 0 \\end{cases}$$'
    },
    {
      title: 'LLM返回的解题过程',
      content: '### 题目回顾\n我们需要求函数 \\( y = e^{x} + \\frac{e^{-x}}{2} \\) 的最小值。\n\n### 解题思路\n要找到函数的最小值，我们需要：\n1. 求出函数的导数\n2. 令导数等于0，求出临界点\n3. 通过二阶导数判断临界点是极大值还是极小值\n4. 计算极小值点对应的函数值\n\n### 解题过程\n首先，求函数的导数：\n\n$$\\frac{dy}{dx} = e^{x} - \\frac{e^{-x}}{2}$$\n\n令导数等于0：\n\n$$e^{x} - \\frac{e^{-x}}{2} = 0$$\n\n整理得：\n\n$$e^{x} = \\frac{e^{-x}}{2}$$\n$$e^{2x} = \\frac{1}{2}$$\n$$2x\\ln(e) = \\ln(\\frac{1}{2})$$\n$$2x = -\\ln(2)$$\n$$x = -\\frac{\\ln(2)}{2}$$\n\n计算二阶导数：\n\n$$\\frac{d^2y}{dx^2} = e^{x} + \\frac{e^{-x}}{2} > 0$$\n\n由于二阶导数恒大于0，所以临界点是极小值点。\n\n代入原函数计算最小值：\n\n$$y_{min} = e^{-\\frac{\\ln(2)}{2}} + \\frac{e^{\\frac{\\ln(2)}{2}}}{2}$$\n\n利用指数运算法则：\n\n$$e^{-\\frac{\\ln(2)}{2}} = \\frac{1}{\\sqrt{2}}$$\n$$e^{\\frac{\\ln(2)}{2}} = \\sqrt{2}$$\n\n代入计算：\n\n$$y_{min} = \\frac{1}{\\sqrt{2}} + \\frac{\\sqrt{2}}{2} = \\frac{1}{\\sqrt{2}} + \\frac{\\sqrt{2}}{2} = \\frac{1 + 1}{\\sqrt{2}} = \\frac{2}{\\sqrt{2}} = \\sqrt{2}$$\n\n### 结论\n函数 $y = e^{x} + \\frac{e^{-x}}{2}$ 的最小值为 $\\sqrt{2}$。'
    }
  ];
  
  // 处理渲染按钮点击
  const handleRender = () => {
    setRenderText(inputText);
  };
  
  return (
    <PageContainer>
      <Title level={2}>数学公式渲染测试</Title>
      
      <StyledCard title="输入测试">
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="输入包含LaTeX公式的文本..."
        />
        <ActionContainer>
          <Button type="primary" onClick={handleRender}>
            渲染
          </Button>
        </ActionContainer>
        
        <Divider>渲染结果</Divider>
        
        <div className="solution-content">
          <MathRenderer content={renderText} />
        </div>
      </StyledCard>
      
      <StyledCard title="单个公式渲染">
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>行内公式</Title>
          <LatexFormula formula="E=mc^2" />
        </div>
        
        <div>
          <Title level={4}>块级公式</Title>
          <LatexFormula formula="\int_{a}^{b} f(x) \, dx = F(b) - F(a)" block />
        </div>
      </StyledCard>
      
      <StyledCard title="示例">
        {examples.map((example, index) => (
          <ExampleContainer key={index}>
            <Title level={4}>{example.title}</Title>
            <Text type="secondary">原始文本：</Text>
            <pre style={{ background: '#f0f0f0', padding: 8, borderRadius: 4, marginBottom: 16 }}>
              {example.content}
            </pre>
            <Text type="secondary">渲染结果：</Text>
            <div className="solution-content">
              <MathRenderer content={example.content} />
            </div>
          </ExampleContainer>
        ))}
      </StyledCard>
    </PageContainer>
  );
};

export default TestMathPage;
