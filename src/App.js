import React, { Component } from 'react';
import './App.css';
import Canvas from './Canvas';

const movesFunctions = {
  top: (obj, move) => ({
    x: obj.x,
    y: obj.y - move
  }),
  topRight: (obj, move) => ({
    x: obj.x + move,
    y: obj.y - move
  }),
  right: (obj, move) => ({
    x: obj.x + move,
    y: obj.y
  }),
  bottomRight: (obj, move) => ({
    x: obj.x + move,
    y: obj.y + move
  }),
  bottom: (obj, move) => ({
    x: obj.x,
    y: obj.y + move
  }),
  bottomLeft: (obj, move) => ({
    x: obj.x - move,
    y: obj.y + move
  }),
  left: (obj, move) => ({
    x: obj.x - move,
    y: obj.y
  }),
  topLeft: (obj, move) => ({
    x: obj.x - move,
    y: obj.y - move
  })
}

class App extends Component {
  constructor(props) {
    super(props);
    this.trueMoves = [];
    this.falseMoves = [];

    const gameState = [];
    for(let i = 0; i < 100; i++) {
      const toPush = [];
      for(let j = 0; j < 100; j++) toPush.push(0);
      gameState.push(toPush)
    }
    this.state = {
      gameState: gameState,
      currentPlayer: true
    }
    this.updateGameState = this.updateGameState.bind(this)
  }

  arrayHas(array, element) {
    if(array.filter(el => {return el.x === element.x && el.y === element.y}).length)
      return true;
    else return false;
  }

  arrayGet(array, element) {
    let elementRef = null;
    array.forEach(el => {
      if(el.x === element.x && el.y === element.y) elementRef = el;
    });
    return elementRef;
  }

  checkForWinner(moves) {
    for(let i = 0; i < moves.length; i++) {
      const el = moves[i];
      let nextSteps = [undefined, undefined, undefined, undefined]

      if (nextSteps.map((val, i) => ({x: el.x - (i + 1), y: el.y - (i + 1)}))
                    .filter(val => this.arrayHas(moves, val))
                    .length === 4) return true;

      if (nextSteps.map((val, i) => ({x: el.x, y: el.y - (i + 1)}))
                    .filter(val => this.arrayHas(moves, val))
                    .length === 4) return true;

      if (nextSteps.map((val, i) => ({x: el.x + i + 1, y: el.y - (i + 1)}))
                    .filter(val => this.arrayHas(moves, val))
                    .length === 4) return true;

      if (nextSteps.map((val, i) => ({x: el.x - (i + 1), y: el.y}))
                    .filter(val => this.arrayHas(moves, val))
                    .length === 4) return true;
    }
    return false;
  }

  addPrice(bestMoves, objectToCheck, price) {
    let element = this.arrayGet(bestMoves, objectToCheck);
    if(element) element.price += price;
    else bestMoves.push({...objectToCheck, price});
  }

  withinBoundaries(objectToCheck) {
    return objectToCheck.x >= 0 && objectToCheck.x < 100
            && objectToCheck.y >= 0 && objectToCheck.y < 100;
  }

  heuristic(moves, counterMoves) {
    let bestMoves = [];

    moves.forEach((el) => {
      let counter = 1;
      for (const key of Object.keys(movesFunctions)) {
        for(let move = 1;;move++) {
          let objectToCheck = movesFunctions[key](el, move);
          if(!this.arrayHas(moves, objectToCheck)) {
            if(!this.arrayHas(counterMoves, objectToCheck) &&
              this.withinBoundaries(objectToCheck)) {
              this.addPrice(bestMoves, objectToCheck, counter);
            }
            counter = 1;
            break;
          }
          counter++;
        }
      }
    });

    return bestMoves;
  }

  getFields(movesA, movesB) {
    let fields = this.heuristic(movesA, movesB).concat(this.heuristic(movesB, movesA));

    const bestPrice = Math.max.apply(Math, fields.map(o => o.price));

    return fields.filter(field => field.price === bestPrice);
  }

  decisionMove(moves, counterMoves) {
    let fields = this.getFields(moves, counterMoves); // tutaj dostajemy pola

    console.log(fields);

    let checkMoves = []; // tutaj mamy jakieś ruchy
    checkMoves = fields.map(move => {
      return {x: move.x, y: move.y, price: this.MINMAX(move, moves, counterMoves, 2)};
    });
    // return max(moves); // zwracamu move z najlepsza wartoscia
    return checkMoves.reduce((prev, curr) => {
      return prev.price > curr.price ? prev : curr;
    });
  }

  MINMAX(move, moves, counterMoves, level) {
    if (level === 0) return move.price;
    let p = moves.concat([{x: move.x, y: move.y}]);
    let fields = this.getFields(moves, counterMoves);

    let bestOpponent = fields.reduce((prev, curr) => {
      return prev.price > curr.price ? prev : curr;
    });

    if(level % 2 === 0)
      return -move.price + this.MINMAX(bestOpponent, p, counterMoves, level - 1);
    else
      return move.price + this.MINMAX(bestOpponent, p, counterMoves, level - 1);
  }

  updateGameState(x, y) {
    let gameState = this.state.gameState;

    let possibleMove = {x, y};
    if(!this.arrayHas(this.falseMoves, possibleMove) &&
        !this.arrayHas(this.trueMoves, possibleMove)) {
      this.trueMoves.push(possibleMove);
      gameState[x][y] = this.state.currentPlayer;
    }
    else return;

    let bestMove = this.decisionMove(this.falseMoves, this.trueMoves);

    gameState[bestMove.x][bestMove.y] = !this.state.currentPlayer;
    this.falseMoves.push(bestMove);

    if(this.checkForWinner(this.trueMoves) ||
    this.checkForWinner(this.falseMoves)) alert('Winner');

    this.setState((prevState, props) => ({
        gameState: gameState
      })
    );
  }

  render() {
    return (
      <div className="App">
        <h1>Tic Tac Toe</h1>
        <Canvas gameState={this.state.gameState}
                onGameStateChange={this.updateGameState}
        />
      </div>
    );
  }
}

export default App;