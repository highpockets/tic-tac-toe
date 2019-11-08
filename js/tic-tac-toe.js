const gameboard = (() => {
    const gameboardQuads = document.getElementsByClassName("game-quad");
    const winningPatterns = winningGamePatterns();

    function updateQuad(element){

        const quadIndex = gameboardQuads.indexOf(element);
        gameplay.updatePiecePositions(quadIndex);
    }
    function winningGamePatterns(){
        const gridSizeSqrt = Math.sqrt(gameboardQuads.length);
        let columnPattern = [];
        let rowPattern = [];
        let mainDiagonalPattern = [];
        let counterDiagonalPattern = [];
        let patterns = [];

        for(i = 0; i < gridSizeSqrt; i++){

            for(j = 0; j < gridSizeSqrt; j++){

                columnPattern.push(i + (j * gridSizeSqrt));
                rowPattern.push(j + (i * gridSizeSqrt));
            }
            mainDiagonalPattern.push(rowPattern[0] + i);
            counterDiagonalPattern.push(rowPattern[rowPattern.length - 1] - i);
            patterns.push(columnPattern);
            patterns.push(rowPattern);
            columnPattern.length = 0;
            rowPattern.length = 0;
        }
        patterns.push(mainDiagonalPattern);
        patterns.push(counterDiagonalPattern);
        return patterns;
    }
    function getInfo(){
        return{size: gameboardQuads.length, winningPatterns: winningPatterns};
    }
    return{updateQuad, getInfo};
})();

const Player = (gamePiece, name = "Computer") => {

    let piecePositions = [];
    let score = 0;

    function getInfo(){
        return {name: name, score: score, piece: gamePiece, piecePositions: piecePositions};
    }
    function setPiecePosition(position){
        piecePositions.push(position);
    }
    return{getInfo, setPiecePosition};
}

const gamePlay = (() => {

    let playerOneTurn = true;
    const playerOne = Player('x'); //add name
    const playerTwo = Player('o'); //''

    function updatePiecePositions(position){

        if(playerOne.getInfo().piecePositions.indexOf(position) === -1 &&
        playerTwo.getInfo().piecePositions.indexOf(position) === -1){

            const currentPlayer;

            if(playerOneTurn){
                currentPlayer = playerOne;
            }
            else{
                currentplayer = playerTwo;
            }
            currentPlayer.setPiecePosition(position);

            if(currentPlayer.getInfo().piecePositions.length >= 3 &&
            checkForWinner(currentPlayer.getInfo().piecePositions)){
                //currentPlayer Wins
            }
        }
    }
    function checkForWinner(positions){

        for(i = 0; i < gameboard.getInfo().winningPatterns.length; i++){

            if(patternMatch(gameboard.getInfo().winningPatterns[i])){
                return true;
            }
        }
        function patternMatch(pattern){

            for(i = 0; i < pattern.length; i++){

                if(positions.indexOf(pattern[i]) === -1){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    return{updatePiecePositions};
})();

