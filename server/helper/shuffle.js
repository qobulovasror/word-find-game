const shuffle = (arr) => {
    let currentIndex = arr.length,  randIndex;
    while (currentIndex > 0) {
      randIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randIndex]] = [
        arr[randIndex], arr[currentIndex]];
    }
    
    return arr;

}

module.exports = shuffle