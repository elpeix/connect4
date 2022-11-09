import Connect4, { c4 } from './Connect4.js';

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
    mouseHelper: `${prefix}-mouse-helper`,
    mouseHelperCircle: `${prefix}-mouse-helper-circle`,
  }
  let mouseHelp = false;
  let viewerBoard;

  const connect4 = new Connect4(rows, cols);

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

  const $mouseHelper = domCreate('div', cn.mouseHelper);
  $mouseHelper.addEventListener('click', toggleMouse);
  const $mouseHelperCircle = domCreate('div', cn.mouseHelperCircle);
  $mouseHelper.append($mouseHelperCircle);
  $boardContainer.append($mouseHelper);

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
        pieceClassName = cn.player2;
      }
      $resetButton.innerHTML = 'RESET';
    }
    $message.innerHTML = message;

    $displayPiece.classList.remove(cn.player1);
    $displayPiece.classList.remove(cn.player2);
    $displayPiece.classList.remove(cn.draw);
    $displayPiece.classList.add(pieceClassName);

    if (mouseHelp) {
      $mouseHelperCircle.classList.add('connect4-mouse-helper-circle-active');
    } else {
      $mouseHelperCircle.classList.remove('connect4-mouse-helper-circle-active');
    }
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
          const className = player == c4.P1 ? cn.player1 : cn.player2;
          viewerBoard[p[0]][col].classList.add(cn.pieceNext);
          viewerBoard[p[0]][col].classList.add(className);
        });

        $piece.addEventListener('mouseleave', () => {
          const [, p] = connect4.getNextPiecePosition(col);
          viewerBoard[p[0]][col].classList.remove(cn.pieceNext);
          viewerBoard[p[0]][col].classList.remove(cn.player1);
          viewerBoard[p[0]][col].classList.remove(cn.player2);
        });
      }
    }
  }

  function keyEvents() {
    document.onkeyup = (e) => {
      if (e.key === 'r') {
        startGame();
        return;
      }
      if (e.key === 'h') {
        toggleMouse();
        return;
      }
      const intKey = parseInt(e.key);
      if (intKey && intKey > 0 && intKey <= cols) {
        const col = intKey - 1;
        addPiece(col);
      }
    }
  }

  function addPiece(idx) {
    try {
      connect4.addPiece(idx);
      printGame(true);
    } catch (error) {
      if (connect4.status === c4.PLAY) {
        $message.innerHTML = error.message;
      }
    }
  }

  function setLine($piece, row, col) {
    for (const [lineRow, lineCol] of connect4.line) {
      if (lineRow === row && lineCol === col) {
        $piece.classList.add(`${cn.pieceLine}`)
      }
    }
  }

  function toggleMouse() {
    mouseHelp = !mouseHelp;
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