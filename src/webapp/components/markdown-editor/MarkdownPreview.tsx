import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

const MarkdownPreview: React.FC<{
    value: string;
}> = React.memo(({ value }) => {
    return (
        <MarkdownPreviewContainer>
            <ReactMarkdown>{value}</ReactMarkdown>
        </MarkdownPreviewContainer>
    );
});

export default MarkdownPreview;

const MarkdownPreviewContainer = styled.div`
    p,
    ol,
    ol li,
    ul,
    ul li,
    em {
        margin: 0;
        line-height: normal;
    }
`;
