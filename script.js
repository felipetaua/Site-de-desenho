document.addEventListener('DOMContentLoaded', () => {
    // Selecionando elementos do DOM
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color-picker');
    const brushSize = document.getElementById('brush-size');
    const clearButton = document.getElementById('clear-button');
    const undoButton = document.getElementById('undo-button');
    const saveButton = document.getElementById('save-button');

    // Ajustando o tamanho do canvas
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    let painting = false;
    let paths = []; // Armazena todos os caminhos desenhados
    let currentPath = []; // Armazena o caminho atual

    // Inicia o desenho
    function startPosition(e) {
        painting = true;
        currentPath = [];
        draw(e);
    }

    // Finaliza o desenho
    function endPosition() {
        painting = false;
        ctx.beginPath();
        if (currentPath.length > 0) {
            paths.push(currentPath);
        }
    }

    // Desenha no canvas
    function draw(e) {
        if (!painting) return;

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        currentPath.push({ x, y, color: colorPicker.value, size: brushSize.value });

        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Redesenha o canvas
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => {
            ctx.beginPath();
            path.forEach((point, index) => {
                ctx.lineWidth = point.size;
                ctx.lineCap = 'round';
                ctx.strokeStyle = point.color;
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            });
        });
    }

    // Desfaz o último caminho desenhado
    function undo() {
        paths.pop();
        redraw();
    }

    // Salva o desenho como uma imagem
    function saveDrawing() {
        const link = document.createElement('a');
        link.download = 'desenho.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // Adicionando eventos
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths = [];
    });

    undoButton.addEventListener('click', undo);
    saveButton.addEventListener('click', saveDrawing);

    // Ajusta o tamanho do canvas ao redimensionar a janela
    window.addEventListener('resize', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        ctx.putImageData(imageData, 0, 0);
    });
});

