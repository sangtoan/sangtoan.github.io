import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function wordtotex() {
    let inputCode = document.getElementById('inputCode').value;

    // Chuyển đổi cấu trúc câu hỏi và đáp án
    const questionPattern = /Câu (\d+):([\s\S]*?)(?:\nLời giải([\s\S]*?))?(?=\nCâu \d|$)/g;
    inputCode = inputCode.replace(questionPattern, (match, num, questionContent, solution) => {
        let result = `%% Câu ${num}:\n\\begin{ex}\n${questionContent.trim()}\n\\loigiai{\n${solution ? solution.trim() : ''}\n}\n\\end{ex}\n`;
        return result;
    });

    // Thay thế ký hiệu toán học
    inputCode = inputCode.replace(/\\mathrm{R}/g, '\\mathbb{R}');
    inputCode = convertNumberToMathMode(inputCode);
    inputCode = inputCode.replace(/}\s*{/g, '}{');

    fetch('replace.json')
        .then(response => response.json())
        .then(data => {
            inputCode = replaceTextWithJson(data, inputCode);
            document.getElementById('outputCode').value = inputCode;
        })
        .catch(error => console.error('Error:', error));
}
