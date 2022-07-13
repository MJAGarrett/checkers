import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StatusArea from "./StatusArea";

// Game Logic Constants
const whitePieces = ["w", "kw"];
const blackPieces = ["b", "kb"];
const downMovers = ["b", "kb", "kw"];
const upMovers = ["w", "kb", "kw"];

function Square(props) {
  let className = "";
  if (props.className) {
    className = props.className;
  }
  if (props.pieceType) {
    return (
      <button
        className={`square ${props.blackOrWhite} occupied ${className}`}
        onClick={props.onClick}
      >
        {props.pieceType}
      </button>
    );
  } else {
    return (
      <button
        className={`square ${props.blackOrWhite} ${props.noPieces} ${className}`}
        onClick={props.onClick}
      >
        {props.pieceType}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let staggered = false;
    if (
      (i >= 8 && i <= 15) ||
      (i >= 24 && i <= 31) ||
      (i >= 40 && i <= 47) ||
      (i >= 56 && i <= 63)
    ) {
      staggered = true;
    }
    if (staggered === false) {
      if (i % 2 === 0) {
        return (
          <Square
            noPieces="no-pieces"
            blackOrWhite="first"
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square
            blackOrWhite="second"
            noPieces=""
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    } else {
      if (i % 2 === 1) {
        return (
          <Square
            noPieces="no-pieces"
            blackOrWhite="first"
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square
            blackOrWhite="second"
            noPieces=""
            key={`square${1 + i}`}
            pieceType={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    }
  }

  renderBoard() {
    let board = [];
    for (let r = 0; r < 8; r++) {
      let rowItems = [];
      for (let c = 0; c < 8; c++) {
        let newSquare = this.renderSquare(r * 8 + c);
        // console.log(newSquare);
        if (this.props.selectedSquare) {
          if (this.props.selectedSquare === r * 8 + c) {
            let newestSquare = React.cloneElement(newSquare, {
              className: "selected",
            });
            rowItems.push(newestSquare);
          } else {
            rowItems.push(newSquare);
          }
        } else {
          rowItems.push(newSquare);
        }
      }
      board.push(
        React.createElement(
          "div",
          {
            key: `row${1 + r}`,
            className: `board-row ${r % 2 === 0 ? "startWhite" : "startBlack"}`,
          },
          rowItems
        )
      );
    }
    return board;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

const boardStart = () => {
  let board = Array(64).fill(null);
  let staggered = false;
  let updated = board.map((val, index) => {
    if (index > 0 && index % 8 === 0) {
      staggered = !staggered;
    }
    let whichPiece = null;
    if (staggered === false) {
      if (index % 2 === 1 && index > 39) {
        whichPiece = `w`;
      }
      if (index % 2 === 1 && index < 24) {
        whichPiece = `b`;
      }
    } else {
      if (index % 2 === 0 && index > 39) {
        whichPiece = `w`;
      }
      if (index % 2 === 0 && index < 24) {
        whichPiece = `b`;
      }
    }
    return whichPiece;
  });
  return updated;
};

// const testBoard = Array(64);
// const testIt = testBoard.fill("kw", 23, 24);
// const testy = testIt.fill("kb", 35, 36);

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: boardStart(),
        },
      ],
      stepNumber: 0,
      currentSelection: null,
      whoseTurn: blackPieces,
      onDoubleTurn: false,
      gameOver: false,
    };
  }
  checkDoubleMove(index) {
    if (this.canJump(index) === null || this.state.onDoubleTurn) {
      this.setState({
        whoseTurn:
          this.state.whoseTurn === blackPieces ? whitePieces : blackPieces,
        currentSelection: null,
        onDoubleTurn: false,
      });
    } else {
      this.setState({
        onDoubleTurn: true,
        currentSelection: index,
      });
    }
  }

  // Returns an array of possible jump moves of piece when called
  canJump(i) {
    const cells = document.querySelectorAll(".game-board button");
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let currentPlayerPieces = this.state.whoseTurn;
    let currentOpponentPieces =
      currentPlayerPieces === blackPieces ? whitePieces : blackPieces;

    let possibleMoves = [];

    let [jumpUpLeft, jumpUpRight, jumpDownLeft, jumpDownRight] = [
      cells[i - 14],
      cells[i - 18],
      cells[i + 14],
      cells[i + 18],
    ];

    let [upLeft, upRight, downLeft, downRight] = [
      cells[i - 7],
      cells[i - 9],
      cells[i + 7],
      cells[i + 9],
    ];

    // Both square[i] and square[this.state.currentSelection] are needed below as when checkDoubleMove()
    // is called the piece has not yet rendered to the event index yet.
    // i is used for checking a jump as a first move, the state is used when checking for a possible double jump.

    if (
      downMovers.includes(squares[this.state.currentSelection]) ||
      downMovers.includes(squares[i])
    ) {
      if (i + 14 <= 63) {
        if (
          currentOpponentPieces.includes(downLeft.textContent) &&
          jumpDownLeft.textContent === "" &&
          jumpDownLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 14);
        }
      }
      if (i + 18 <= 63) {
        if (
          currentOpponentPieces.includes(downRight.textContent) &&
          jumpDownRight.textContent === "" &&
          jumpDownRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 18);
        }
      }
    }
    if (
      upMovers.includes(squares[this.state.currentSelection]) ||
      upMovers.includes(squares[i])
    ) {
      if (i - 14 >= 0) {
        if (
          currentOpponentPieces.includes(upLeft.textContent) &&
          jumpUpLeft.textContent === "" &&
          jumpUpLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 14);
        }
      }
      if (i - 18 >= 0) {
        if (
          currentOpponentPieces.includes(upRight.textContent) &&
          jumpUpRight.textContent === "" &&
          jumpUpRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 18);
        }
      }
    }
    if (possibleMoves.length > 0) {
      return possibleMoves;
    } else return null;
  }

  kingPiece(checker, i) {
    if (checker === "b" && i >= 56) {
      return "kb";
    } else if (checker === "w" && i <= 7) {
      return "kw";
    } else {
      return checker;
    }
  }

  canMove(i) {
    const cells = document.querySelectorAll(".game-board button");
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    let possibleMoves = [];

    let [upLeft, upRight, downLeft, downRight] = [
      cells[i - 7],
      cells[i - 9],
      cells[i + 7],
      cells[i + 9],
    ];

    if (downMovers.includes(squares[i])) {
      if (i + 7 <= 63) {
        if (
          downLeft.textContent === "" &&
          downLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 7);
        }
      }
      if (i + 9 <= 63) {
        if (
          downRight.textContent === "" &&
          downRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i + 9);
        }
      }
    }
    if (upMovers.includes(squares[i])) {
      if (i - 7 >= 0) {
        if (
          upLeft.textContent === "" &&
          upLeft.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 7);
        }
      }
      if (i - 9 >= 0) {
        if (
          upRight.textContent === "" &&
          upRight.classList.contains("no-pieces") !== true
        ) {
          possibleMoves.push(i - 9);
        }
      }
    }
    if (possibleMoves.length > 0) {
      return possibleMoves;
    } else return null;
  }

  handleClick(i) {
    console.log(i);
    console.log(this.state.currentSelection);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let currentPlayerPieces = this.state.whoseTurn;
    let checkerIndex = this.state.currentSelection;
    let checker = squares[checkerIndex];

    console.log(this.state);

    if (!checkerIndex && !this.state.gameOver) {
      if (!squares[i] || !currentPlayerPieces.includes(squares[i])) {
        alert("Can't select");
      } else if (this.canMove(i) !== null || this.canJump(i) !== null) {
        this.setState({ currentSelection: i });
      }
    }
    // The above if makes sure only valid pieces are selected
    // The below if allows removing a selection if a capture has not been made.
    else {
      if (i === checkerIndex && this.state.onDoubleTurn !== true) {
        this.setState({ currentSelection: null });
      }
      // The below if series handles movement
      else if (currentPlayerPieces.includes(checker)) {
        if (!squares[i]) {
          // The below if handles moving into empty space
          if (this.canMove(checkerIndex) !== null) {
            // The above if statement is to prevent a minor error if possible moves is null.
            if (this.canMove(checkerIndex).includes(i)) {
              squares[i] = this.kingPiece(checker, i);
              squares[checkerIndex] = null;
              this.setState({
                history: history.concat([{ squares: squares }]),
                stepNumber: history.length,
                whoseTurn:
                  this.state.whoseTurn === blackPieces
                    ? whitePieces
                    : blackPieces,
                currentSelection: null,
              });
            }
          }
          // Updates board if a capture occurs.
          if (this.canJump(checkerIndex) !== null) {
            // The above if statement is to prevent a minor error if possible jumps is null.
            if (this.canJump(checkerIndex).includes(i)) {
              let moveTaken = this.canJump(checkerIndex).find(
                (val) => val === i
              );
              squares[i] = this.kingPiece(checker, i);
              squares[checkerIndex] = null;

              // Checks if the checker jumped and eliminates the opponents checker
              if (moveTaken - checkerIndex === 14) {
                squares[checkerIndex + 7] = null;
              } else if (moveTaken - checkerIndex === 18) {
                squares[checkerIndex + 9] = null;
              } else if (moveTaken - checkerIndex === -14) {
                squares[checkerIndex - 7] = null;
              } else if (moveTaken - checkerIndex === -18) {
                squares[checkerIndex - 9] = null;
              }

              this.setState({
                history: history.concat([{ squares: squares }]),
                stepNumber: history.length,
              });
              this.checkDoubleMove(i);
            }
          }
        }
      }
    }
  }
  endMoveClick() {
    this.setState({
      onDoubleTurn: false,
      whoseTurn:
        this.state.whoseTurn === blackPieces ? whitePieces : blackPieces,
      currentSelection: null,
    });
  }
  restartGame() {
    this.setState({
      stepNumber: 0,
      currentSelection: null,
      whoseTurn: blackPieces,
      onDoubleTurn: false,
      gameOver: false,
    });
  }
  calculateWinner(board) {
    // Counts the pieces remaining
    let numBlackPieces = 0;
    let numWhitePieces = 0;
    board.forEach((val) => {
      if (blackPieces.includes(val)) {
        numBlackPieces++;
      } else if (whitePieces.includes(val)) {
        numWhitePieces++;
      }
    });

    // Checks if any player has been eliminated.
    if (numBlackPieces === 0) {
      alert("White Wins!");
      this.setState({ gameOver: true });
    } else if (numWhitePieces === 0) {
      alert("Black Wins!");
      this.setState({ gameOver: true });
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let statusDisplay = StatusArea(current.squares, this.state.whoseTurn);
    // Check for a winner. Need to limit it with !this.state.gameOver to avoid an infinite loop.
    if (!this.state.gameOver) {
      this.calculateWinner(current.squares);
    }
    console.log(this.state.whoseTurn);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            selectedSquare={this.state.currentSelection}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        {statusDisplay}
        <div className="restart-wrapper">
          <button className="restart" onClick={() => this.restartGame()}>
            Restart the game.
          </button>
        </div>
        <EndMove
          onDoubleMove={this.state.onDoubleTurn}
          onClick={(i) => this.endMoveClick(i)}
        />
      </div>
    );
  }
}

function EndMove(props) {
  if (props.onDoubleMove) {
    return (
      <div className="end-move-wrapper">
        <button className="end-move" onClick={props.onClick}>
          End turn without a double move.
        </button>
      </div>
    );
  }
}

// --------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
