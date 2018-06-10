import React, { Component } from 'react';

const canvasBox = {
    overflow: 'auto',
    height: '80vh',
    maxWidth: '800px',
    margin: '0 auto',
    border: '5px black solid'
}
  
export default class Canvas extends Component {
constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
}
componentDidMount() {
    const canvasElem = document.getElementById('canvas');
    const ctx = canvasElem.getContext('2d');

    ctx.beginPath();
    let move = 0;
    for(let i = 0; i < 101; i++) {
    ctx.moveTo(0, move);
    ctx.lineTo(3100, move);
    ctx.moveTo(move, 0);
    ctx.lineTo(move, 3100);
    move += 31;
    }
    ctx.stroke();
}
componentDidUpdate() {
    const canvasElem = document.getElementById('canvas');
    const ctx = canvasElem.getContext('2d');

    for(let i = 0; i < 100; i++) {
        for(let j = 0; j < 100; j++) {
            if(this.props.gameState[i][j] === true || this.props.gameState[i][j] === false) {
                let x = (i * 31) + 1;
                let y = (j * 31) + 1;
                if(this.props.gameState[i][j]) {
                    ctx.beginPath();
                    ctx.moveTo(x + 2, y + 2);
                    ctx.lineTo(x + 27, y + 27);
                    ctx.moveTo(x + 27, y + 2);
                    ctx.lineTo(x + 2, y + 27);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#003300';
                    ctx.stroke();
                }
                else {
                    ctx.beginPath();
                    ctx.arc(x + 14.5, y + 14.5, 11, 0, 2 * Math.PI, false);
                    ctx.fillStyle = 'green';
                    ctx.fill();
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#003300';
                    ctx.stroke();
                }
            }
        }
    }
}
handleClick(event) {
    let canvas = document.getElementById('canvas');
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // if(x % 31 === 0) {
    //     console.log('Stop');
    //     return;
    // }
    // if(y % 31 === 0) {
    //     console.log('Stop');
    //     return;
    // }
    let xId = 0, yId = 0;

    let move = 0;
    while(true) {
    console.log('XXXX');
    if(x >= move && x <= (move + 31)) break;
    xId++;
    move += 31;
    }
    move = 0;
    while(true) {
    console.log('YYYY');
    if(y >= move && y <= (move + 31)) break;
    yId++;
    move += 31;
    }
    this.props.onGameStateChange(xId, yId);
}
render() {
    return (
    <div style={canvasBox}>
        <canvas onClick={this.handleClick} id="canvas" width="3101" height="3101"></canvas>
    </div>
    );
}
}