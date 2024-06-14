import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function wordtotex() {
    let inputCode = document.getElementById('inputCode').value;
    let outputCode = "";
    let errors = [];

    // Chuyển đổi cấu trúc câu hỏi tự luận
    const questionPattern = /Câu (\d+)[.:\s]+(?:\(([\d\D]+?)\))?\s*([\s\S]*?)(?=(?:\nCâu \d|$))/gm;
    outputCode = inputCode.replace(questionPattern, (match, num, points, questionContent) => {
        // Nhận diện điểm số nếu có
        const pointsPattern = /\(([\d.]+ điểm)\)/;
        let pointsText = points ? `(${points})` : "";

        // Tách nội dung câu hỏi và lời giải
        const solutionPattern = /Lời giải([\s\S]*)/;
        let solutionText = "";
        let questionText = questionContent;

        const solutionMatch = questionContent.match(solutionPattern);
        if (solutionMatch) {
            solutionText = solutionMatch[1].trim();
            questionText = questionContent.replace(solutionPattern, '').trim();
        }

        // Chuyển đổi các mục a), b), ... hoặc 1), 2), ... thành \item
        const itemPattern = /^[a-z]\)|[a-z]\.|^\d\)|^\d\./gm;
        const formattedContent = questionText.replace(itemPattern, '\\item');

        let result = `%% Câu ${num}:\n\\begin{ex}${pointsText}\n\\begin{enumerate}\n${formattedContent}\n\\end{enumerate}\n\\loigiai{\n${solutionText}\n}\n\\end{ex}\n`;
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
