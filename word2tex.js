import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function word2tex() {
    let inputCode = document.getElementById('inputCode').value;

    // Chuyển đổi cấu trúc câu hỏi và đáp án
    const questionPattern = /Câu (\d+):([\s\S]*?)(?:(\nA\.\s*(.*?))|(?:\nB\.\s*(.*?))|(?:\nC\.\s*(.*?))|(?:\nD\.\s*(.*?))|(?:\nLời giải([\s\S]*?)))(?=\nCâu \d|$)/g;
    inputCode = inputCode.replace(questionPattern, (match, num, questionContent, a, choiceA, b, choiceB, c, choiceC, d, choiceD, solutionMatch, solution) => {
        // Kiểm tra nếu không đủ 4 phương án
        let error = false;
        let errorHighlight = "";
        if (!choiceA) {
            error = true;
            errorHighlight += `<span style="background-color: yellow;">A. (missing)</span>\n`;
        } else {
            errorHighlight += `A. ${choiceA.trim()}\n`;
        }
        if (!choiceB) {
            error = true;
            errorHighlight += `<span style="background-color: yellow;">B. (missing)</span>\n`;
        } else {
            errorHighlight += `B. ${choiceB.trim()}\n`;
        }
        if (!choiceC) {
            error = true;
            errorHighlight += `<span style="background-color: yellow;">C. (missing)</span>\n`;
        } else {
            errorHighlight += `C. ${choiceC.trim()}\n`;
        }
        if (!choiceD) {
            error = true;
            errorHighlight += `<span style="background-color: yellow;">D. (missing)</span>\n`;
        } else {
            errorHighlight += `D. ${choiceD.trim()}\n`;
        }

        if (error) {
            return `%% Câu ${num}:\n\\begin{ex}\n${questionContent.trim()}\n${errorHighlight}\\loigiai{\n${solution ? solution.trim() : ''}\n}\n\\end{ex}\n`;
        }

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
