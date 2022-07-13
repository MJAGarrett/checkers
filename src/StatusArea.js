import React from "react";

export default function StatusArea(board, whoseTurn) {
  let pieceCountWhite = 0;
  let pieceCountBlack = 0;
  board.forEach((element) => {
    if (element === "w") {
      pieceCountWhite++;
    } else if (element === "b") {
      pieceCountBlack++;
    }
  });

  return (
    <div className="status-area">
      <div className="grid-container">
        <div className="white-info grid-item">
          <h3 className={whoseTurn === "w" ? "active-turn" : "inactive"}>
            White Turn
          </h3>
          <p>{`${pieceCountWhite} white pieces remaining.`}</p>
        </div>
        <div className="black-info grid-item">
          <h3 className={whoseTurn === "b" ? "active-turn" : "inactive"}>
            Black Turn
          </h3>
          <p>{`${pieceCountBlack} white pieces remaining.`}</p>
        </div>
      </div>
    </div>
  );
}
