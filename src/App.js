import React, {Component} from 'react';
import axios from 'axios';

import pokerRules from './helpers/pokerRules'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  getApiTokenDealerUrl = () => 'https://services.comparaonline.com/dealer/deck';

  getApiDeckUrl = (token) => `https://services.comparaonline.com/dealer/deck/${token}/deal/5`;

  // Lifecycle method
  componentDidMount() {

    const self = this;

    //TODO convert this nested promise into promise.all with axios
    setInterval(() => {
      axios.post(self.getApiTokenDealerUrl())
        .then((res) => {
          axios.post(self.getApiDeckUrl(res.data))
            .then((res) => {
              // Set state with result
              self.setState({deck1: res.data});

            }).catch((err) => {
            if (err && err.statusCode === 404) {
              self.setState({expirationTime: 0});
              return;
            }
            self.setState({error: 'Oops! Something did wrong by our side :(, please try again'});
          });
          axios.post(self.getApiDeckUrl(res.data))
            .then((res) => {
              // Set state with result
              self.setState({deck2: res.data});
            }).catch((err) => {
            if (err && err.status === 404) {
              self.setState({expirationTime: 0});
              return;
            }
            self.setState({error: 'Oops! Something did wrong by our side :(, please try again'});
          });
        }).catch((err) => {
        self.setState({message: 'Oops! Something did wrong by our side :(, please try again'});
      });
    }, this.state.expirationTime);

  }

  render() {

    if (this.state.error) {
      return (<div className="App-error">
        <div><i aria-hidden="true" className="fa fa-times-circle"/></div>
        {this.state.error}
      </div>);
    }

    this.state.deck1.map((card1) => {
      this.state.deck2.map((card2) => {
        return (
          <div>
            <p>Player 1 ${this.state.messagePlayer1}</p>
            <div className="card">
              <div className="card-header">${card1.number}</div>
              <div className="card-main">
                <div className="main-description">${card1.suit}</div>
              </div>
            </div>
            <p>Player 2 ${this.state.messagePlayer2}</p>
            <div className="card">
              <div className="card-header">${card2.number}</div>
              <div className="card-main">
                <div className="main-description">${card2.suit}</div>
              </div>
            </div>
            <button ></button>
          </div>
        );
      });
    });
  }
}

export default App;
