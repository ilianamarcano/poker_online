import React, {Component} from 'react';

import diamond from './img/diamond.gif';
import spade from './img/spade.gif';
import club from './img/club.gif';
import heart from './img/heart.gif';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  getImg =(card1) =>{
    let img = null;
    let css = null;
    switch (card1.suit) {
      case 'diamonds':
        img = diamond;
        css= 'card-header-red';
        break;
      case 'spades':
        img = spade;
        css= 'card-header-black';
        break;
      case 'clubs':
        img = club;
        css= 'card-header-black';
        break;
      case 'hearts':
        img = heart;
        css= 'card-header-red';
        break;
    }
    return {img,css};
  }

  render() {
    return <div className="container-cards">
      {this.props.deck.map((card) => {
        const {img, css} = this.getImg(card);
        return (<div className={`card ${card.suit === 'clubs' || card.suit === 'spades' ? 'card-black' : null}`}>
          <div className={css}><img className="App-img" src={img}/></div>
          <div className="card-main">
            <div className="main-description">{card.number}</div>
          </div>
        </div>)
      })}
    </div>
  }
}

export default Card;
