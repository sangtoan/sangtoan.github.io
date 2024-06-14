import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function wordtotex() {
    let inputCode = document.getElementById('inputCode').value;
    let useChoice = document.getElementById('useChoice').checked; // Kiểm tra trạng thái của checkbox
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

        // Chuyển đổi các mục a., a), 1., 1) thành \item
        const itemPattern = /^([a-z]\.|[a-z]\)|\d\.\s|\d\)\s)/gim;
        let formattedContent = questionText.replace(itemPattern, '\\item ');

        // Thay đổi \item và \begin{enumerate} nếu checkbox được chọn
        const itemTag = useChoice ? '\\itemchoice' : '\\item';
        const enumTag = useChoice ? '\\begin{enumchoice}' : '\\begin{enumerate}';
        const endEnumTag = useChoice ? '\\end{enumchoice}' : '\\end{enumerate}';

        if (itemPattern.test(questionText)) {
            formattedContent = `${enumTag}\n${formattedContent.replace(/\\item/g, itemTag)}\n${endEnumTag}`;
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
