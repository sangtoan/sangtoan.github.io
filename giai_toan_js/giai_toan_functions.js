function showCalculation(id) {
    var calculations = document.getElementsByClassName('calculation');
    for (var i = 0; i < calculations.length; i++) {
        calculations[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

function calculatePower() {
    const number = document.getElementById('number').value;
    const exponent = document.getElementById('exponent').value;
    const bigIntNumber = bigInt(number);
    const result = bigIntNumber.pow(exponent);
    document.getElementById('result').innerText = result.toString();
}

function calculateCombination(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
    }
    return result;
}

function calculateExpansion() {
    const n = parseInt(document.getElementById('n').value);
    const x = document.getElementById('x').value;
    const y = document.getElementById('y').value;
    let result = '';
    for (let k = 0; k <= n; k++) {
        const coefficient = calculateCombination(n, k);
        result += `${coefficient} ${x}^${n-k} ${y}^${k}`;
        if (k < n) result += ' + ';
    }
    const latexResult = result.replace(/C\((\d+),(\d+)\)/g, function(match, n, k) {
        return `\\binom{${n}}{${k}}`;
    });
    document.getElementById('expansion-result').innerHTML = `\\[ ${latexResult} \\]`;
    renderMathInElement(document.getElementById('expansion-result'));
}
