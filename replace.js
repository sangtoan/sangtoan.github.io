function convertNumberToMathMode(text) {
    const pattern = /(\b\w+\b\s)(\d+)(\s\b\w+\b)/g;
    return text.replace(pattern, (match, before, number, after) => {
        if (/[a-zA-Z]/.test(before) && /[a-zA-Z]/.test(after)) {
            return `${before} $${number}$ ${after}`;
        }
        return match;
    });
}

function replaceTextWithJson(data, text) {
    data.forEach(item => {
        const findText = item.find;
        const replaceText = item.replace;
        const regex = new RegExp(findText, 'g');
        text = text.replace(regex, replaceText);
    });
    return text;
}

function word2tex() {
    let inputCode = document.getElementById('inputCode').value;
    inputCode = inputCode.replace(/\\mathrm{R}/g, '\\mathbb{R}');
    inputCode = convertNumberToMathMode(inputCode);
    inputCode = inputCode.replace(/}\s*{/g, '}{');
    inputCode = inputCode.replace(/\$\\underline{\\mathbf{([A-D])}}\\cdot/g, '$1. \\True $');
    inputCode = inputCode.replace(/Lời Giải/g, 'Lời giải');
    inputCode = inputCode.replace(/Hướng dẫn giải|Hướng Dẫn Giải|HDG|LỜI GIẢI/g, 'Lời giải');
    inputCode = inputCode.replace(/Bài\s+(\d+)[. :]/g, 'Câu $1:');
    inputCode = inputCode.replace(/Ví dụ\s+(\d+)[. :]|Ví Dụ\s+(\d+)[. :]/g, 'Câu $1:');

    fetch('replace.json')
        .then(response => response.json())
        .then(data => {
            inputCode = replaceTextWithJson(data, inputCode);
            document.getElementById('outputCode').value = inputCode;
        })
        .catch(error => console.error('Error:', error));
}

function wordtotex() {
    let inputCode = document.getElementById('inputCode').value;
    inputCode = inputCode.replace(/\\mathrm{R}/g, '\\mathbb{R}');
    inputCode = convertNumberToMathMode(inputCode);
    inputCode = inputCode.replace(/}\s*{/g, '}{');
    inputCode = inputCode.replace(/Bài\s+(\d+)[. :]/g, 'Câu $1:');
    inputCode = inputCode.replace(/Ví dụ\s+(\d+)[. :]|Ví Dụ\s+(\d+)[. :]/g, 'Câu $1:');
    inputCode = inputCode.replace(/Lời Giải|Hướng dẫn giải|Hướng Dẫn Giải|HDG|LỜI GIẢI/g, 'Lời giải');

    fetch('replace.json')
        .then(response => response.json())
        .then(data => {
            inputCode = replaceTextWithJson(data, inputCode);
            document.getElementById('outputCode').value = inputCode;
        })
        .catch(error => console.error('Error:', error));
}

function fixCode() {
    let inputCode = document.getElementById('inputCode').value;
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
