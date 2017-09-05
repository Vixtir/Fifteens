import React from 'react'
import Square from './Square'

  
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

export default Board;