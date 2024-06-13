import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function word2tex() {
    let inputCode = document.getElementById('inputCode').value;

    // Chuyển đổi cấu trúc câu hỏi và đáp án
    const questionPattern = /Câu (\d+):([\s\S]*?)(?:\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*?))(?:\nLời giải([\s\S]*?))?(?=\nCâu \d|$)/g;
    inputCode = inputCode.replace(questionPattern, (match, num, questionContent, choiceA, choiceB, choiceC, choiceD, solution) => {
        let result = `%% Câu ${num}:\n\\begin{ex}\n${questionContent.trim()}\n\\choice\n{${choiceA.trim()}}\n{${choiceB.trim()}}\n{${choiceC.trim()}}\n{${choiceD.trim()}}\n\\loigiai{\n${solution ? solution.trim() : ''}\n}\n\\end{ex}\n`;
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
