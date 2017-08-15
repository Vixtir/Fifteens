let randomIntNumber = (min, max) => {
  return  () => {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export default function shuffleArray(arr) {
  //[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15, 0]]
  let _arr = arr.slice(0)
  let min = 0
  let max = _arr.length; // +1 так как функция randomIntNumber возвращает целые числа без max;
  let randomIndex = randomIntNumber(min, max);

  let tmpDash;
  let randomDash;
  let newRowIdx;
  let newColIdx;
  for(let rowIdx = 0; rowIdx < _arr.length; rowIdx++){
    for(let colIdx=0; colIdx < _arr[rowIdx].length; colIdx++){
      newRowIdx = randomIndex();
      newColIdx = randomIndex();
      tmpDash = _arr[rowIdx][colIdx];
      randomDash = _arr[newRowIdx][newColIdx];
      _arr[rowIdx][colIdx] = randomDash;
      _arr[newRowIdx][newColIdx] = tmpDash
    }
  }

  return _arr;
}