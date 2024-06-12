// hoan_vi.js
function layCacNgoacLon(text) {
    let ngoacLon = [];
    let demNgoac = 0;
    let batDau = null;

    for (let i = 0; i < text.length; i++) {
        let kyTu = text[i];
        if (kyTu === "{") {
            if (demNgoac === 0) {
                batDau = i;
            }
            demNgoac += 1;
        } else if (kyTu === "}") {
            demNgoac -= 1;
            if (demNgoac === 0 && batDau !== null) {
                let ketThuc = i;
                ngoacLon.push([batDau, ketThuc]);
                batDau = null;
            }
        }
    }

    return ngoacLon;
}

function phanLoaiVaHoanVi(elements) {
    let groupY = [], groupB = [], groupK = [], groupG = [], groupT = [];

    elements.forEach(element => {
        let group = 'Y'; // Mặc định là Y
        let groupMatches = element.match(/\[[0-9][A-Z][0-9]([YBKGTNHVC])[0-9]-[0-9]]/);
        if (groupMatches) {
            group = groupMatches[1];
        }

        if (['Y', 'N'].includes(group)) {
            groupY.push(element);
        } else if (['B', 'H'].includes(group)) {
            groupB.push(element);
        } else if (['K', 'V'].includes(group)) {
            groupK.push(element);
        } else if (['G', 'C'].includes(group)) {
            groupG.push(element);
        } else if (group === 'T') {
            groupT.push(element);
        }
    });

    // Trộn lẫn nội dung
    groupY = groupY.sort(() => Math.random() - 0.5);
    groupB = groupB.sort(() => Math.random() - 0.5);
    groupK = groupK.sort(() => Math.random() - 0.5);
    groupG = groupG.sort(() => Math.random() - 0.5);
    groupT = groupT.sort(() => Math.random() - 0.5);

    // Ghép nối nội dung
    return groupY.concat(groupB, groupK, groupG, groupT).join('');
}

function hoanViNgoacLonNgauNhien(text) {
    text = text.replace('choiceTF', 'choiceTF');

    let sentences = text.match(/\\begin{ex}[\s\S]+?\\end{ex}/g);

    let groupChoice = [];
    let groupchoiceTF = [];
    let groupNone = [];

    sentences.forEach(sentence => {
        if (sentence.includes('choice') && !sentence.includes('choiceTF')) {
            groupChoice.push(sentence);
        } else if (sentence.includes('choiceTF')) {
            groupchoiceTF.push(sentence);
        } else {
            groupNone.push(sentence);
        }
    });

    function processGroup(group) {
        return group.map(sentence => {
            if (sentence.includes("choice")) {
                let indexChoice = sentence.indexOf('\\choice');
                let noiDungTruocChoice = sentence.slice(0, indexChoice);
                let noiDungSauChoice = sentence.slice(indexChoice);
                let cacVitriNgoacLon = layCacNgoacLon(noiDungSauChoice).slice(0, 4);

                if (cacVitriNgoacLon.length === 4) {
                    let cacNgoacLonGoc = cacVitriNgoacLon.map(([dau, cuoi]) => noiDungSauChoice.slice(dau, cuoi + 1));
                    let cacNgoacLonHoanVi = [...cacNgoacLonGoc];
                    cacNgoacLonHoanVi.sort(() => Math.random() - 0.5);

                    cacNgoacLonGoc.forEach((goc, index) => {
                        noiDungSauChoice = noiDungSauChoice.replace(goc, cacNgoacLonHoanVi[index]);
                    });

                    return noiDungTruocChoice + noiDungSauChoice;
                }
            }
            return sentence;
        });
    }

    groupChoice = processGroup(groupChoice);
    groupchoiceTF = processGroup(groupchoiceTF);
    groupNone = processGroup(groupNone);

    groupChoice = groupChoice.map(sentence => sentence.replace('choiceTF', 'choiceTF'));
    groupchoiceTF = groupchoiceTF.map(sentence => sentence.replace('choiceTF', 'choiceTF'));
    groupNone = groupNone.map(sentence => sentence.replace('choiceTF', 'choiceTF'));

    return {
        groupChoice: groupChoice.join('\n'),
        groupchoiceTF: groupchoiceTF.join('\n'),
        groupNone: groupNone.join('\n'),
        countChoice: groupChoice.length,
        countchoiceTF: groupchoiceTF.length,
        countNone: groupNone.length
    };
}

function hoanViCauTruc(text) {
    let hoanViKetQua = hoanViNgoacLonNgauNhien(text);
    return `\\subsection*{PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn. Thí sinh trả lời từ câu 1 đến câu ${hoanViKetQua.countChoice}}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.\n\\setcounter{ex}{0}\n\\Opensolutionfile{ans}[ans/ans-phanI]\n${hoanViKetQua.groupChoice}\n\\Closesolutionfile{ans}\n\\subsection*{PHẦN II. Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu ${hoanViKetQua.countchoiceTF}}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.\n\\setcounter{ex}{0}\n\\Opensolutionfile{ans}[ans/ans-phanII]\n${hoanViKetQua.groupchoiceTF}\n\n\Closesolutionfile{ans}\n\\subsection*{PHẦN III. Câu trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu ${hoanViKetQua.countNone}.}\n\\setcounter{ex}{0}\n\\Opensolutionfile{ans}[ans/ans-phanIII]\n${hoanViKetQua.groupNone}\n\n\\Closesolutionfile{ans}\n\\newpage\n\\begin{center}\n\\textbf{\\large BẢNG ĐÁP ÁN}\n\\end{center}\n\\noindent\\textbf{A. ĐÁP ÁN PHẦN I}\n\\inputansbox{10}{ans/ans-phanI}\n\\noindent\\textbf{B. ĐÁP ÁN PHẦN II}\n\\inputansbox[2]{2}{ans/ans-phanII}\n\\noindent\\textbf{C. ĐÁP ÁN PHẦN III}\n\\inputansbox[3]{6}{ans/ans-phanIII}`;
}

$(document).ready(function () {
    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();
        let fileInput = document.getElementById('uploadFile');
        let numFiles = document.getElementById('numFiles').value;
        let hoanViType = document.getElementById('hoanViType').value;
        let file = fileInput.files[0];

        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                let content = event.target.result;
                let results = [];

                for (let i = 0; i < numFiles; i++) {
                    let resultContent;
                    if (hoanViType === 'ngoac') {
                        resultContent = hoanViNgoacLonNgauNhien(content).groupChoice;
                    } else if (hoanViType === 'cau_truc') {
                        resultContent = hoanViCauTruc(content);
                    }
                    results.push({
                        content: resultContent,
                        download_url: `data:text/plain;charset=utf-8,${encodeURIComponent(resultContent)}`
                    });
                }

                displayResults(results);
            };
            reader.readAsText(file);
        }
    });

    $('#pasteForm').on('submit', function (e) {
        e.preventDefault();
        let content = $('#pasteContent').val();
        let numFiles = $('#numPasteFiles').val();
        let hoanViType = $('#hoanViTypePaste').val();
        let results = [];

        for (let i = 0; i < numFiles; i++) {
            let resultContent;
            if (hoanViType === 'ngoac') {
                resultContent = hoanViNgoacLonNgauNhien(content).groupChoice;
            } else if (hoanViType === 'cau_truc') {
                resultContent = hoanViCauTruc(content);
            }
            results.push({
                content: resultContent,
                download_url: `data:text/plain;charset=utf-8,${encodeURIComponent(resultContent)}`
            });
        }

        displayResults(results);
    });

    function displayResults(results) {
        $('#results').empty();
        results.forEach(function(result, index) {
            let resultHtml = `
                <h3>File ${index + 1}</h3>
                <textarea class="form-control mb-3" rows="10" readonly>${result.content}</textarea>
                <a href="${result.download_url}" class="btn btn-success mb-3" download="hoanvi_${index + 1}.tex">Tải về file đã hoán vị</a>
            `;
            $('#results').append(resultHtml);
        });
        $('#resultSection').show();
    }
});
