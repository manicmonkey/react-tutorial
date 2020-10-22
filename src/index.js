import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square({value, onClick, className}) {
  return (
    <button
      className={"square " + className}
      onClick={onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    const numberOfColumns = 3;
    const rows = [];
    for (let row = 1; row <= 3; row++) {
      rows.push(this.renderRow(row, numberOfColumns));
    }
    return <div>{rows}</div>;
  }

  renderRow(row, numberOfColumns) {
    const rows = [];
    const rowStartIdx = row * numberOfColumns - numberOfColumns; //start row 1 at 0, row 2 at 3, row 3 at 6, etc
    for (let squareIdx = rowStartIdx; squareIdx < rowStartIdx + numberOfColumns; squareIdx++) {
      rows.push(this.renderSquare(squareIdx))
    }
    return <div key={row} className="board-row">{rows}</div>
  }

  renderSquare(index) {
    return (
      <Square
        key={index}
        value={this.props.squares[index]}
        className={this.props.winningSquares && this.props.winningSquares.includes(index) ? 'winner' : ''}
        onClick={() => this.props.onClick(index)}
      />
    );
  }
}

function Moves({history, stepNumber, jumpTo}) {
  const [showMovesAsc, setShowMovesAsc] = useState(true);

  const moves = history.map((step, move) => {
    const desc = move ?
      `Go to move # ${move} (${step.moveRow}x${step.moveCol})` :
      'Go to game start';
    const isCurrentStep = move === stepNumber;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}
                style={{fontWeight: isCurrentStep ? 'bold' : 'normal'}}>{desc}</button>
      </li>
    );
  });

  if (!showMovesAsc)
    moves.reverse()

  return (
    <div>
      Reverse moves: <input type="checkbox" onClick={() => setShowMovesAsc(!showMovesAsc)} value={showMovesAsc} />
      <ol>{moves}</ol>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleSquareClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const winner = calculateWinner(squares);
    if (winner || squares[i])
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        moveRow: Math.floor(i / 3) + 1,
        moveCol: i % 3 + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpToHandler(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winningSquares = calculateWinner(current.squares);

    let status;
    if (winningSquares)
      status = 'Winner: ' + current.squares[winningSquares[0]];
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={(i) => this.handleSquareClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Moves
            history={this.state.history}
            stepNumber={this.state.stepNumber}
            jumpTo={(step) => this.jumpToHandler(step)}/>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

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
      return lines[i];
    }
  }
  return null;
}