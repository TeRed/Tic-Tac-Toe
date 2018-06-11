import React, { Component } from 'react';
import Canvas from './Canvas';
import Menu from './Menu';

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

    this.state = {
      Xmoves: [],
      Omoves: [],
      winnerScore: undefined
    }
    this.updateGameState = this.updateGameState.bind(this);
    this.AiStarts = this.AiStarts.bind(this);
    this.restart = this.restart.bind(this);
  }

  arrayHas(array, element) {
    if(array.filter(el => {return el.x === element.x && el.y === element.y}).length)
      return true;
    else return false;
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
      const nextSteps = [undefined, undefined, undefined, undefined];
      let nextStepsFiltered;

      nextStepsFiltered = nextSteps.map((val, i) => ({x: el.x - (i + 1), y: el.y - (i + 1)}))
                                    .filter(val => this.arrayHas(moves, val));
      if(nextStepsFiltered.length === 4) {
        return {start: el, finish: nextStepsFiltered[3]};
      }

      nextStepsFiltered = nextSteps.map((val, i) => ({x: el.x, y: el.y - (i + 1)}))
                                    .filter(val => this.arrayHas(moves, val));
      if(nextStepsFiltered.length === 4) {
        return {start: el, finish: nextStepsFiltered[3]};
      }

      nextStepsFiltered = nextSteps.map((val, i) => ({x: el.x + i + 1, y: el.y - (i + 1)}))
                                    .filter(val => this.arrayHas(moves, val));
      if(nextStepsFiltered.length === 4) {
        return {start: el, finish: nextStepsFiltered[3]};
      }

      nextStepsFiltered = nextSteps.map((val, i) => ({x: el.x - (i + 1), y: el.y}))
                                    .filter(val => this.arrayHas(moves, val));
      if(nextStepsFiltered.length === 4) {
        return {start: el, finish: nextStepsFiltered[3]};
      }
    }
    return false;
  }

  heuristic(moves, counterMoves) {
    const bestMoves = [];

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

  MINMAX(move, moves, counterMoves, level) {
    if (level === 0) return move.price;
    let p = moves.concat([{x: move.x, y: move.y}]);
    let fields = this.getFields(moves, counterMoves);

    let bestOpponent = fields.reduce((prev, curr) => {
      return prev.price > curr.price ? prev : curr;
    });

    if(level % 2 !== 0)
      return -move.price + this.MINMAX(bestOpponent, p, counterMoves, level - 1);
    else
      return move.price + this.MINMAX(bestOpponent, p, counterMoves, level - 1);
  }

  aiMove(moves, counterMoves) {
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

  updateGameState(x, y) {
    let opponentMoves = this.state.Omoves;
    let playerMoves = this.state.Xmoves;

    //check if it is even right move right now
    const possibleMove = {x, y};
    if(!this.arrayHas(opponentMoves, possibleMove) &&
        !this.arrayHas(playerMoves, possibleMove)) {
      playerMoves = playerMoves.concat([possibleMove]);
    }
    else return;

    //get best ai move
    let bestOpponentMove = this.aiMove(opponentMoves, playerMoves);
    opponentMoves = opponentMoves.concat([bestOpponentMove]);

    //check for winner and update if necessary
    let XwinnerScore = this.checkForWinner(playerMoves);
    let OwinnerScore = this.checkForWinner(opponentMoves);

    if(XwinnerScore) {
      this.setState({
        winnerScore: XwinnerScore
      });
    }
    else if(OwinnerScore) {
      this.setState({
        winnerScore: OwinnerScore
      });
    }

    //rerender
    this.setState({
      Omoves: opponentMoves,
      Xmoves: playerMoves
    });
  }

  restart() {
    this.setState({
      Xmoves: [],
      Omoves: [],
      winnerScore: undefined
    });
  }

  AiStarts() {
    if(this.state.Xmoves.length === 0 && this.state.Omoves.length === 0) {
      this.setState({
        Omoves: [{x: 10, y: 10}]
      });
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Tic Tac Toe</h1>
        <Menu onAiStarts={this.AiStarts}
              onRestart={this.restart}
        />
        <Canvas Omoves={this.state.Omoves}
                Xmoves={this.state.Xmoves}
                winnerScore={this.state.winnerScore}
                onGameStateChange={this.updateGameState}
        />
      </div>
    );
  }
}

export default App;