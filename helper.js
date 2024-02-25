export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getRandomCell = (size) => {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size),
  };
};


export const emptyGrid = (size) => {
  const vis = [];

  for (let i = 0; i < size; ++i) {
    let row = [];
    for (let i = 0; i < size; ++i) {
      row.push(0);
    }

    vis.push(row);
  }

  return vis;
};
