
var checkerboard = [[null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null]];



var redChecker;
var blackChecker;
var middleRow;
var middleCol;
var countR = 12;
var countB = 12;
var piece = 0;
var redScoreCount = 0;
var blackScoreCount = 0;
var whoseTurn = 0;
var jumped = false;
var activePieceCoords = { row: -1, col: -1 };


function initializeBoard(){
  for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            if (row < 3){
                setSquare(row, col, "R");
            } else if (row > 4){
                setSquare(row, col, "B");
            } else {
                setSquare(row, col, null);

            }
        }
    }
}

function drawBoard(){
    for (var row = 0; row < checkerboard.length; row++){
        for (var col = 0; col < checkerboard[row].length; col++){
            var squareColor;
            if (isValidSquare(row, col)){
                squareColor = "black";
            } else {
                squareColor = "red";
            }
            $("#checkerboard").append("<div class = " + squareColor + " data-col='" + col + "' data-row='" + row + "' class='square' id=" + row + '_' + col + "></div>");
        }
    }
}


function resetCounter(){
    countR = 12;
    countB = 12;
}



function scoreCount() {
    if (redWin(countR)){
        $("#redScore").html(redScoreCount);
    } else if (blackWin(countB)){
        $("#blackScore").html(blackScoreCount);
    }
}


function redWin(){
    redScoreCount++;
    $("#red_wins").replaceWith(" wins!");
    return redScoreCount;
}

function blackWin(){
    $("#black_wins").replaceWith(" wins!");
    blackScoreCount++;
    return blackScoreCount;
}


function isGameOver() {
   return (redWin() || blackWin());
}

function relocatePiece(firstRow, firstCol, endingRow, endingCol, piece) {
  piece = checkForPromotion(endingRow, endingCol, piece);
  setSquare(endingRow, endingCol, piece);
  setSquare(firstRow, firstCol, null);
  activePieceCoords = { row: firstRow, col: firstCol };

  return piece;
}

function setActivePieceCoords(row, col) {
  activePieceCoords['row'] = row;
  activePieceCoords['col'] = col;
}

function move(firstRow, firstCol, endingRow, endingCol, piece){
    if (isValidMove(firstRow, firstCol, endingRow, endingCol) || isValidJump(firstRow, firstCol, endingRow, endingCol, piece)){
        if (isJump(endingRow, firstRow)){
          piece = relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            if (checkerboard[middleRow][middleCol] === "R" || checkerboard[middleRow][middleCol] === "rK"){
                countR--;
                $("#end_turn").removeClass("hidden").css("background", "black").css("color", "white").css("margin-right", "400px").css("margin-left", "-540px").css("float", "right");
            } else if (checkerboard[middleRow][middleCol] === "B" || checkerboard[middleRow][middleCol] === "bK"){
                countB--;
                $("#end_turn").removeClass("hidden").css("background", "red").css("color", "black").css("margin-left", "400px").css("margin-right", "-540px");
            }
            setSquare(middleRow, middleCol, null);
            jumped = true;
            setActivePieceCoords(endingRow, endingCol);
        } else if (!jumped) {
            relocatePiece(firstRow, firstCol, endingRow, endingCol, piece);
            setActivePieceCoords(-1, -1);
            switchTurn();
        }

        if (countR === 0){
            blackWin();
            $("#blackScore > .score").html(blackScoreCount);
            resetGame();
        } else if (countB === 0){
            redWin();
            $("#redScore > .score").html(redScoreCount);
             resetGame();
        }

    }
    return true;
}

function resetGame(){
    setTimeout(function(){
        initializeBoard();
        resetCounter();
        whoseTurn = 0;
    }, 2000);
}


function isJump(endingRow, firstRow){
    return (Math.abs(endingRow - firstRow) === 2);
}

function checkForPromotion(endingRow, endingCol, piece){
    if (endingRow === 7 && isRed(piece)){
        piece = "rK";
   } else if (endingRow === 0 && isBlack(piece)){
        piece = "bK";
   } return piece;
}


function isPieceTurn(){
    return ((isRed(piece) && whoseTurn === 0) || (isBlack(piece) && whoseTurn === 1));
}

function isRed(piece){
    return (piece === "R" || piece === "rK");
}

function isBlack(piece){
    return (piece === "B" || piece === "bK");
}

function isKing(piece){
    return (piece ==="rK" || piece === "bK");
}

function findMiddleRow(firstRow, endingRow){
    if (firstRow + 1 === endingRow - 1) {
        middleRow = firstRow + 1;
    } else if (firstRow - 1 === endingRow + 1){
        middleRow = firstRow - 1;
    } else {
        return false;
    }
    return middleRow;
}

function findMiddleCol(firstCol, endingCol){
    if (firstCol + 1 === endingCol - 1){
        middleCol = firstCol + 1;
    } else if (firstCol - 1 === endingCol + 1){
        middleCol = firstCol - 1;
    } else {
        return false;
    }
    return middleCol;
}

function isValidJump(firstRow, firstCol, endingRow, endingCol, piece){
    return (isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol) && isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol) && isValidSquare(endingRow, endingCol) && isTwoRows(firstRow, endingRow, piece));
}


function isJumpToSquareOpen(firstRow, firstCol, endingRow, endingCol){
    return (checkerboard[endingRow][endingCol] === null);
}

function isOpponentOnJumpOverSquare(piece, firstRow, firstCol, endingRow, endingCol){
    findMiddleRow(firstRow, endingRow);
    findMiddleCol(firstCol, endingCol);
    return isNextRow(firstRow, middleRow, piece) && isOpponent(piece, middleRow, middleCol)
}


function isOpponent(piece, row, col){
    if (checkerboard[row][col] === null) {
        return false;
    } else if ((piece === "R" || piece === "rK") && (checkerboard[row][col] === "B" || checkerboard[row][col]===
        "bK")) {
        return true;
    } else if ((piece === "B" || piece === "bK") && (checkerboard[row][col] === "R" || checkerboard[row][col] === "rK")){
        return true;
    } else {
        return false;
        }
    }


function isValidSquare(row, col){
    return isEven(row) && isEven(col) || !isEven(row) && !isEven(col);
}

function setSquare(row, col, piece) {
    if (isValidSquare(row, col)){
        var color = setColor(piece);
        var rank = setRank(piece);
        if (piece !== null){
        $("#" + row + '_' + col).html('<img src="images/'+color+rank+'.jpg" style="width: 60px" class="'+color+rank+'"/>').children().css("margin", "5px");
        checkerboard[row][col] = piece;
        } else {
            checkerboard[row][col] = null;
            $("#" + row + '_' + col).html(null);
        }
        return piece;
    }
}

function setColor(piece){
    if (isRed(piece)){
        return "red";
    } else if (isBlack(piece)){
        return "black";
    } else {
        return null;
    }
}

function setRank(piece){
    if (piece === "rK" || piece === "bK"){
        return "King";
    } else if (piece === "R" || piece === "B"){
        return "Checker";
    } else {
        return null;
    }
}


function isEven(x){
    return x % 2 === 0;
}


function getPieceAt(row, col){
   return checkerboard[row][col];
}

function isValidMove(firstRow, firstCol, endingRow, endingCol){
    piece = checkerboard[firstRow][firstCol];
    if (!(isValidSquare(firstRow, firstCol) && isValidSquare(endingRow, endingCol))){
        return false;
    } else if (isNextRow(firstRow, endingRow, piece) && isAdjacentSpace(firstRow, firstCol, endingRow, endingCol)){
        return true;
    } else {
        return false;
    }
}

function isAdjacentSpace(firstRow, firstCol, endingRow, endingCol){
    return Math.abs(endingCol - firstCol) === 1;
}

function isTwoColumns(firstCol, endingCol){
    return Math.abs(endingCol - firstCol) === 2;
}

function isNextRow(firstRow, endingRow, piece){
    if (!isKing(piece)){
        if (isRed(piece)){
            return endingRow === firstRow + 1;
        } else {
            return endingRow === firstRow - 1;
        }
    } else if(isKing(piece)){
        return Math.abs(endingRow - firstRow) === 1;
    } else {
        return false;
    }
}


function isTwoRows(firstRow, endingRow, piece){
    if (!isKing(piece)){
        if(isRed(piece)){
            return endingRow === firstRow + 2;
        } else {
            return endingRow === firstRow - 2;
        }
    } else if(isKing(piece)){
        return Math.abs(endingRow - firstRow) === 2;
    }
}

function switchTurn() {
  if (whoseTurn === 1) {
    whoseTurn = 0;
  } else {
    whoseTurn = 1;
  }
  jumped = false;
}

function selectPiece(elt, piece) {
  $(elt).addClass("selected");
  $(elt).siblings().removeClass("selected");

  return piece
}

function isActivePiece(pieceRow, pieceCol) {
  if (jumped) {
    return pieceRow === activePieceCoords['row'] && pieceCol === activePieceCoords['col'];
  } else {
    return true;
  }
}

$(document).ready(function() {
    drawBoard();
    initializeBoard();
    $("#checkerboard div").on("click", function(event){
        var pieceRow = $(".selected").data("row");
        var pieceCol = $(".selected").data("col");

        if ($(this).find(".blackKing").length !==0 && whoseTurn == 1){
            piece = selectPiece(this, "bK");
        } else if ($(this).find(".redKing").length !==0 && whoseTurn == 0){
            piece = selectPiece(this, "rK");
        } else if ($(this).find(".redChecker").length !==0 && whoseTurn == 0){
            piece = selectPiece(this, "R")
        } else if ($(this).find(".blackChecker").length !==0 && whoseTurn == 1){
            piece = selectPiece(this, "B")
        }

        var endingPieceRow = $(this).data("row");
        var endingPieceCol = $(this).data("col");
        if (checkerboard[endingPieceRow][endingPieceCol] === null && isPieceTurn() && isActivePiece(pieceRow, pieceCol)){
          move(pieceRow, pieceCol, endingPieceRow, endingPieceCol, piece);
        }
    });
     $("#end_turn").on("click", function(){
        ($(this).addClass("hidden"))
        switchTurn();
    });
});


