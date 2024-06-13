export function convertNumberToMathMode(text) {
    const pattern = /(\b\w+\b\s)(\d+)(\s\b\w+\b)/g;
    return text.replace(pattern, (match, before, number, after) => {
        if (/[a-zA-Z]/.test(before) && /[a-zA-Z]/.test(after)) {
            return `${before} $${number}$ ${after}`;
        }
        return match;
    });
}
