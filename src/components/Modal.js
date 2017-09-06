import React from 'react'
import '../Modal.css'

const ModalFactory = ({modalType, handleClick}) =>
  {
    switch(modalType){
      case 'tips':
        return <ModalTips handleClick={() => handleClick()}/>;
      case 'winner':
        return <ModalWinner handleClick={() => handleClick()}/>;
      default:
        return [];
    }
  }

const ModalTips = ({handleClick}) =>
  {
    return(
      <div className='modal-tips'>
        <div className='goal'>
          <h2>Цель игры</h2>
          <div className='text-center'>
            <span>
              Передвигая фишки необходимо выстроить их по возрастанию, слева направо, сверху вниз
            </span>  
          </div>
        </div>
        <div className='navigation'>
          <h2>Управление</h2>
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
          <span className='close-tips' onClick={() => handleClick()}>Понятно!</span>
        </div>
      </div>
    )
  }

const ModalWinner = ({handleClick}) =>
  {
    return(
      <div className='modal-winner'>
          <h2>
            Поздравляю ты победил
          </h2>
          <div className='modal-footer center-content'>
            <span className='close-winner' onClick={() => handleClick()}>Супер!</span>
          </div>
        </div>
    )
  }

class Modal extends React.Component{
  handleClick(event){
    const elem = document.querySelector('div.modal-background');

    if(event.target === elem){
      this.props.onClick();
    }
  }

  render(){
    return <div className={`modal-background ${this.props.modalStatus}`} onClick={(event) => this.props.handleClick(event)}>
      <div className={`modal-window`}>
        <ModalFactory 
          modalType={this.props.modalType} 
          handleClick={() => this.props.handleClick()}/>
      </div>
    </div>
  }
}

export default Modal;