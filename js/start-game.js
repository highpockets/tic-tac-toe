const startForm = (() => {
    const gameType = document.getElementById("gameType");
    const playerOneName = document.getElementById("playerOneName");
    const playerTwoName = document.getElementById("playerTwoName");
    const difficulty = document.getElementById("difficulty");
    const bgColor = playerOneName.style.backgroundColor;
    const textColor = playerOneName.style.color;
    gameType.addEventListener("change", updateGameType);
    gameType.selectedIndex = 0;

    if(localStorage.playerOneName !== null && localStorage.playerOneName !== undefined && localStorage.playerOneName !== ''){
        playerOneName.value = localStorage.playerOneName;
    }
    updateInputs(0);

    function updateInputs(mode){
    
        if(mode === 0){
            disableInput(playerOneName);
        }
        else{
            enableInput(playerOneName);

            if(mode === 1){
                enableInput(difficulty);
            }
            else{
                enableInput(playerTwoName);
            }
        }
        if(mode !== 2){
            disableInput(playerTwoName);
        }
        if(mode !== 1){
            disableInput(difficulty);
        }
        function disableInput(input){
            if(input !== difficulty){
                input.innerHTML = '';
            }
            else{
                input.selectedIndex = 0;
            }
            input.disabled = true;
            input.style.backgroundColor = 'rgb(60,60,60)';
            input.style.color = 'rgb(40,40,40)';
        }
        function enableInput(input){
            input.disabled = false;
            input.style.backgroundColor = bgColor;
            input.style.color = textColor;
        }
    }
    function updateGameType(e){
        const val = e.target.value;

        if(val === 'single'){
            updateInputs(1);
        }
        else if(val === 'two'){
            updateInputs(2);
        }
        else{
            updateInputs(0);
        }
    }
    function validateGameInfo(){
        
        if(gameType.value === ""){
            gameType.focus();
            return false;
        }
        localStorage.gameType = gameType.value;
        
        if(playerOneName.value === "" || playerOneName.value === null){
            localStorage.playerOneName = 'Player 1';
        }
        else{
            localStorage.playerOneName = playerOneName.value;
        }
        if(!playerTwoName.disabled){
            if(playerTwoName.value === '' || playerTwoName.value === null ){
                localStorage.playerTwoName = 'Player 2';
            }
            else{
                localStorage.playerTwoName = playerTwoName.value;
            }
        }
        else if(playerTwoName.disabled){
            localStorage.playerTwoName = 'Computer';
        }
        localStorage.difficulty = difficulty.value;
        return( true );
    }
    return{validateGameInfo};
})();