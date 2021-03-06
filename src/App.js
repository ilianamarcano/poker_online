import React, {Component} from 'react';
import axios from 'axios';

import pokerRules from './helpers/pokerRules'
import './App.css';
import Card from './Card';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      messagePlayer1: null,
      messagePlayer2: null,
      messageTied: null,
      deck1: [],
      deck2: [],
      token: null,
    }
  }

  getApiTokenDealerUrl = () => 'https://services.comparaonline.com/dealer/deck';

  getApiDeckUrl = () => `https://services.comparaonline.com/dealer/deck/${this.state.token}/deal/5`;

  handleClick = () => {
    this.fetchDecks(this);
    if(this.state.deck1.length>0 && this.state.deck2.length>0){
      this.calculateWinner();
    }else{
      this.setState({error: 'Oops! Something did wrong by our side :(, please try clicking again'});
    }

  };

  calculateWinner() {
    const {
      getHighestCard,
      hasOnePair,
      hasTwoPairs,
      hasThreeOfAKind,
      hasStraight,
      hasFlush,
      hasFullHouse,
      hasFourOfAKind,
      hasStraightFlush,
      hasRoyalFlush,
      getSortedValueCards,
    } = pokerRules;

    const ranking = [hasRoyalFlush, hasStraightFlush,
      hasFourOfAKind, hasFullHouse, hasFlush, hasStraight,
      hasThreeOfAKind, hasTwoPairs, hasOnePair];

    const {deck1, deck2} = this.state;


    const funcMatched1 = ranking.find((func) => {
      return func(deck1)

    });

    const funcMatched2 = ranking.find((func) => {
      return func(deck2)
    });

    const combinations = {
      hasOnePair: 'one pair',
      hasTwoPairs: 'two pairs',
      hasThreeOfAKind: 'three of a kind',
      hasStraight: 'straight',
      hasFlush: 'flush',
      hasFullHouse: 'full house',
      hasFourOfAKind: 'four of a kind',
      hasStraightFlush: 'straight flush',
      hasRoyalFlush: 'royal flush',
    }

    if ((funcMatched1 && ranking.indexOf(funcMatched1) < ranking.indexOf(funcMatched2)) || getHighestCard(deck1, deck2).player === 1) {
      this.setState({messagePlayer1: `YOU WON!!! with ${funcMatched1?combinations[funcMatched1.name]:'highest card'}`});
    } else if ((funcMatched2 && ranking.indexOf(funcMatched2) < ranking.indexOf(funcMatched1)) || getHighestCard(deck1, deck2).player === 2) {
      this.setState({messagePlayer2: `YOU WON!!! with ${funcMatched2?combinations[funcMatched2.name]:'highest card'}`});
    } else {
      const deck1Sorted = getSortedValueCards(deck1).reverse();
      const deck2Sorted = getSortedValueCards(deck2).reverse();

      const deck1Tmp = Object.assign([], deck1Sorted);
      const deck2Tmp = Object.assign([], deck2Sorted);
      while (deck1Tmp.length > 1 && deck2Tmp.length > 1) {
        deck1Tmp.shift();
        deck2Tmp.shift();

        if (getHighestCard(deck1Tmp, deck2Tmp).player === 1) {
          this.setState({messagePlayer1: 'YOU WON!!! with highest card'});
          break;
        }
        if (getHighestCard(deck1Tmp, deck2Tmp).player === 2) {
          this.setState({messagePlayer2: 'YOU WON!!! with  highest card'});
          break;
        }
      }

      this.setState({messageTied: 'Tied!!! Click to play again'});
    }
  }

  // Lifecycle method
  componentDidMount() {

    const self = this;
    setInterval(() => {
      axios.post(self.getApiTokenDealerUrl())
        .then((res) => {
          this.setState({token:res.data});
        }).catch((err) => {
        self.setState({message: 'Oops! Something did wrong by our side :(, please try again'});
      });
    }, this.state.expirationTime);

    this.fetchDecks(self);
  }

  //TODO convert this nested promise into promise.all with axios
  fetchDecks(self) {
    axios.post(self.getApiTokenDealerUrl())
      .then((res) => {
        this.setState({token: res.data});
        axios.get(self.getApiDeckUrl())
          .then((res) => {
            // Set state with result
            self.setState({deck1: res.data});

          }).catch((err) => {

          self.setState({error: 'Oops! Something did wrong by our side :(, please try again'});
        });
        axios.get(self.getApiDeckUrl(res.data))
          .then((res) => {
            // Set state with result
            self.setState({deck2: res.data});
          }).catch((err) => {
          if (err && err.response && err.response.status === 404) {
            return;
          }
          self.setState({error: 'Oops! Something did wrong by our side :(, please try again'});
        });
      }).catch((err) => {
      self.setState({message: 'Oops! Something did wrong by our side :(, please try again'});
    });
  }

  render() {

    if (this.state.error) {
      return (<div className="App-error">
        <div><i aria-hidden="true" className="fa fa-times-circle"/></div>
        {this.state.error}
      </div>);
    } else {
      return (
        <div>
          <p>{this.state.messageTied}</p>
          <button className="btn" onClick={this.handleClick}>Click to get winner</button>
          <p>Player 1 {this.state.messagePlayer1}</p>
          <Card deck={this.state.deck1} />
          <p>Player 2 {this.state.messagePlayer2}</p>
          <Card deck={this.state.deck2} />
        </div>
      );

    }
  }
}

export default App;
