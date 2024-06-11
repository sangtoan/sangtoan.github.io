document.addEventListener('DOMContentLoaded', function () {
    const treeContainer = document.getElementById('tree-container');

    console.log('Loading tex_files.json...');
    fetch('tex_files.json')
        .then(response => response.json())
        .then(files => {
            console.log('Files:', files);
            const fetchedFiles = [];

            files.forEach(file => {
                fetchFileContent(file).then(content => {
                    console.log('Fetched content for:', file);
                    fetchedFiles.push({ path: file, content: content });
                    if (fetchedFiles.length === files.length) {
                        const treeData = buildTree(fetchedFiles);
                        console.log('Tree structure:', treeData);  // Ghi lại cấu trúc cây
                        buildTreeView(treeContainer, treeData);
                    }
                }).catch(error => {
                    console.error('Error fetching file:', file, error);
                });
            });
        }).catch(error => {
            console.error('Error loading file list:', error);
        });

    function buildTree(files) {
        const tree = {};

        files.forEach(file => {
            const exPattern = /\\begin{ex}.*?\\end{ex}/gs;
            const idPattern = /\[(\d[A-Z]\d[YBKGTNHVC]\d\d)\]/;
            let match;
            while ((match = exPattern.exec(file.content)) !== null) {
                const element = match[0];
                const idMatch = idPattern.exec(element);
                if (idMatch) {
                    const id = idMatch[1];
                    const parts = id.split('');
                    let current = tree;
                    parts.forEach((part, index) => {
                        if (!current[part]) {
                            current[part] = { _files: [] };
                        }
                        if (index === parts.length - 1) {
                            current[part]._files.push({ path: file.path, id: id, content: element });
                        }
                        current = current[part];
                    });
                }
            }
        });

        console.log('Tree structure:', tree);
        return tree;
    }

    function buildTreeView(container, data, parentKey = '') {
        const ul = document.createElement('ul');
        container.appendChild(ul);

        for (const key in data) {
            if (key === '_files') {
                data[key].forEach(file => {
                    const fileLi = document.createElement('li');
                    fileLi.className = 'file';
                    fileLi.textContent = file.id.replace(/-/g, ''); // Hiển thị ID không có dấu gạch nối
                    fileLi.addEventListener('click', () => {
                        displayFileContent(file);
                    });
                    ul.appendChild(fileLi);
                });
            } else {
                const dirLi = document.createElement('li');
                dirLi.textContent = key;
                dirLi.classList.add('directory');
                dirLi.addEventListener('click', function (event) {
                    event.stopPropagation();
                    this.classList.toggle('expanded');
                    const childUl = this.querySelector('ul');
                    if (childUl) {
                        childUl.classList.toggle('hidden');
                    }
                });

                const childUl = document.createElement('ul');
                childUl.classList.add('hidden');
                buildTreeView(childUl, data[key], parentKey + key);
                dirLi.appendChild(childUl);
                ul.appendChild(dirLi);
            }
        }
    }

    function displayFileContent(file) {
        const resultContainer = document.getElementById('result-container');
        const fileContentDiv = document.createElement('div');
        fileContentDiv.className = 'file-content';
        fileContentDiv.innerHTML = `
            <h2>${file.id}</h2>
            <pre>${file.content}</pre>
            <button class="close-btn">X</button>
        `;
        fileContentDiv.querySelector('.close-btn').addEventListener('click', () => {
            resultContainer.removeChild(fileContentDiv);
        });
        resultContainer.appendChild(fileContentDiv);
    }

    function fetchFileContent(path) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', path, true);
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    resolve(request.responseText);
                } else {
                    reject(new Error(`Failed to load file: ${path}`));
                }
            };
            request.onerror = function () {
                reject(new Error(`Failed to load file: ${path}`));
            };
            request.send();
        });
    }
});
