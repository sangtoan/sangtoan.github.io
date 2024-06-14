import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function wordtotex() {
    let inputCode = document.getElementById('inputCode').value;
    let outputCode = "";
    let errors = [];

    // Chuyển đổi cấu trúc câu hỏi tự luận
    const questionPattern = /Câu (\d+)[.:\s]+([\s\S]*?)(?=\nCâu \d|$)/g;
    outputCode = inputCode.replace(questionPattern, (match, num, questionContent) => {
        // Tách nội dung câu hỏi và lời giải
        const solutionPattern = /Lời giải([\s\S]*)/i;
        let solutionText = "";
        let questionText = questionContent;

        const solutionMatch = questionContent.match(solutionPattern);
        if (solutionMatch) {
            solutionText = solutionMatch[1].trim();
            questionText = questionContent.replace(solutionPattern, '').trim();
        }

        // Tách nội dung câu hỏi chính và các mục a., b., c., d.
        const parts = questionText.split(/\n(?=[a-z]\.\s)/);
        let formattedContent = parts.shift().trim();

        // Nếu có các mục a., b., c., d., chuyển đổi chúng thành \item
        if (parts.length > 0) {
            formattedContent += "\n\\begin{enumerate}";
            parts.forEach(part => {
                formattedContent += `\n\\item ${part.trim()}`;
            });
            formattedContent += "\n\\end{enumerate}";
        }

        let result = `%% Câu ${num}:\n\\begin{ex}\n${formattedContent}\n\\loigiai{\n${solutionText}\n}\n\\end{ex}\n`;
        return result;
    });

    // Thay thế ký hiệu toán học
    outputCode = outputCode.replace(/\\mathrm{R}/g, '\\mathbb{R}');
    outputCode = convertNumberToMathMode(outputCode);
    outputCode = outputCode.replace(/}\s*{/g, '}{');

    fetch('replace.json')
        .then(response => response.json())
        .then(data => {
            outputCode = replaceTextWithJson(data, outputCode);
            document.getElementById('outputCode').value = outputCode;
            if (errors.length > 0) {
                alert("Các lỗi sau cần được sửa:\n" + errors.join("\n"));
            }
        })
        .catch(error => console.error('Error:', error));
}
