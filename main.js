import { emptyGrid, getRandomCell, sleep } from "./helper.js";

const grid = document.querySelector(".grid");
const obstaclesBtn = document.querySelector("#addObstacles");
const findPathBtn = document.querySelector("#findPath");

class Node {
  constructor(row, col, g = 0, h = 0) {
    this.row = row;
    this.col = col;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.parent = null;
  }
}

const size = 50;
let start;
let end;
let found = 0;
const gridStructure = emptyGrid(size);

const inGrid = (x, y) => x >= 0 && x < size && y >= 0 && y < size;

const dist = (nodeA, nodeB) =>
  Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);

const isStart = (node) => node.row == start.row && node.col == start.col;

const isEnd = (node) => node.row == end.row && node.col == end.col;

const addObstacles = () => {
  const noOfObstacles = Math.floor(Math.random() * 30);

  for (let i = 0; i < noOfObstacles; ++i) {
    const pos = {
      row: Math.floor(Math.random() * size),
      col: Math.floor(Math.random() * size),
    };

    if (isStart(pos) || isEnd(pos)) continue;

    gridStructure[pos.row][pos.col] = 1;
    const cur = grid.childNodes[pos.row].childNodes[pos.col];
    cur.classList.add("obstacle");
  }
};

const getNeighbors = (node) => {
  const neighbours = [];
  let dx = [1, -1, 0, 0];
  let dy = [0, 0, 1, -1];

  for (let i = 0; i < 4; ++i) {
    let nx = node.row + dx[i],
      ny = node.col + dy[i];
    if (inGrid(nx, ny) && !gridStructure[nx][ny]) {
      neighbours.push(new Node(nx, ny));
    }
  }

  return neighbours;
};

const findPath = async () => {
  obstaclesBtn.disabled = true;

  const openList = [start];
  const closedList = [];

  console.log("Finding...");

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);

    const cur = openList.shift();
    closedList.push(cur);

    if (cur.row == end.row && cur.col == end.col) {
      found = 1;

      let current = cur;

      while (current != null) {
        const x = current.row,
          y = current.col;

        if (isStart(current) || isEnd(current)) {
          current = current.parent;
          continue;
        }

        const cell = grid.childNodes[x].childNodes[y];
        cell.classList.add("path");
        await sleep(2);

        current = current.parent;
      }

      break;
    }

    const neighbors = getNeighbors(cur);

    for (const neighbor of neighbors) {
      if (
        closedList.some(
          (node) => node.row === neighbor.row && node.col === neighbor.col
        )
      ) {
        continue;
      }

      const gVal = cur.g + 1;

      if (
        !openList.some(
          (node) => node.row === neighbor.row && node.col === neighbor.col
        ) ||
        gVal < neighbor.g
      ) {
        neighbor.g = gVal;
        neighbor.h = dist(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = cur;

        if (!openList.includes(neighbor)) {
          const x = neighbor.row,
            y = neighbor.col;

          if (!isEnd(neighbor)) {
            const cell = grid.childNodes[x].childNodes[y];
            cell.classList.add("visited");

            await sleep(3);
          }

          openList.push(neighbor);
        }
      }
    }
  }

  if (!found) {
    alert("No path found!!");
  }
};

findPathBtn.addEventListener("click", findPath);
obstaclesBtn.addEventListener("click", addObstacles);

function init() {
  for (let i = 0; i < size; ++i) {
    const row = document.createElement("div");
    row.className = "gridRow";

    for (let j = 0; j < size; ++j) {
      const cell = document.createElement("div");
      cell.className = "cell";

      row.appendChild(cell);
    }

    grid.appendChild(row);
  }

  const s = getRandomCell(size);
  let e = getRandomCell(size);

  while (s.x == e.x && s.y == e.y) {
    e = getRandomCell(size);
  }

  start = new Node(s.x, s.y);
  const startCell = grid.childNodes[s.x].childNodes[s.y];
  startCell.classList.add("start");

  end = new Node(e.x, e.y);
  const endCell = grid.childNodes[e.x].childNodes[e.y];
  endCell.classList.add("end");
}

init();
