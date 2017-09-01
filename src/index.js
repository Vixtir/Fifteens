import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import shuffleArray from './snippets'

class NavigationModal extends React.Component{
  handleClick(event){
    const elem = document.querySelector('div.modal');

    if(event.target === elem){
      this.props.onClick();
    }
  }

  render(){
    return(
      <div className={`modal ${this.props.className}`} onClick={(event) => this.handleClick(event)}>
        <div className='modal-navigation'>
          <div className='goal'>
            <div className='modal-header center-content'>
              <span>Цель игры</span>
            </div>
            <div className='text-center'>
              <span>
                Передвигая фишки необходимо выстроить их по возрастанию, слева направо, сверху вниз
              </span>  
            </div>
          </div>
          <div className='modal-header center-content'>
            <span>Управление</span>
          </div>
          <div className='modal-body'>
            <div className='tap-navigation'>
              <div>
                <i className="material-icons">tap_and_play</i>
              </div>
              <div>
                <span>
                  Тап на фишке передвинет ее на свободное место
                </span>  
              </div>
            </div>
            <div className='mouse-navigation'>
              <div>
                <i className="material-icons">mouse</i>
              </div>
              <span> Левый клик мышки передвинет фишку на свободное место</span>
            </div>
            <div className='arrow-navigation'>
              <div>
              <div className='wrapper'>
                <div><i className="material-icons">keyboard_arrow_up</i></div>
                <div><i className="material-icons">keyboard_arrow_left</i></div>
                <div><i className="material-icons">keyboard_arrow_down</i></div>
                <div><i className="material-icons">keyboard_arrow_right</i></div>
              </div>
              </div>  
              <span> Стрелки на клавиатуре так же могут сдвинуть фишки на свободное поле</span>  
            </div>
          </div>

          <div className='modal-footer center-content'>
            <span className='close-navigation' onClick={() => this.props.onClick()}>Понятно!</span>
          </div>  
        </div>
      </div>
    )
  }
}

class WinnerModal extends React.Component{
  handleClick(event){
    const elem = document.querySelector('div.modal');

    if(event.target === elem){
      this.props.onClick();
    }
  }

  render(){
    return(
      <div className={`modal ${this.props.className}`} onClick={(event) => this.handleClick(event)}>
        <div className='modal-win'>
          <div className='modal-header text-center'>
            Поздравляю ты победил
          </div>
          <div className='modal-footer center-content'>
            <span className='close-winner' onClick={() => this.props.onClick()}>Супер!</span>
          </div>  
        </div>
      </div>
    )
  }
}

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
        squares[x][y] = 0
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

  handleInfoClick(event){
    this.setState({
      openNavigationModal: !this.state.openNavigationModal,
    })
  }

  handleWinnerClick(event){
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

  getRnd(min, max) {
    return Math.random() * (max - min) + min;
  }

  render(){
    return (
      <div className='game'>
        <NavigationModal 
          className={this.state.openNavigationModal ? 'opened':'closed'} 
          onClick = {this.handleInfoClick.bind(this)}
        />
        <WinnerModal 
          className={this.state.openWinnerModal ? 'opened':'closed'} 
          onClick = {this.handleWinnerClick.bind(this)}
        />
        <div className='header'>
          <div className='title'>
            "Игра в Пятнашки" <i className="material-icons info" onClick = {(event) => this.handleInfoClick()}>info_outline</i>
          </div>

        </div>
        <div className='main'>
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

ReactDOM.render(
  <Game />, 
  document.getElementById('root'));
registerServiceWorker();