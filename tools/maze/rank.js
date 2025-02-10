// 计算分支数
function countBranches(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let branchCount = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
            if (grid[y][x] === 0) {
                let passageCount = 0;
                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (grid[ny][nx] === 0) {
                        passageCount++;
                    }
                }
                if (passageCount > 2) {
                    branchCount++;
                }
            }
        }
    }
    return branchCount;
}
// 计算死路数量
function countDeadEnds(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let deadEndCount = 0;
    // 定义四个方向：右、下、左、上
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    // 遍历迷宫内部格子（不包括边界）
    for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
            if (grid[y][x] === 0) {
                let passageCount = 0;
                // 检查当前格子四个方向的通路数量
                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (grid[ny][nx] === 0) {
                        passageCount++;
                    }
                }
                // 如果通路数量为 1，则为死路
                if (passageCount === 1) {
                    deadEndCount++;
                }
            }
        }
    }
    return deadEndCount;
}

// 计算路径曲折度
function calculatePathTwistiness(path) {
    if (path.length < 3) {
        return 0;
    }
    let twistiness = 0;
    // 遍历路径上的每个点（除了首尾）
    for (let i = 1; i < path.length - 1; i++) {
        const prev = path[i - 1];
        const current = path[i];
        const next = path[i + 1];
        const dx1 = current[0] - prev[0];
        const dy1 = current[1] - prev[1];
        const dx2 = next[0] - current[0];
        const dy2 = next[1] - current[1];
        // 判断路径是否发生转折
        if (dx1 * dx2 + dy1 * dy2 === 0) {
            twistiness++;
        }
    }
    return twistiness;
}

function ahpCalculateWeights(matrix) {
    const n = matrix.length;
    const rowSums = new Array(n).fill(0);
    const colSums = new Array(n).fill(0);

    // 计算每行和每列的和
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            rowSums[i] += matrix[i][j];
            colSums[j] += matrix[i][j];
        }
    }

    // 计算归一化矩阵
    const normalizedMatrix = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(matrix[i][j] / colSums[j]);
        }
        normalizedMatrix.push(row);
    }

    // 计算权重向量
    const weights = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            weights[i] += normalizedMatrix[i][j];
        }
        weights[i] /= n;
    }

    // 一致性检验
    let lambdaMax = 0;
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += matrix[i][j] * weights[j];
        }
        lambdaMax += sum / (n * weights[i]);
    }
    const ci = (lambdaMax - n) / (n - 1);
    const riValues = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45];
    const cr = ci / riValues[n - 1];

    // 迭代调整判断矩阵以提高一致性
    const maxIterations = 10;
    let iteration = 0;
    while (cr >= 0.1 && iteration < maxIterations) {
        // 调整判断矩阵的方法可以根据具体情况进行设计
        // 这里简单地对不一致的元素进行微调
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] > 1 && matrix[j][i] > 1) {
                    matrix[i][j] *= 0.9;
                    matrix[j][i] = 1 / matrix[i][j];
                }
            }
        }

        // 重新计算权重向量和一致性比率
        const newWeights = ahpCalculateWeights(matrix);
        weights.length = 0;
        weights.push(...newWeights);

        // 重新计算 lambdaMax、ci 和 cr
        lambdaMax = 0;
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += matrix[i][j] * weights[j];
            }
            lambdaMax += sum / (n * weights[i]);
        }
        const newCi = (lambdaMax - n) / (n - 1);
        const newCr = newCi / riValues[n - 1];
        cr = newCr;
        iteration++;
    }

    if (cr < 0.1) {
        console.log('一致性检验通过');
    } else {
        console.log('一致性检验未通过，请重新调整判断矩阵');
    }

    return weights;
}

function evaluateMazeDifficulty(pathLength, mazeSize, deadEndCount, twistiness, branchCount) {
    // 计算迷宫中理论上的最大路径长度
    const maxPathLength = (mazeSize - 2) * (mazeSize - 2);
    // 路径长度得分，范围 0 - 1
    const pathLengthScore = pathLength / maxPathLength;
    // 死路数量得分，范围 0 - 1
    const maxDeadEnds = (mazeSize - 2) * (mazeSize - 2) / 2;
    const deadEndScore = deadEndCount / maxDeadEnds;
    // 路径曲折度得分，范围 0 - 1
    const maxTwistiness = pathLength - 2;
    const twistinessScore = twistiness / maxTwistiness;
    // 迷宫大小得分，范围 0 - 1
    const maxMazeSize = 100; // 假设最大迷宫大小为 100
    const mazeSizeScore = Math.min(mazeSize / maxMazeSize, 1);
    // 分支数得分，范围 0 - 1
    const maxBranches = (mazeSize - 2) * (mazeSize - 2) / 2;
    const branchScore = branchCount / maxBranches;

    // 判断矩阵，调整路径长度和分支数的相对重要性
    const judgmentMatrix = [
        [1, 5, 3, 4, 2], // 路径长度相对其他因素更重要
        [1 / 5, 1, 1 / 2, 2, 1 / 2],
        [1 / 3, 2, 1, 3, 1],
        [1 / 4, 1 / 2, 1 / 3, 1, 1 / 3],
        [1 / 2, 2, 1, 3, 1]
    ];

    // 计算权重向量
    const weights = ahpCalculateWeights(judgmentMatrix);

    // 综合得分
    const scores = [pathLengthScore, deadEndScore, twistinessScore, mazeSizeScore, branchScore];
    let overallScore = 0;
    for (let i = 0; i < scores.length; i++) {
        overallScore += scores[i] * weights[i];
    }

    // 根据综合得分映射到 1 - 10 星的难度等级
    let difficulty = overallScore * 0.07;
    // 确保难度等级在 0 - 1000000000000000 星范围内
    difficulty = Math.max(0, Math.min(difficulty, 1000000000));
    // 精确到小数点后两位
    return parseFloat(difficulty.toFixed(2));
}

// 显示迷宫难度
function displayMazeDifficulty(difficulty) {
    const difficultyElement = document.getElementById('mazeDifficulty');
    if (difficultyElement) {
        difficultyElement.textContent = `迷宫难度: ${difficulty} 星`;
    }
}

// 主函数，调用其他函数完成迷宫评级
function rateMaze(grid, path, mazeSize) {
    const deadEndCount = countDeadEnds(grid);
    const twistiness = calculatePathTwistiness(path);
    const pathLength = path.length;
    const difficulty = evaluateMazeDifficulty(pathLength, mazeSize, deadEndCount, twistiness);
    displayMazeDifficulty(difficulty);
    return difficulty;
}

// 示例调用
// 假设有一个迷宫网格和路径
const mazeGrid = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1]
];
const mazePath = [[1, 1], [1, 2], [2, 2]];
const mazeSize = 4;
const mazeDifficulty = rateMaze(mazeGrid, mazePath, mazeSize);
console.log(`迷宫难度: ${mazeDifficulty} 星`);