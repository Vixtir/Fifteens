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
        <div className='modalNavigation'>
          <div className='modalHeader centerContent'>
            <span>Управление</span>
          </div>
          <div className='modalBody'>
            <div className='mouseNavigation'>
              <i className="material-icons">mouse</i><span> - левый клик мышки передвинет фишку на свободное место</span>
            </div>
            <div className='arrowNavigation'>
              <div className='wrapper'>
                <div><i className="material-icons">keyboard_arrow_up</i></div>
                <div><i className="material-icons">keyboard_arrow_left</i></div>
                <div><i className="material-icons">keyboard_arrow_down</i></div>
                <div><i className="material-icons">keyboard_arrow_right</i></div>
              </div>
              <span> - cтрелки на клавиатуре так же могут сдвинуть фишки на свободное поле</span>  
            </div>
          </div>
          <div className='modalFooter centerContent'>
            <span className='closeNavigation' onClick={() => this.props.onClick()}>Понятно!</span>
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
      openNavigationModal: false
      }                     
  }

  keyDownHandler(event){
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
    
    this.setState({
      squares: this.moveSquares(squares, fromX, fromY, toX, toY),
      rowWithZero: fromX,
      columnWithZero: fromY,
      turn: this.state.turn + 1
    })
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

  handleInfoClick(event){
    console.dir(this);
    this.setState({
      openNavigationModal: !this.state.openNavigationModal,
    })
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
    if(this.winPositionOfSquares(this.state.squares)){
      alert('YOU WIN');
    }  

    return (
      <div className='game'>
        <NavigationModal className={this.state.openNavigationModal ? 'opened':'closed'} onClick = {this.handleInfoClick.bind(this)}/>
        <div className='header'>
          <div className='title'>
            "Игра в Пятнашки" <i className="material-icons info" onClick = {(event) => this.handleInfoClick()}>info_outline</i>
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