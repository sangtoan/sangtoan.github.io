import { convertNumberToMathMode } from './numberUtils.js';
import { replaceTextWithJson } from './replaceUtils.js';

export function wordtotex() {
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
