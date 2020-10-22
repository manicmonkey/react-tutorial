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

function Board({squares, winningSquares, onClick}) {

  const renderRow = (row, numberOfColumns) => {
    const rowStartIdx = row * numberOfColumns - numberOfColumns; //start row 1 at 0, row 2 at 3, row 3 at 6, etc
    return (
      <div key={row} className="board-row">
        {range(rowStartIdx, rowStartIdx + numberOfColumns).map(value => renderSquare(value))}
      </div>
    );
  }

  const renderSquare = (index) => {
    return (
      <Square
        key={index}
        value={squares[index]}
        className={winningSquares?.includes(index) ? 'winner' : ''}
        onClick={() => onClick(index)}
      />
    );
  }

  const numberOfRows = 3;
  const numberOfColumns = 3;

  return (
    <div>
      {range(0, numberOfRows).map(value => renderRow(value + 1, numberOfColumns))}
    </div>
  );
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
      Reverse moves: <input type="checkbox" onClick={() => setShowMovesAsc(!showMovesAsc)} value={showMovesAsc}/>
      <ol>{moves}</ol>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null)
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleSquareClick = (index) => {
    // Logic to handle history if we change to an old step and then click on a square
    const parentHistory = history.slice(0, stepNumber + 1);
    const current = parentHistory[parentHistory.length - 1];
    const squares = current.squares.slice();

    const winner = calculateWinner(squares);
    if (winner || squares[index])
      return;

    squares[index] = xIsNext ? 'X' : 'O';

    setHistory([...parentHistory, {
      squares: squares,
      moveRow: Math.floor(index / 3) + 1,
      moveCol: index % 3 + 1
    }]);
    setStepNumber(parentHistory.length);
    setXIsNext(!xIsNext);
  }

  const jumpToHandler = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  const current = history[stepNumber];

  const winningSquares = calculateWinner(current.squares);

  let status;
  if (winningSquares)
    status = 'Winner: ' + current.squares[winningSquares[0]];
  else if (current.squares.includes(null))
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  else
    status = "It's a draw!";

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winningSquares={winningSquares}
          onClick={(squareIndex) => handleSquareClick(squareIndex)}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          history={history}
          stepNumber={stepNumber}
          jumpTo={(step) => jumpToHandler(step)}/>
      </div>
    </div>
  );
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

function range(start, end) {
  return Array(end - start)
    .fill(null)
    .map((value, index) => index + start)
}