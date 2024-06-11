document.addEventListener('DOMContentLoaded', function () {
    const treeContainer = document.getElementById('tree-container');

    console.log('Loading tex_files.json...');
    fetch('tex_files.json')
        .then(response => {
            console.log('Received response from tex_files.json');
            return response.json();
        })
        .then(files => {
            console.log('Files:', files);
            const fetchedFiles = [];

            files.forEach(file => {
                fetchFileContent(file).then(content => {
                    console.log('Fetched content for:', file);
                    fetchedFiles.push({ path: file, content: content });
                    if (fetchedFiles.length === files.length) {
                        const treeData = buildTree(fetchedFiles);
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
            const idPattern = /\[(\d[A-Z]\d[YBKGTNHVC]\d-\d)]/;
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
        for (const key in data) {
            if (key === '_files') {
                data[key].forEach(file => {
                    const fileDiv = document.createElement('div');
                    fileDiv.className = 'file';
                    fileDiv.textContent = parentKey + file.id + ' (' + file.path + ')';
                    fileDiv.addEventListener('click', () => {
                        displayFileContent(file);
                    });
                    container.appendChild(fileDiv);
                });
            } else {
                const dirDiv = document.createElement('div');
                dirDiv.className = 'directory';
                dirDiv.textContent = key;
                dirDiv.addEventListener('click', () => {
                    const childContainer = dirDiv.nextElementSibling;
                    if (childContainer) {
                        childContainer.classList.toggle('hidden');
                    }
                });

                const childContainer = document.createElement('div');
                childContainer.className = 'hidden';
                buildTreeView(childContainer, data[key], parentKey + key);

                container.appendChild(dirDiv);
                container.appendChild(childContainer);
            }
        }
    }

    function displayFileContent(file) {
        const resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = `
            <h2>${file.id}</h2>
            <pre>${file.content}</pre>
        `;
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
