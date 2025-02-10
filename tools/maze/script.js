let SIZE = 501;
let CELL_SIZE = 2;
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let grid;
let path;
let drawPathFlag = false;
let start = [1, 1];
let end = [SIZE - 2, SIZE - 2];



function generateMazeWilson() {
    const rows = SIZE;
    const cols = SIZE;
    const grid = new Array(rows).fill().map(() => new Array(cols).fill(1));
    const unvisited = [];

    // 初始化未访问的单元格列表
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            unvisited.push([x, y]);
        }
    }

    // 随机选择一个起点并标记为已访问
    const start = unvisited.splice(Math.floor(Math.random() * unvisited.length), 1)[0];
    grid[start[1]][start[0]] = 0;

    function randomWalk(x, y) {
        const path = [[x, y]];
        while (unvisited.includes([x, y])) {
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            const nx = x + randomDirection[0];
            const ny = y + randomDirection[1];
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                x = nx;
                y = ny;
                path.push([x, y]);
            }
        }
        return path;
    }

    while (unvisited.length > 0) {
        const randomCell = unvisited[Math.floor(Math.random() * unvisited.length)];
        const path = randomWalk(randomCell[0], randomCell[1]);
        for (const [x, y] of path) {
            if (unvisited.includes([x, y])) {
                grid[y][x] = 0;
                unvisited.splice(unvisited.indexOf([x, y]), 1);
            }
        }
    }

    return grid;
};

function generateMazeRecursiveDivision() {
    const rows = SIZE;
    const cols = SIZE;
    const grid = new Array(rows).fill().map(() => new Array(cols).fill(1));

    function divide(x1, y1, x2, y2) {
        if (x2 - x1 < 2 || y2 - y1 < 2) {
            return;
        }

        // 随机选择是水平分割还是垂直分割
        const isHorizontal = Math.random() < 0.5;

        if (isHorizontal) {
            const y = Math.floor((y1 + y2) / 2);
            const passageX = Math.floor(Math.random() * (x2 - x1)) + x1;
            for (let x = x1; x < x2; x++) {
                if (x !== passageX) {
                    grid[y][x] = 1;
                }
            }
            divide(x1, y1, x2, y);
            divide(x1, y + 1, x2, y2);
        } else {
            const x = Math.floor((x1 + x2) / 2);
            const passageY = Math.floor(Math.random() * (y2 - y1)) + y1;
            for (let y = y1; y < y2; y++) {
                if (y !== passageY) {
                    grid[y][x] = 1;
                }
            }
            divide(x1, y1, x, y2);
            divide(x + 1, y1, x2, y2);
        }
    }

    // 初始化边界
    for (let x = 0; x < cols; x++) {
        grid[0][x] = 1;
        grid[rows - 1][x] = 1;
    }
    for (let y = 0; y < rows; y++) {
        grid[y][0] = 1;
        grid[y][cols - 1] = 1;
    }

    // 开始递归分割
    divide(1, 1, cols - 1, rows - 1);

    return grid;
};


function generateMazeDFS(startX, startY) {
    const stack = [[startX, startY]];
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(1));
    grid[startY][startX] = 0;

    while (stack.length > 0) {
        const [x, y] = stack[stack.length - 1];
        const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
        shuffleArray(directions);
        let moved = false;

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] === 1) {
                grid[(y + ny) / 2][(x + nx) / 2] = 0;
                grid[ny][nx] = 0;
                stack.push([nx, ny]);
                moved = true;
                break;
            }
        }

        if (!moved) {
            stack.pop();
        }
    }
};

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(item) {
        this.heap.push(item);
        this.bubbleUp();
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex][2] <= this.heap[index][2]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        const end = this.heap.pop();
        this.heap[0] = end;
        this.sinkDown();
        return min;
    }

    sinkDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];

        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild[2] < element[2]) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild[2] < element[2]) ||
                    (swap !== null && rightChild[2] < leftChild[2])
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;
            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

function generateMazePrim(startX, startY) {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(1));
    grid[startY][startX] = 0;

    const walls = new MinHeap();
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const visitedWalls = new Set();

    // 将起点周围的墙壁加入最小堆
    for (const [dx, dy] of directions) {
        const nx = startX + dx;
        const ny = startY + dy;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
            const weight = Math.random();
            walls.insert([nx, ny, weight]);
            visitedWalls.add(`${nx},${ny}`);
        }
    }

    while (!walls.isEmpty()) {
        const [x, y] = walls.extractMin();

        let passageCount = 0;
        let passageX, passageY;
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] === 0) {
                passageCount++;
                passageX = nx;
                passageY = ny;
            }
        }

        if (passageCount === 1) {
            grid[y][x] = 0;
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] === 1 &&!visitedWalls.has(`${nx},${ny}`)) {
                    const weight = Math.random();
                    walls.insert([nx, ny, weight]);
                    visitedWalls.add(`${nx},${ny}`);
                }
            }
        }
    }
}

function generateMazeKruskal() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(1));
    const edges = [];
    const sets = {};

    // 初始化每个单元格为一个独立的集合
    for (let y = 1; y < SIZE; y += 2) {
        for (let x = 1; x < SIZE; x += 2) {
            grid[y][x] = 0;
            sets[`${x},${y}`] = `${x},${y}`;
            if (x + 2 < SIZE) {
                edges.push([x, y, x + 2, y]);
            }
            if (y + 2 < SIZE) {
                edges.push([x, y, x, y + 2]);
            }
        }
    }

    shuffleArray(edges);

    function findSet(node) {
        if (sets[node] !== node) {
            sets[node] = findSet(sets[node]);
        }
        return sets[node];
    }

    function unionSets(node1, node2) {
        const root1 = findSet(node1);
        const root2 = findSet(node2);
        sets[root1] = root2;
    }

    for (const [x1, y1, x2, y2] of edges) {
        const set1 = findSet(`${x1},${y1}`);
        const set2 = findSet(`${x2},${y2}`);
        if (set1!== set2) {
            unionSets(set1, set2);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            grid[midY][midX] = 0;
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function findPath(start, end) {
    const queue = [start];
    const visited = new Set([start.toString()]);
    const parent = { [start.toString()]: null };

    while (queue.length > 0) {
        const current = queue.shift();
        if (current.toString() === end.toString()) {
            const path = [];
            let node = current;
            while (node !== null) {
                path.push(node);
                node = parent[node.toString()];
            }
            return path.reverse();
        }

        const [x, y] = current;
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] === 0 &&!visited.has([nx, ny].toString())) {
                queue.push([nx, ny]);
                visited.add([nx, ny].toString());
                parent[[nx, ny].toString()] = current;
            }
        }
    }

    return [];
}

function drawMaze(path, drawPath = false) {
    canvas.width = SIZE * CELL_SIZE;
    canvas.height = SIZE * CELL_SIZE;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            if (grid[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // 标记起点和终点
    ctx.fillStyle = 'yellow';
    ctx.fillRect(start[0] * CELL_SIZE, start[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = 'red';
    ctx.fillRect(end[0] * CELL_SIZE, end[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // 绘制路径
    if (drawPath) {
        ctx.fillStyle = '#7aa2ca';
        for (const [x, y] of path) {
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        };
        ctx.fillStyle = 'yellow';
        ctx.fillRect(start[0] * CELL_SIZE, start[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = 'red';
        ctx.fillRect(end[0] * CELL_SIZE, end[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    }
}

function setupMaze() {
    let inputSize = parseInt(document.getElementById('mazeSize').value);
    if (isNaN(inputSize) || inputSize < 3) {
        alert('迷宫大小必须是大于等于3的整数');
        return;
    }
    SIZE = inputSize;
    if (SIZE % 2 === 0) {
        SIZE++; // 确保迷宫大小为奇数
    }
    CELL_SIZE = parseInt(document.getElementById('cellSize').value);
    const algorithm = document.getElementById('algorithmSelect').value;
    const randomStartEnd = document.getElementById('randomStartEnd').checked;

    if (randomStartEnd) {
        start = [Math.floor(Math.random() * (SIZE - 2)) + 1, Math.floor(Math.random() * (SIZE - 2)) + 1];
        end = [Math.floor(Math.random() * (SIZE - 2)) + 1, Math.floor(Math.random() * (SIZE - 2)) + 1];
        while (start.toString() === end.toString()) {
            end = [Math.floor(Math.random() * (SIZE - 2)) + 1, Math.floor(Math.random() * (SIZE - 2)) + 1];
        }
    } else {
        start = [1, 1];
        end = [SIZE - 2, SIZE - 2];
    }

    if (algorithm === 'dfs') {
        generateMazeDFS(start[0], start[1]);
    } else if (algorithm === 'prim') {
        generateMazePrim(start[0], start[1]);
    } else if (algorithm === 'kruskal') {
        generateMazeKruskal();
    }

    // 检查 grid 是否正确初始化
    if (!grid ||!Array.isArray(grid) || grid.length !== SIZE) {
        console.error('grid 数组初始化失败');
        return;
    }

    grid[start[1]][start[0]] = 0;
    grid[end[1]][end[0]] = 0;
    path = findPath(start, end);
    drawPathFlag = false;
    drawMaze(path, drawPathFlag);

    const deadEndCount = countDeadEnds(grid);
    const twistiness = calculatePathTwistiness(path);
    const branchCount = countBranches(grid);
    const difficulty = evaluateMazeDifficulty(path.length, SIZE, deadEndCount, twistiness, branchCount);
    displayMazeDifficulty(difficulty);
}

// 初始化迷宫
setupMaze();

// 显示路径按钮点击事件
document.getElementById('showPathBtn').addEventListener('click', function () {
    drawPathFlag = true;
    drawMaze(path, drawPathFlag);
});

// 关闭显示路径按钮点击事件
document.getElementById('hidePathBtn').addEventListener('click', function () {
    drawPathFlag = false;
    drawMaze(path, drawPathFlag);
});

// 重新绘制按钮点击事件
document.getElementById('redrawBtn').addEventListener('click', setupMaze);

// 保存迷宫为图片按钮点击事件
document.getElementById('saveMazeBtn').addEventListener('click', function () {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'maze.png';
    link.click();
});