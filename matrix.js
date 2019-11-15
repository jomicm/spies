const N = Number(process.argv[2]) || 9;
let points = [];
let constraints = [];
let validpointsContainer = [];
let recIt = N;

const getCoord = (ix) => {
  return [points[ix], N - ix];
};

const getPoints2Cut = (ix, sign) => {
  const origen = getCoord(ix);
  return [origen[0] - N * sign, origen[1] - N];
};

const getRectEq = (p0, p1) => {
  const m = (p1[1] - p0[1]) / (p1[0] - p0[0]);
  return [m, p0[1] - p0[0] * m];
};

const evalEqinY = (eq, y) => {
  let res = (y - Number(eq[1].toFixed(3))) / Number(eq[0].toFixed(3));
  return Math.floor(res);
};

const diagonalsFromPoint = (ix, y) => {
  const origen = getCoord(ix);
  const p2P = getPoints2Cut(ix, 1);
  const p2N = getPoints2Cut(ix, -1);
  const rectP = getRectEq(origen, p2P);
  const rectN = getRectEq(origen, p2N);
  const evPY = evalEqinY(rectP, y);
  const evNY = evalEqinY(rectN, y);
  return [evPY, evNY];
};

const diagonalFrom2Points = (ixPrev, ixPrevPrev, y) => {
  const pIxPrev = getCoord(ixPrev);
  const pIxPrevPrev = getCoord(ixPrevPrev);
  const rect = getRectEq(pIxPrevPrev, pIxPrev);
  const evY = Number((evalEqinY(rect, y)).toFixed(0));
  return evY;
};

const getValidPointRec = (y) => {
  setConstraints(y);
  let allValues = Array.from(Array(N).keys()).map(x => x + 1);
  constraints.map(x => {
    allValues = allValues.filter(y => y !== x);
  });
  validpointsContainer.push(allValues);
  return allValues;
};

const setConstraints = (y) => {
  constraints = [];
  if (y === N) return;
  points.map((x, ix) => {
    if (constraints.indexOf(x) < 0) constraints.push(x);
    let diagNotValid = diagonalsFromPoint(ix, y);
    diagNotValid = diagNotValid.filter(x => (x >= 1 && x <= N) && (constraints.indexOf(x) < 0));
    constraints = [...constraints, ...diagNotValid];
  });
  if (N - y >= 2 && y > 0) {
    points.map(x => {
      let newpoints = points.filter(y => y !== x);
      newpoints.map(z => {
        const ixPrevPrev = points.indexOf(x);
        const ixPrev = points.indexOf(z);
        const notValid2PointDiagonal = diagonalFrom2Points(ixPrev, ixPrevPrev, y);
        if (notValid2PointDiagonal <= N && notValid2PointDiagonal >= 1) {
          if (constraints.indexOf(notValid2PointDiagonal) < 0) {
            constraints.push(notValid2PointDiagonal);
          }
        }
      });
    });
  }
};

const recMatrix = () => {
  recIt--;
  let validPoints = getValidPointRec(recIt);
  if (!validPoints.length) {
    if (points.length === N) {
      console.log(`Solved >>> [${points.length}]  Solution! >>> ${points.join(' ')}`);
    }
  }
  if (validPoints === undefined) return false;
  for (let point of validPoints) {
    points.push(point);
    let res = recMatrix(point);
    if (!res) {
      points.pop();
      recIt++;
    }
  }
};

const fxG = () => {
  console.log(`Try to get solution for Matrix ${N} x ${N}`);
  const startingPoints = [...Array(N).keys()].map(x => x + 1);
  for (let point of startingPoints) {
    console.log('Current Point> ', point);
    points = [];
    recIt = N;
    points.push(point);
    recMatrix(point);
  }
};

fxG(N);