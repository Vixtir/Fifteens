const randomIntNumber = (min, max) => {
  return  () => {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};

export default function shuffleArray(arr) {
  //[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15, 0]]
  let new_arr = arr.slice(0);
  const min = 0;
  const max = new_arr.length; // +1 так как функция randomIntNumber возвращает целые числа без max;

  let randomIndex = randomIntNumber(min, max);
  let tmpDash, 
      randomDash, 
      newRowIdx,
      newColIdx;

  for(let rowIdx = 0; rowIdx < new_arr.length; rowIdx++){
    for(let colIdx=0; colIdx < new_arr[rowIdx].length; colIdx++){
      newRowIdx = randomIndex();
      newColIdx = randomIndex();
      tmpDash = new_arr[rowIdx][colIdx];
      randomDash = new_arr[newRowIdx][newColIdx];
      new_arr[rowIdx][colIdx] = randomDash;
      new_arr[newRowIdx][newColIdx] = tmpDash
    }
  }

  return new_arr;
}