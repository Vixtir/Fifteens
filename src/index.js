import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import shuffleArray from './snippets'

class Square extends React.Component{
  render(){
    return (
      <div className={this.props.className} onClick={this.props.onClick} >
        {this.props.value ? this.props.value : ''}
      </div>
    )
  }
}

class Board extends React.Component{
  setClassName(i){
    return i === 0 ? 'zero-square' : 'square';
  }

  renderSquare(i, x, y){
    return <Square 
      value={i} 
      onClick={()=> this.props.handleClick(x, y)} 
      className={this.setClassName(i)}
      />
  }

  makeArrayOfSquares(array){
    let arrayOfSquares = [];
    for(let i = 0; i < array.length; i++){
      arrayOfSquares.push([])
      for(let j = 0; j < array[i].length; j++){
        arrayOfSquares[i].push(this.renderSquare(array[i][j], i, j))
      }
    }

    return arrayOfSquares;
  }

  render(){
    return (
        <div className='board'>
          {this.makeArrayOfSquares(this.props.squares)}
        </div>
    )
  }
}

class Game extends React.Component{
  constructor(){
    super();
    const startArray = shuffleArray([[ 1, 2, 3, 4],
                                     [ 5, 6, 7, 8],
                                     [ 9,10,11,12],
                                     [13,14,15, 0]]);

    this.state = {
      squares: startArray,
      rowWithZero: this.findRowWithZero(startArray),
      columnWithZero: startArray[this.findRowWithZero(startArray)].indexOf(0),
      turn: 0
      }                     
  }

  findRowWithZero(arr){
    for(let i = 0; i < arr.length; i++){
      let haveZero = arr[i].some( (el) => el === 0);

      if(haveZero){
        return i;
      };
    }
  }

  winPositionOfSquares(squares){
    var winPosition = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15, 0]];

    for(var i = 0; i < winPosition.length; i++){
        for(var j = 0; j < winPosition[i].length; j++){
            if(squares[i][j] !== winPosition[i][j]){
                return false;
            }
        }
    }

    return true
  }

  canMove(x1, y1, x2, y2){
    let distance = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))
    return distance === 1;
  }

  handleClick(x, y){
    let squares = this.state.squares.slice();
    let dashClick, tmp;

    if(squares[x][y]!==0){
      if(this.canMove(x, y, this.state.rowWithZero, this.state.columnWithZero)){
        tmp = squares[x][y];
        squares[this.state.rowWithZero][this.state.columnWithZero] = tmp;
        squares[x][y] = 0

        this.setState({
          squares: squares,
          rowWithZero: x,
          columnWithZero: y,
          turn: this.state.turn + 1
        })
      }
    }
  }

  resetGame(){
    const startArray = shuffleArray([[ 1, 2, 3, 4],
                                     [ 5, 6, 7, 8],
                                     [ 9,10,11,12],
                                     [13,14,15, 0]]);

    this.setState({
      squares: startArray,
      rowWithZero: this.findRowWithZero(startArray),
      columnWithZero: startArray[this.findRowWithZero(startArray)].indexOf(0),
      turn: 0
      })  
  }

  render(){
    // let rowWithZero = this.findRowWithZero(gameArray);
    // let columnWithZero = gameArray[rowWithZero].indexOf(0);
    if(this.winPositionOfSquares(this.state.squares)){
      alert('YOU WIN');
    }
    return (
      <div className='game'>
        <div className='header'>
          <div className='title'>
            "Игра в Пятнашки"
          </div>

        </div>
        <div className='main'>
          <div className='leftSideBar'>
            <div className='turnCounter'>
              Количество ходов: {this.state.turn}
            </div>
          </div>
          <Board 
            squares={this.state.squares} handleClick={(x, y)=>{ this.handleClick(x,y) }}
          />
          <div className='rightSideBar'>
            <div className='button resetButton' onClick={() => this.resetGame()}>
              <i className="material-icons refreshIcon">autorenew</i>
            </div>
          </div>
        </div>
        <div className='footer'>
          <div className='turnCounter'>
            Количество ходов: {this.state.turn}
          </div>
          <div className='button resetButton' onClick={() => this.resetGame()}>Новая игра</div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />, 
  document.getElementById('root'));
registerServiceWorker();