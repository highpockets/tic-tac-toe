const gameboard = (() => {

    const gameboardQuads = [].slice.call(document.getElementsByClassName("game-quad"));
    let availableQuads = [];
    const winningPatterns = winningGamePatterns();
    
    resetGameboard(true);

    function updateQuad(element){

        if(gamePlay.gameStatus().turn === 1 || localStorage.gameType !== 'single'){
            const quadIndex = gameboardQuads.indexOf(element);

            if(availableQuads.indexOf(quadIndex) !== -1){
                gamePlay.updatePiecePositions(quadIndex);
            }
        }
    }
    function winningGamePatterns(){

        const gridSizeSqrt = Math.sqrt(gameboardQuads.length);
        let mainDiagonalPattern = [];
        let counterDiagonalPattern = [];
        let patterns = [];

        for(let i = 0; i < gridSizeSqrt; i++){

            let columnPattern = [];
            let rowPattern = [];

            for(let j = 0; j < gridSizeSqrt; j++){

                columnPattern.push(i + (j * gridSizeSqrt));
                rowPattern.push(j + (i * gridSizeSqrt));
            }
            mainDiagonalPattern.push(rowPattern[0] + i);
            counterDiagonalPattern.push(rowPattern[rowPattern.length - 1] - i);
            patterns.push(columnPattern);
            patterns.push(rowPattern);
        }
        patterns.push(mainDiagonalPattern);
        patterns.push(counterDiagonalPattern);
        return patterns;
    }
    function populateQuad(position, piece){

        if(piece === 'x'){
            gameboardQuads[position].innerHTML = 'X';
        }
        else{
            console.log(gameboardQuads);
            console.log(gameboardQuads[position]);
            console.log(position);
            gameboardQuads[position].innerHTML = 'O';
        }
    }
    function shineWinner(positions){
        let fromCol = ColorRGBA('rgb(82, 111, 128, 1)');
        let toCol = ColorRGBA('rgb(255, 255, 255, 1)');
        let t = 0;
        let count = 0;

        const shineInterval = setInterval(function () {
            t += 0.1;
            let col = colorLerp(fromCol, toCol, t);

            for(let i = 0; i < positions.length; i++){
                gameboardQuads[positions[i]].style.color = col;
            }
            if(t >= 1){
                count += 1;
                t = 0;

                if(count === 3){
                    for(let i = 0; i < positions.length; i++){
                        gameboardQuads[positions[i]].style.color = fromCol.vals().str;
                    }
                    clearInterval(shineInterval);
                    setTimeout( function(){
                        resetGameboard();
                    }, 500);
                }
            }
        }, 33);
    }
    function setAvailableQuads(position){
        availableQuads.splice(availableQuads.indexOf(position), 1);
    }
    function resetGameboard(start = false){
        for(let i = 0; i < gameboardQuads.length; i++){
            availableQuads[i] = i;
            gameboardQuads[i].innerHTML = '';
        }
        if(!start){
            gamePlay.resetting(false);
        }
    }
    function getInfo(){
        return{availableQuads: availableQuads, size: gameboardQuads.length, winningPatterns: winningPatterns};
    }
    return{updateQuad, shineWinner, getInfo, resetGameboard, setAvailableQuads, populateQuad};
})();

const Player = (gamePiece, scoreboardElement, name = "Computer") => {

    let piecePositions = [];
    let score = 0;
    let isAuto = false;

    function getInfo(){
        return {name: name, score: score, auto: isAuto, piece: gamePiece, piecePositions: piecePositions};
    }
    function setToAuto(isComputer){
        isAuto = isComputer;
    }
    function incrimentScore(){
        score += 1;
        scoreboardElement.innerHTML = score;
    }
    function setPiecePosition(position){
        piecePositions.push(position);
        gameboard.setAvailableQuads(position);
    }
    function clearPiecePositions(){
        piecePositions.length = 0;
    }
    return{getInfo, setPiecePosition, setToAuto, incrimentScore, clearPiecePositions};
}

if(localStorage.playerOneName === undefined){
    console.log('here');
    localStorage.playerOneName = 'Player 1';
}
if(localStorage.gameType === undefined){
    localStorage.gameType = 'single';
}
if(localStorage.playerTwoName === undefined){
    
    if(localStorage.gameType = 'single'){
        localStorage.playerTwoName = 'Computer';
    }
    else{
        localStorage.playerTwoName = 'Player 2';
    }
}
if(localStorage.difficulty === undefined){
    localStorage.difficulty = 'normal'; //development value only, need to change to 'normal'
}


const gamePlay = (() => {

    let playerTurn = 1;
    let ties = 0;
    const playerOne = Player('x', document.getElementById('player1-score'), localStorage.playerOneName);
    const playerTwo = Player('o', document.getElementById('player2-score'), localStorage.playerTwoName);
    document.getElementById('player1-name').innerHTML = playerOne.getInfo().name;
    document.getElementById('player2-name').innerHTML = playerTwo.getInfo().name;
    const winnerDisplay = document.getElementById('winner-display');

    if(localStorage.gameType === 'single'){
        playerTwo.setToAuto(true);
    }
    function incrimentTies(){
        ties += 1;
        document.getElementById('tie-game-count').innerHTML = ties;
    }
    function updatePiecePositions(position){
            
        let currentPlayer;

        if(playerTurn === 1){
            currentPlayer = playerOne;
        }
        else{
            currentPlayer = playerTwo;
        }
        
        currentPlayer.setPiecePosition(position);
        gameboard.populateQuad(position, currentPlayer.getInfo().piece);
        updateGameStatus(currentPlayer);
    }
    function resetting(reset = true){
        if(!reset && playerTurn === 2 && playerTwo.getInfo().auto){
            automate();
        }
    }
    function showResult(resetBoard = false){
        let t = 0;

        const result = setInterval(function(){
            t += 0.03;
            winnerDisplay.style.fontSize = `${80*t}px`;

            if(t >= 1){
                clearInterval(result);
                winnerDisplay.style.fontSize = `0px`;

                if(resetBoard){
                    setTimeout(gameboard.resetGameboard, 500);
                }
            }
        }, 33);
    }
    function updateGameStatus(currentPlayer){
        
        if(currentPlayer.getInfo().piecePositions.length >= Math.sqrt(gameboard.getInfo().size) &&
        checkForWinner(currentPlayer.getInfo().piecePositions, 'yes')){
            currentPlayer.incrimentScore();
            clearAndReset();
            resetting();
            winnerDisplay.innerHTML = `${currentPlayer.getInfo().name} Wins!!`;
            showResult();
        }
        else if(gameboard.getInfo().availableQuads.length === 0){
            incrimentTies();
            clearAndReset();
            resetting();
            winnerDisplay.innerHTML = "It's a Tie!!";
            showResult(true);

            if(currentPlayer === playerTwo){
                playerTurn = 1;
            }
            else{
                playerTurn = 2;
            }
        }
        else if(playerTurn === 1){
            playerTurn = 2;
            
            if(playerTwo.getInfo().auto){
                automate();
            }
        }
        else{
            playerTurn = 1;
        }
    }
    function automate(){

        const pos = autoPlay();
        setTimeout(function(){
            updatePiecePositions(pos);
        }, 1000);
    }
    function clearAndReset(){
        playerOne.clearPiecePositions();
        playerTwo.clearPiecePositions();
    }
    function checkForWinner(positions, winner = 'no'){

        for(let i = 0; i < gameboard.getInfo().winningPatterns.length; i++){

            if(patternMatch(gameboard.getInfo().winningPatterns[i])){
                return true;
            }
        }
        function patternMatch(pattern){

            for(let i = 0; i < pattern.length; i++){

                if(positions.indexOf(pattern[i]) === -1){
                    return false;
                }
            }
            if(winner !== 'no'){
                gameboard.shineWinner(pattern);
            }
            return true;
        }
        return false;
    }
    function autoPlay(){
        
        let movesObj = generateMoves(playerTwo,playerOne);

        if(movesObj.tyingMoves === null && localStorage.difficulty === 'impossible'){
            return movesObj.winningMoves;
        }
        else if(localStorage.difficulty === "normal"){
            
            if(Math.floor(Math.random() * 2) !== 0){

                return makeBestMove();
            }
            return gameboard.getInfo().availableQuads[ Math.floor( Math.random() * gameboard.getInfo().availableQuads.length )];
        }
        else if(localStorage.difficulty === "difficult"){
            
            if(Math.floor(Math.random() * 4) !== 0){

                return makeBestMove();
            }
            return gameboard.getInfo().availableQuads[ Math.floor( Math.random() * gameboard.getInfo().availableQuads.length )];
        }
        else{
            return makeBestMove();
        }
        function makeBestMove(){

            if(movesObj.tyingMoves === null){
                return movesObj.winningMoves;
            }
            if(movesObj.winningMoves.length > 0){
                return movesObj.winningMoves[Math.floor( Math.random() * movesObj.winningMoves.length )];
            }
            else if(movesObj.tyingMoves.length > 0){
                return movesObj.tyingMoves[Math.floor( Math.random() * movesObj.tyingMoves.length )];
            }
            return gameboard.getInfo().availableQuads[ Math.floor( Math.random() * movesObj.winningMoves.length )];
        }
        function generateMoves(maxPlayer, minPlayer){

            let nodeTree = [];
            let endPointRatings = []; //red = possible loss, no good. > yellow = safe but likely no win. > green = possible win

            if(maxPlayer.getInfo().piecePositions.length === 0){
                if(gameboard.getInfo().availableQuads.indexOf(4) !== -1 && gameboard.getInfo().availableQuads.length === 8){
                    return {winningMoves: 4, tyingMoves: null};
                }
                else{
                    return {winningMoves: 8, tyingMoves: null};
                }
            }
            //check for immediate win
            for(let i = 0; i < gameboard.getInfo().availableQuads.length; i++){
                let positions = checkForMustPlays(maxPlayer, i);
                
                if(checkForWinner(positions)){
                    return {winningMoves: gameboard.getInfo().availableQuads[i], tyingMoves: null};
                }
            }
            for(let i = 0; i < gameboard.getInfo().availableQuads.length; i++){

                positions = checkForMustPlays(minPlayer, i);

                if(checkForWinner(positions)){
                    return {winningMoves: gameboard.getInfo().availableQuads[i], tyingMoves: null};
                }
            }
            if(maxPlayer.getInfo().piecePositions.length === 1){
                if(maxPlayer.getInfo().piecePositions[0] === 4){
                    if(gameboard.getInfo().availableQuads.indexOf(1) !== -1){
                        return {winningMoves: 1, tyingMoves: null};
                    }
                    else{
                        return {winningMoves: 3, tyingMoves: null};
                    }
                }
                if(maxPlayer.getInfo().piecePositions[0] === 8){
                    if(gameboard.getInfo().availableQuads.indexOf(0) !== -1){
                        return {winningMoves: 0, tyingMoves: null};
                    }
                }
            }
            let nodesWithChildren = [];
            generateNodes(gameboard.getInfo().availableQuads, null, 'max');

            while(nodesWithChildren.length > 0){
                let node = nodesWithChildren[0];

                if(node !== null){
                    if(node.player === 'max'){
                        generateNodes(node.children, node, 'min'); 
                    }
                    else{
                        generateNodes(node.children, node, 'max');
                    }
                    nodesWithChildren.splice(0,1);
                }
            }
            return cleanNodesAndReturnMoves();

            function checkForMustPlays(player, index){

                let tempPositions = JSON.parse(JSON.stringify(player.getInfo().piecePositions));
                let quads = JSON.parse(JSON.stringify(gameboard.getInfo().availableQuads));
                tempPositions.push(quads[index]);
                return tempPositions;
            }
            function generateNodes(quads, parent, player){

                for(let i = 0; i < quads.length; i++){
                
                    let remainingQuads = JSON.parse(JSON.stringify(quads));
                    let isEndPoint = false;
                    nodeTree.push({position: remainingQuads[i], parent: parent, player: player});

                    if(parent !== null){
                        isEndPoint = endPointCheck(nodeTree[nodeTree.length - 1]);
                    }
                    if(!isEndPoint){
                        remainingQuads.splice(i, 1);
                        nodeTree[nodeTree.length - 1].children = remainingQuads;
                        nodesWithChildren.push(nodeTree[nodeTree.length - 1]);
                    }
                }
            }
            function endPointCheck(node){

                let tempNode = node;
                let simPositions = [];
                let quadsLeft = gameboard.getInfo().availableQuads.length;

                if(tempNode.player === 'max'){
                    simPositions = JSON.parse(JSON.stringify(maxPlayer.getInfo().piecePositions));
                }
                else{
                    simPositions = JSON.parse(JSON.stringify(minPlayer.getInfo().piecePositions));
                }

                while(tempNode !== null && tempNode !== undefined){

                    simPositions.push(tempNode.position);
                    
                    if(tempNode.parent === null){
                        tempNode = tempNode.parent;
                        quadsLeft -= 1;
                    }
                    else{
                        tempNode = tempNode.parent.parent;
                        quadsLeft -= 2;
                    }
                }

                if(checkForWinner(simPositions)){
                    if(node.player === 'max'){
                        endPointRatings.push({endPoint: node, rating: 'green'});
                        return true;
                    }
                    else{
                        endPointRatings.push({endPoint: node, rating: 'red'});
                        return true;
                    }
                }
                else if(quadsLeft < 1){
                    endPointRatings.push({endPoint: node, rating: 'yellow'});
                    return true;
                }
                return false;
            }
            function cleanNodesAndReturnMoves(){

                let winningNodes = [];
                let losingNodes = [];
                let tieNodes = [];

                for(let i = 0; i < endPointRatings.length; i++){
                    
                    if(endPointRatings[i].rating === 'red'){
                        losingNodes.push(endPointRatings[i].endPoint);
                    }
                    else if(endPointRatings[i].rating === 'green'){
                        winningNodes.push(endPointRatings[i].endPoint);
                    }
                    else{
                        tieNodes.push(endPointRatings[i].endPoint);
                    }
                }
                let endPointObj = cleanEndPoints(losingNodes, winningNodes, tieNodes);
                winningNodes = endPointObj.endPointsTwo;
                tieNodes = endPointObj.endPointsThree;

                endPointObj = cleanEndPoints(winningNodes, losingNodes, tieNodes);
                losingNodes = endPointObj.endPointsTwo;
                tieNodes = endPointObj.endPointsThree;

                winningNodes = probeForFalsePositives(winningNodes);
                tieNodes = probeForFalsePositives(tieNodes);
                
                let winningMoves = getPositiveMoves(winningNodes);
                let tyingMoves = getPositiveMoves(tieNodes);

                return{winningMoves: winningMoves, tyingMoves: tyingMoves};

                function cleanEndPoints(endPointsOne, endPointsTwo, endPointsThree){
                    
                    for(let i = 0; i < endPointsOne.length; i++){
                        let node = endPointsOne[i].parent;
                        
                        if(endPointsTwo.length > 0){
                            endPointsTwo = eliminateFalseEndPoints(node, endPointsTwo);
                        }
                        if(endPointsThree.length > 0){
                            endPointsThree = eliminateFalseEndPoints(node, endPointsThree);
                        }
                    }
                    return{endPointsTwo: endPointsTwo, endPointsThree: endPointsThree};
                }
                function eliminateFalseEndPoints(node, endPoints){
                    
                    for(let j = 0; j < endPoints.length; j++){

                        let parent = endPoints[j].parent;

                        while(parent !== null){
                            
                            if(parent === node){
                                endPoints.splice(j,1);
                            }
                            parent = parent.parent;
                        }
                    }
                    return endPoints;
                }
                function probeForFalsePositives(positiveEndPoints){
                    
                    for(let i = 0; i < positiveEndPoints.length; i++){
                        
                        let node = positiveEndPoints[i].parent.parent;

                        while(node !== null){

                            for(let j = 0; j < losingNodes.length; j++){

                                let parent = losingNodes[j].parent;

                                while(parent !== null){

                                    if(parent === node){
                                        positiveEndPoints.splice(i,1);
                                    }
                                    parent = parent.parent;
                                }
                            }
                            if(node.parent === null){
                                node = node.parent;
                            }
                            else{
                                node = node.parent.parent;
                            }
                        }
                    }
                    return positiveEndPoints;
                }
                function getPositiveMoves(endPoints){
                    
                    let moves = [];

                    for(let i = 0; i < endPoints.length; i++){
                        let parent = endPoints[i].parent;

                        while(parent !== null){
                            
                            if(parent.parent === null){
                                moves.push(parent.position);
                            }
                            parent = parent.parent;
                        }
                    }
                    return moves;
                }
            }
        }
    }
    function gameStatus(){
        return{turn: playerTurn, playerOne: playerOne};
    }
    return{updatePiecePositions, resetting, automate, gameStatus};
})();

