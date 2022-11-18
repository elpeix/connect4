import Connect4 from './Connect4.js';
import { c4 } from './constants.js';

const Connect4View = function($connect) {
  const rows = 6;
  const cols = 7;
  const prefix = 'connect4';
  const shapeIdentifier = `${prefix}-holes`;
  const cn = {
    container: `${prefix}-board-container`,
    upperBoard: `${prefix}-upper-board`,
    board: `${prefix}-board`,
    row: `${prefix}-row`,
    piece: `${prefix}-piece`,
    pieceContainer: `${prefix}-piece-container`,
    pieceNext: `${prefix}-piece-next`,
    pieceLast: `${prefix}-piece-last`,
    pieceLine: `${prefix}-piece-line`,
    empty: `${prefix}-empty`,
    display: `${prefix}-display`,
    displayMessage: `${prefix}-display-message`,
    displayPiece: `${prefix}-display-piece`,
    player1: `${prefix}-player1`,
    player2: `${prefix}-player2`,
    draw: `${prefix}-draw`,
    reset: `${prefix}-reset`,
    resetButton: `${prefix}-reset-button`,
    boardConfig: `${prefix}-board-config`,
    mouseHelperContainer: `${prefix}-mouse-helper-container`,
    mouseHelper: `${prefix}-mouse-helper`,
    mouseHelperCircle: `${prefix}-mouse-helper-circle`,
    mouseHelperMessage: `${prefix}-mouse-helper-message`,
    computerModeContainer: `${prefix}-computer-mode-container`,
    computerMode: `${prefix}-computer-mode`,
    computerModeCircle: `${prefix}-computer-mode-circle`,
    computerModeMessage: `${prefix}-computer-mode-message`,
    active: `${prefix}-active`,
  }
  let mouseHelp = false;
  let computerMode = false;
  let viewerBoard;

  let connect4 = new Connect4(rows, cols, computerMode);

  const $boardContainer = domCreate('div', cn.container);

  const $nodeUpperBoard = domCreate('div', cn.upperBoard);
  $boardContainer.append($nodeUpperBoard);
  $nodeUpperBoard.append(createSvg());

  const $board = domCreate('div', cn.board);
  $board.style.clipPath = `url(#${shapeIdentifier})`;
  $boardContainer.append($board);

  const $display = domCreate('div', cn.display);
  $boardContainer.append($display);

  const $message = domCreate('div', cn.displayMessage);
  $display.append($message);

  const $displayPiece = domCreate('div', `${cn.piece} ${cn.displayPiece}`);
  $display.append($displayPiece);

  const $reset = domCreate('div', cn.reset);
  $boardContainer.append($reset);

  const $resetButton = domCreate('button', cn.resetButton);
  $resetButton.addEventListener('click', startGame);
  $reset.append($resetButton);

  const $boardConfig = domCreate('div', cn.boardConfig);
  $boardContainer.append($boardConfig);

  const $mouseHelperContainer = domCreate('div', cn.mouseHelperContainer);
  $mouseHelperContainer.addEventListener('click', toggleMouse);
  const $mouseHelper = domCreate('div', cn.mouseHelper);
  const $mouseHelperCircle = domCreate('div', cn.mouseHelperCircle);
  $mouseHelper.append($mouseHelperCircle);
  $mouseHelperContainer.append($mouseHelper);
  const $mouseHelperMessage = domCreate('div', cn.mouseHelperMessage);
  $mouseHelperContainer.append($mouseHelperMessage);
  $boardConfig.append($mouseHelperContainer);

  const $computerModeContainer = domCreate('div', cn.computerModeContainer);
  $computerModeContainer.addEventListener('click', toggleComputerMode);
  const $computerMode = domCreate('div', cn.computerMode);
  const $computerModeCircle = domCreate('div', cn.computerModeCircle);
  $computerMode.append($computerModeCircle);
  $computerModeContainer.append($computerMode);
  const $computerModeMessage = domCreate('div', cn.computerModeMessage);
  $computerModeContainer.append($computerModeMessage);
  $boardConfig.append($computerModeContainer);

  $connect.append($boardContainer);

  startGame();
  keyEvents();

  function startGame() {
    connect4.reset();
    const pieces = document.querySelectorAll(`.${cn.row} .${cn.piece}`);
    if (pieces.length) {
      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        if (!piece.classList.contains(cn.empty)) {
          piece.style.marginTop = `${rows * 80}px`;
        }
      }
      setTimeout(() => printGame(), 300);
    } else {
      printGame();
    }
  }

  function printGame(animateLastPiece) {
    setBoard(animateLastPiece);
    let message;
    let pieceClassName;
    if (connect4.status == c4.END_GAME) {
      if (connect4.winner == c4.P1) {
        message = 'WINNER!';
        pieceClassName = cn.player1;
      } else if (connect4.winner == c4.P2) {
        message = 'WINNER!';
        pieceClassName = cn.player2;
      } else {
        message = 'DRAW';
        pieceClassName = cn.draw;
      }
      $resetButton.innerHTML = 'START';
    } else {
      message = 'Next player';
      if (connect4.player == c4.P1) {
        pieceClassName = cn.player1;
      } else if (connect4.player == c4.P2) {
        if (computerMode) {
          message = 'Computer is thinking...';
        }
        pieceClassName = cn.player2;
      }
      $resetButton.innerHTML = 'RESET';
    }
    $message.innerHTML = message;

    $displayPiece.classList.remove(cn.player1);
    $displayPiece.classList.remove(cn.player2);
    $displayPiece.classList.remove(cn.draw);
    $displayPiece.classList.add(pieceClassName);

    printMouseHelp();
    printComputerMode();
  }

  function printMouseHelp() {
    if (mouseHelp) {
      $mouseHelperCircle.classList.add(cn.active);
      $mouseHelperMessage.innerHTML = 'Mouse help: ON';
    } else {
      $mouseHelperCircle.classList.remove(cn.active);
      $mouseHelperMessage.innerHTML = 'Mouse help: OFF';
    }
  }

  function printComputerMode() {
    if (computerMode) {
      $computerModeCircle.classList.add(cn.active);
      $computerModeMessage.innerHTML = 'Player vs Computer';
    } else {
      $computerModeCircle.classList.remove(cn.active);
      $computerModeMessage.innerHTML = 'Player vs Player';
    }
  }

  function isComputerTurn() {
    return connect4.player == c4.P2 && computerMode;
  }

  function setBoard(animateLastPiece) {
    viewerBoard = []
    $board.innerHTML = '';
    $board.classList.remove('play');
    $board.classList.remove('end-game');
    $board.classList.add(connect4.status === c4.PLAY ? 'play' : 'end-game');

    const connect4Board = connect4.getBoard();
    const lastPiece = connect4.getLastPiecePosition();
    for (let row = rows - 1; row >= 0; row--) {
      viewerBoard[row] = [];
      const $row = domCreate('div', cn.row);
      for (let col = 0; col < cols; col++) {
        const item = connect4Board[row][col];
        let value = cn.empty;
        if (item == c4.P1) {
          value = cn.player1;
        } else if (item == c4.P2) {
          value = cn.player2
        }
        const $piece = domCreate('div', `${cn.piece} ${value}`);
        addPieceEvents($piece, col)
        if (animateLastPiece && lastPiece[0] === row && lastPiece[1] === col) {
          $piece.style.marginTop = `${-(rows-row) * 70}px`;
          setTimeout(() => $piece.style.marginTop = 0, 1);
        }

        if (connect4.line) {
          setLine($piece, row, col);
        }

        const $pieceContainer = domCreate('div', cn.pieceContainer);
        $pieceContainer.append($piece);
        $row.append($pieceContainer);
        viewerBoard[row][col] = $piece;
      }
      $board.append($row);
      
    }
    return $board;
  }

  function addPieceEvents($piece, col) {
    if (connect4.status === c4.PLAY && !connect4.isColumnFull(col)) {
      $piece.addEventListener('click', () => addPiece(col));
      if (mouseHelp) {
        $piece.addEventListener('mouseover', () => {
          const [player, p] = connect4.getNextPiecePosition(col);
          if (player === null || p === null) {
            return;
          }
          const className = player == c4.P1 ? cn.player1 : cn.player2;
          viewerBoard[p[0]][col].classList.add(cn.pieceNext);
          viewerBoard[p[0]][col].classList.add(className);
        });

        $piece.addEventListener('mouseleave', () => {
          const [, p] = connect4.getNextPiecePosition(col);
          if (p === null) {
            return;
          }
          viewerBoard[p[0]][col].classList.remove(cn.pieceNext);
          viewerBoard[p[0]][col].classList.remove(cn.player1);
          viewerBoard[p[0]][col].classList.remove(cn.player2);
        });
      }
    }
  }

  function keyEvents() {
    document.onkeyup = (e) => {
      if (e.key === ' ') {
        startGame();
        return;
      }
      if (e.key === 'm') {
        toggleMouse();
        return;
      }
      if (e.key === 'u') {
        undo();
        return;
      }
      if (e.key === 'c') {
        toggleComputerMode();
        return;
      }
      const intKey = parseInt(e.key);
      if (intKey && intKey > 0 && intKey <= cols) {
        const col = intKey - 1;
        addPiece(col);
      }
    }
  }

  function addPiece(idx, iamComputer) {
    try {
      connect4.addPiece(idx, iamComputer);
      printGame(true);
      if (isComputerTurn()) {
        setTimeout(() => addComputerPiece(), 500);
      }
    } catch (error) {
      if (connect4.status === c4.PLAY) {
        $message.innerHTML = error.message;
      }
    }
  }

  function addComputerPiece() {
    if (gameIsOver()) {
      return;
    }
    for (let i = 0; i < 5; i++) { // Try 5 times to find a valid move. Temporary solution
      const computerMove = connect4.getComputerMove();
      if (computerMove) {
        addPiece(computerMove, true);
        return;
      }
    }
  }

  function undo() {
    if (gameIsOver() || computerMode) {
      return;
    }
    try {
      connect4.undo();
      printGame();
    } catch (error) {
      $message.innerHTML = error.message;
    }
  }

  function gameIsOver() {
    return connect4.status === c4.END_GAME;
  }

  function setLine($piece, row, col) {
    for (const [lineRow, lineCol] of connect4.line) {
      if (lineRow === row && lineCol === col) {
        $piece.classList.add(`${cn.pieceLine}`)
      }
    }
  }

  function toggleComputerMode() {
    computerMode = !computerMode;
    connect4.playAgainstComputer(computerMode);
    printComputerMode();
    startGame();
  }

  function toggleMouse() {
    mouseHelp = !mouseHelp;
    printMouseHelp();
    printGame();
  }

  function domCreate(el, className) {
    const $el = document.createElement(el);
    $el.className = className;
    return $el;
  }

  function createSvg() {
    const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    $svg.setAttribute('width', '0');
    $svg.setAttribute('height', '0');

    let holes  = '';
    const r = 32;
    const cx = 36;
    const cy = 36;
    for (let row = 0; row < rows + 1; row++) {
      const x = (row * 2) * cx + (cx - row * 3);
      for (let col = 0; col < cols; col++) {
        const y = (col * 2) * cy + (cy - col * 3);
        holes += `<circle cx="${x}" cy="${y}" r="${r}" />`;
      }
    }
    $svg.innerHTML = `<defs><clipPath id="${shapeIdentifier}">${holes}</clipPath></defs>`;
    return $svg;
  }

}

export default Connect4View;