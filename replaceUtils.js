export function replaceTextWithJson(data, text) {
    data.forEach(item => {
        const findText = item.find;
        const replaceText = item.replace;
        const regex = new RegExp(findText, 'g');
        text = text.replace(regex, replaceText);
    });
    return text;
}

export function applyResubFromJson(filePath, text) {
    return fetch(filePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const findText = item.find;
                const replaceText = item.replace;
                const regex = new RegExp(findText, 'gm');
                text = text.replace(regex, replaceText);
            });
            return text;
        })
        .catch(error => console.error('Error:', error));
}
