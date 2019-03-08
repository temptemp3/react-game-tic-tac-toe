import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button 
        className="square" 
	onClick={props.onClick}
      >
      {props.value}
      </button>
    )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null
}


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
	onClick={() => this.props.onClick(i)}
      />
    )
  }

  createBoard() {
    const rows = 3
    const cols = 3
    let board = []
    for(let i=0;i<rows;i++) {
      let children = []
      for(let j=0;j<cols;j++) {
        children.push(
	  this.renderSquare(i*3+j)
	)
      }
      board.push(
        <div className="board-row">
	{children}
	</div>
      )
    }
    return (
      <div>
      {board}
      </div>
    )
  }

  render() {
    return (
      <div>
      {this.createBoard()}
      </div>
    );
  }

}

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
	moveLocation: null
      }],
      stepNumber: 0,
      xIsNext: true,
      order: "asc"
    }
  }

  handleClick(i) {

    const history = this.state.history.slice(0,this.state.stepNumber+1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moveLocation = "("+i%3+","+Math.floor(i/3)+")"

    if(calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = (this.state.xIsNext ? 'X' : 'O')
    this.setState({
	    history: history.concat([{
	      squares: squares,
	      moveLocation: moveLocation,
	    }]),
	    stepNumber: history.length,
	    xIsNext: !this.state.xIsNext,
    })
  }

  otherOrder() {
    return (
      this.isOrderAsc() ? "desc" : "asc"
    )
  }

  toggleOrder() {
    this.setState({
      order: this.otherOrder()
    })
  }

  isOrderAsc() {
    return (
      this.state.order == "asc"
    )
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  renderMoves(history) {
    return (
      history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        const loc = move ? 
          "Player choose " + history[move].moveLocation :
  	""
        const current =(
          move == this.state.stepNumber && 
  	  move != history.length - 1
  	  ? "current" : ""
        )
        return (
          <li class={current} key={move}>
  	<small>{loc}</small>
  	<button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      })
    )
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // order
    const order = this.state.order
    // testing
    //const order = "asc"
    //const order = "desc"

    // moves
    const moves = (
      order == "desc" ? 
      this.renderMoves(history) : 
      this.renderMoves(history).reverse()
    )

    let status
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
	    squares={current.squares}
            onClick={(i) => this.handleClick(i)}
	  />
        </div>
        <div className="game-info">
	　<button onClick={() => this.toggleOrder()}>
	  {this.otherOrder()}
	  </button>
          <div>{status}</div>
          <ol>{moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

