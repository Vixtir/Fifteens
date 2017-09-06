import React from 'react';

import shuffleArray from '../utils/shuffleArray'
import Board from '../components/Board'
import Modal from '../components/Modal'

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
      turn: 0,
      openNavigationModal: false,
      openWinnerModal:false,
      }                     
  }

  keyDownHandler(event){
    if(this.state.openNavigationModal || this.state.openWinnerModal){
      return;
    }

    let squares = this.state.squares.slice();
    let rowZero = this.state.rowWithZero;
    let columnZero = this.state.columnWithZero;
    let [fromX, fromY, toX, toY] = [rowZero, columnZero, rowZero, columnZero];

    if(event.keyCode === 37){
      if(columnZero === 3){
        return false;
      } else {
        fromY += 1;
      }
    } else if(event.keyCode === 38){
      if(rowZero === 3){
        return false;
      } else {
        fromX +=1
      }
    } else if(event.keyCode === 39){
      if(columnZero === 0){
        return false;
      } else {
        fromY -= 1
      }
    } else if(event.keyCode === 40){
      if(rowZero === 0){
        return false;
      } else {
        fromX -= 1
      }
    } else if(event.keyCode === 13) {
      this.resetGame();
      return;
    } else {
      return false;
    }

    const new_squares = this.moveSquares(squares, fromX, fromY, toX, toY);
    let isWinner = this.winPositionOfSquares(new_squares);
    if(isWinner){
      this.setState({
        squares: new_squares,
        rowWithZero: fromX,
        columnWithZero: fromY,
        turn: this.state.turn + 1,
        openWinnerModal: true
      })
    } else {
      this.setState({
        squares: new_squares,
        rowWithZero: fromX,
        columnWithZero: fromY,
        turn: this.state.turn + 1
      })
    }
  }

  componentDidMount(){
    window.addEventListener('keydown', this.keyDownHandler.bind(this))
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.keyDownHandler.bind(this))
  }

  moveSquares(arrayOfSquares, fromX, fromY, toX, toY){
    let squares = arrayOfSquares.slice();

    let tmp = squares[fromX][fromY];
    squares[toX][toY] = tmp;
    squares[fromX][fromY] = 0;

    return squares;
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
    if(this.state.openNavigationModal || this.state.openWinnerModal){
      return;
    }

    let squares = this.state.squares.slice();
    let tmp;

    if(squares[x][y]!==0){
      if(this.canMove(x, y, this.state.rowWithZero, this.state.columnWithZero)){
        tmp = squares[x][y];
        squares[this.state.rowWithZero][this.state.columnWithZero] = tmp;
        squares[x][y] = 0;

        let isWinner = this.winPositionOfSquares(squares);

        if(isWinner){
          this.setState({
            squares: squares,
            rowWithZero: x,
            columnWithZero: y,
            turn: this.state.turn + 1,
            openWinnerModal: true,
          })
        } else {
          this.setState({
            squares: squares,
            rowWithZero: x,
            columnWithZero: y,
            turn: this.state.turn + 1
          })
        }
      }
    }
  }

  handleTipsClick(){
    this.setState({
      openNavigationModal: !this.state.openNavigationModal,
    })
  }

  handleWinnerClick(){
    this.resetGame();
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
      turn: 0,
      openNavigationModal: false,
      openWinnerModal:false
      })  
  }

  render(){
    return (
      <div className='game'>
        <Modal 
          modalStatus={this.state.openNavigationModal ? 'opened':'closed'}
          modalType={`tips`}
          handleClick = {this.handleTipsClick.bind(this)}
        />
        <Modal 
          modalStatus={this.state.openWinnerModal ? 'opened':'closed'}
          modalType={`winner`}
          handleClick = {this.handleWinnerClick.bind(this)}
        />
        <div className='header'>
          <div className='title'>
            <span>"Игра в Пятнашки"</span> <i className="material-icons info" onClick = {(event) => this.handleTipsClick()}>info_outline</i>
          </div>

        </div>
        <div className='body'>
          <div className='left-side-bar'>
            <div className='turn-counter'>
              Количество ходов: {this.state.turn}
            </div>
          </div>
          <Board 
            squares={this.state.squares} handleClick={(x, y)=>{ this.handleClick(x,y) }}
          />
          <div className='right-side-bar'>
            <div className='button reset-button' onClick={() => this.resetGame()}>
              <i className="material-icons refresh-icon">autorenew</i>
            </div>
          </div>
        </div>
        <div className='footer'>
          <div className='turn-counter'>
            Количество ходов: {this.state.turn}
          </div>
          <div className='button reset-button' onClick={() => this.resetGame()}>Новая игра</div>
        </div>
      </div>
    )
  }
}

export default Game;