export function convertNumberToMathMode(text) {
    // Mẫu regex nhận dạng số nguyên và số thập phân giữa các từ
    const inlinePattern = /(\b\w+\b\s)(\d+(\.\d+)?)(\s\b\w+\b)/g;
    const linePattern = /^\s*\{\s*(\d+(\.\d+)?)\s*\.?\s*\}\s*$/gm;
    const mathrmPattern = /\\mathrm{([^dACP\s][a-zA-Z]*)}/g;
    const mathrmTildePattern = /\\mathrm{(\~[^dACP\s][a-zA-Z]*)}/g;

    // Thay thế các số nguyên và số thập phân giữa các từ
    text = text.replace(inlinePattern, (match, before, number, after) => {
        if (/[a-zA-Z]/.test(before) && /[a-zA-Z]/.test(after)) {
            return `${before} $${number}$ ${after}`;
        }
        return match;
    });

    // Thay thế các dòng chỉ có dạng { \d .} hoặc { \d }
    text = text.replace(linePattern, (match, number) => {
        return `{$${number}$}`;
    });

    // Thay thế \mathrm{[a-zA-Z]} thành [a-zA-Z], ngoại trừ d, A, C, P
    text = text.replace(mathrmPattern, (match, char) => {
        return `${char}`;
    });

    // Thay thế \mathrm{~[a-zA-Z]} thành [a-zA-Z], ngoại trừ d, A, C, P
    text = text.replace(mathrmTildePattern, (match, char) => {
        return `${char}`;
    });

    return text;
}
