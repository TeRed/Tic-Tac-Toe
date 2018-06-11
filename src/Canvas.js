import React, { Component } from 'react';
  
export default class Canvas extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    createGrid() {
        const canvasElem = document.getElementById('canvas');
        const ctx = canvasElem.getContext('2d');
        ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        
        let move = 0;
        ctx.beginPath();
        for(let i = 0; i < 101; i++) {
            ctx.moveTo(0, move);
            ctx.lineTo(4100, move);
            ctx.moveTo(move, 0);
            ctx.lineTo(move, 4100);
            
            move += 41;
        }
        ctx.stroke();
        ctx.closePath();
    }
    componentDidMount() {
        this.createGrid();
    }
    componentDidUpdate() {
        const canvasElem = document.getElementById('canvas');
        const ctx = canvasElem.getContext('2d');
        this.createGrid();
        
        if(this.props.winnerScore) {
            let start = this.props.winnerScore.start;
            let finish = this.props.winnerScore.finish;
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'black';
            
            ctx.beginPath();
            ctx.moveTo((start.x * 41) + 20, (start.y * 41) + 20);
            ctx.lineTo((finish.x * 41) + 20, (finish.y * 41) + 20);
            ctx.stroke();
            ctx.closePath();
        }

        this.props.Xmoves.forEach(element => {
            let x = (element.x * 41) + 1;
            let y = (element.y * 41) + 1;
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#003300';

            ctx.beginPath();
            ctx.moveTo(x + 2, y + 2);
            ctx.lineTo(x + 37, y + 37);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(x + 37, y + 2);
            ctx.lineTo(x + 2, y + 37);
            ctx.stroke();
            ctx.closePath();
        });

        this.props.Omoves.forEach(element => {
            let x = (element.x * 41) + 1;
            let y = (element.y * 41) + 1;
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#5D7EAF';

            ctx.beginPath();
            ctx.arc(x + 19.5, y + 19.5, 16, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.closePath();
        });
    }
    handleClick(event) {
        if(this.props.winnerScore) return;

        let canvas = document.getElementById('canvas');
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        let xId = 0, yId = 0;

        let move = 0;
        while(true) {
            if(x >= move && x <= (move + 41)) break;
            xId++;
            move += 41;
        }
        move = 0;
        while(true) {
            if(y >= move && y <= (move + 41)) break;
            yId++;
            move += 41;
        }
        this.props.onGameStateChange(xId, yId);
    }
    render() {
        return (
            <div className="canvasBox">
                <canvas onClick={this.handleClick} id="canvas" width="4101" height="4101"></canvas>
            </div>
        );
    }
}