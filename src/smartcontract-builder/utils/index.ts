export function formatText(text: string): string {
    return text
        .replace(/\\\*/g, "&ast;") // Escape literal *
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') // Bold (**text**)
        .replace(/(^|[\s])\*(.+?)\*([\s.,!?]|$)/g, '$1<i>$2</i>$3') // Italic (*text*)
        .replace(/^###### (.+)$/gm, '<h6>$1</h6>') // H6 (###### Title)
        .replace(/^##### (.+)$/gm, '<h5>$1</h5>') // H5 (##### Title)
        .replace(/^#### (.+)$/gm, '<h4>$1</h4>') // H4 (#### Title)
        .replace(/^### (.+)$/gm, '<h3>$1</h3>') // H3 (### Title)
        .replace(/^## (.+)$/gm, '<h2>$1</h2>') // H2 (## Title)
        .replace(/^# (.+)$/gm, '<h1>$1</h1>') // H1 (# Title)
        .replace(/(?:\n|^)\* (.+)/g, '<ul><li>$1</li></ul>') // Convert * item to unordered list
        .replace(/(?:\n|^)    \* (.+)/g, '<ul><ul><li>$1</li></ul></ul>') // Handle nested bullet points
        .replace(/<\/ul>\n<ul>/g, '') // Merge consecutive <ul> lists
        .replace(/^\d+\. (.+)/gm, '<ol><li>$1</li></ol>') // Convert numbered list (1. item)
        .replace(/<\/ol>\n<ol>/g, '') // Merge consecutive <ol> lists
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // Convert markdown links [text](url)
        .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code (`code`)
        .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>') // Code blocks (```code```)
        .replace(/"(.+?)"/g, '<b>$1</b>') // Bold text ("text")
        .replace(/\n/g, '<br>'); // Convert newlines to <br> for better formatting
}

export const parseMessage = (message: string) => {
    if (!message) return []
    const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const parts: any = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(message)) !== null) {
        if (match.index > lastIndex)
            parts.push({ type: "text", content: message.slice(lastIndex, match.index) });
        parts.push({ type: "code", content: match[1].trim() });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < message.length)
        parts.push({ type: "text", content: message.slice(lastIndex) });
    return parts;
};

export const generateChartCode = (chartData: string) => {
    const codeString = `${chartData}`;
    return codeString;
};

export const validateParameters = (parameters: any) => {
    let flag = true;
    parameters.forEach((element: any) => {
        if (!element) {
            flag = false;
            return;
        };
    });
    return flag;
}

export const displayData = (data: any) => {
    if (typeof data === 'undefined') {
        return 'undefined';
    }
    if (data === null) {
        return 'null';
    }
    if (typeof data === 'boolean') {
        return data ? 'true' : 'false';
    }
    if (typeof data === 'number') {
        return data.toFixed(2);
    }
    if (typeof data === 'symbol') {
        return data.toString();
    }
    if (typeof data === 'function') {
        return data.toString();
    }
    if (data instanceof Date) {
        return data.toISOString();
    }
    if (typeof data === 'object') {
        if (Array.isArray(data))
            return data.map(displayData).join(', ');
        if (typeof data.toString === 'function')
            return data.toString();
        return JSON.stringify(data);
    }
    if (typeof data === 'string') {
        if (data.includes('\n'))
            return data.split('\n').map(line => line.trim()).join(', ');
        return `${data}`;
    }
    return String(data);
};

export const tokenize = (message: string) => {
    const averageTokenLength = 4;
    return Math.ceil(message.length / averageTokenLength);
}

export const priceValue = (id: number) => {
    if (id === 1)
        return 9.99;
    if (id === 2)
        return 24.99;
    return 99.99
}