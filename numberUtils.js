export function convertNumberToMathMode(text) {
    // Mẫu regex nhận dạng số nguyên và số thập phân giữa các từ
    const pattern = /(\b\w+\b\s)(\d+(\.\d+)?)(\s\b\w+\b)/g;
    return text.replace(pattern, (match, before, number, after) => {
        if (/[a-zA-Z]/.test(before) && /[a-zA-Z]/.test(after)) {
            return `${before} $${number}$ ${after}`;
        }
        return match;
    });
}
