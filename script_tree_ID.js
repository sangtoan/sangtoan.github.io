document.addEventListener('DOMContentLoaded', function () {
    const repoUrl = 'https://api.github.com/repos/sangtoan/sangtoan.github.io/contents/';

    fetchTexFiles(repoUrl).then(files => {
        const treeData = buildTree(files);
        const treeContainer = document.getElementById('tree-container');
        buildTreeView(treeContainer, treeData);
    }).catch(error => {
        console.error('Error fetching .tex files:', error);
    });

    async function fetchTexFiles(url, path = '') {
        try {
            const response = await fetch(url + path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();
            let files = [];
            for (const item of items) {
                if (item.type === 'file' && item.name.endsWith('.tex')) {
                    const fileContent = await fetch(item.download_url).then(res => res.text());
                    files.push({ path: path + item.name, content: fileContent });
                } else if (item.type === 'dir') {
                    files = files.concat(await fetchTexFiles(url, path + item.name + '/'));
                }
            }
            return files;
        } catch (error) {
            console.error('Failed to fetch files:', error);
            throw error;
        }
    }

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

        return tree;
    }

    function buildTreeView(container, data) {
        for (const key in data) {
            if (key === '_files') {
                data[key].forEach(file => {
                    const fileDiv = document.createElement('div');
                    fileDiv.className = 'file';
                    fileDiv.textContent = file.id + ' (' + file.path + ')';
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
                buildTreeView(childContainer, data[key]);

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
});
