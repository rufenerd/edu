import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import remarkMath from 'remark-math';

function MarkdownRender({ source }) {
    return (
        <MathJaxContext>
            <ReactMarkdown
                children={source}
                remarkPlugins={[remarkMath]} // Enable math syntax parsing
                components={{
                    br: "div",
                    math: ({ value }) => <MathJax inline>{value}</MathJax>,
                    inlineMath: ({ value }) => <MathJax>{value}</MathJax>,
                }}
            />
        </MathJaxContext>
    );
}

export default MarkdownRender;
