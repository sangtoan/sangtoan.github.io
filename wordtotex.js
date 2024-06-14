import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function wordtotex() {
    let inputCode = document.getElementById('inputCode').value;
    let outputCode = "";

    // Chuyển đổi cấu trúc câu hỏi tự luận
    const questionPattern = /Câu (\d+)[.:\s]+([\s\S]*?)(?:\na\.\s*(.*?)\nb\.\s*(.*?)\nc\.\s*(.*?)\nd\.\s*(.*?))?(?:\nLời giải([\s\S]*?))?(?=\nCâu \d|$)/g;
    outputCode = inputCode.replace(questionPattern, (match, num, questionContent, choiceA, choiceB, choiceC, choiceD, solution) => {
        // Chuyển đổi các mục a), b), ... thành \item
        const itemPattern = /^(a\.\s|b\.\s|c\.\s|d\.\s)/gm;
        let formattedContent = questionContent.replace(itemPattern, '\\item ');

        let result;
        if (choiceA && choiceB && choiceC && choiceD) {
            formattedContent = `\\begin{enumerate}\n\\item ${choiceA.trim()}\n\\item ${choiceB.trim()}\n\\item ${choiceC.trim()}\n\\item ${choiceD.trim()}\n\\end{enumerate}`;
        }

        result = `%% Câu ${num}:\n\\begin{ex}\n${formattedContent}\n\\loigiai{\n${solution ? solution.trim() : ''}\n}\n\\end{ex}\n`;
        return result;
    });

    // Thay thế ký hiệu toán học
    outputCode = outputCode.replace(/\\mathrm{R}/g, '\\mathbb{R}');
    outputCode = convertNumberToMathMode(outputCode);
    //outputCode = outputCode.replace(/}\s*{/g, '}{');

    fetch('replace.json')
        .then(response => response.json())
        .then(data => {
            outputCode = replaceTextWithJson(data, outputCode);
            document.getElementById('outputCode').value = outputCode;
        })
        .catch(error => console.error('Error:', error));
}
