const gameboardColorEffects = (() => {

    const gameScoreBG = document.getElementById('score-grid-container');
    const gameboardBG = document.getElementById('game-grid-container');
    const title = document.getElementById('title');
    const risingNums = document.getElementsByClassName('rising-nums');
    const fallingNums = document.getElementsByClassName('falling-nums');
    const babyBlue = ColorRGBA('rgb(104, 200, 255, 0.99)');
    const transBabyBlue = ColorRGBA('rgb(104, 150, 255, 0.1)');
    const fadeTime = 5.0;
    const fadeInterval = 33;
    const deltaInterval = fadeInterval * 0.001 / fadeTime;
    let addYPos = true;
    let yPos = 0;
    let deltaTime = 0.0;
    let deg = 0;
    let fadeReverse = false;

    for(let i = 0; i < risingNums.length; i++){
        risingNums[i].style.fontSize = '25px';
        fallingNums[i].style.fontSize = '15px';
    }

    function gameScoreBGColors(innerColor, outerColor){
        deg += 0.2;

        if(deg === 360){
            deg = 0;
        }
        title.style.background = `-webkit-linear-gradient(${deg}deg, ${outerColor}, ${innerColor})`;
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        gameboardBG.style.backgroundImage = `linear-gradient(${outerColor}, ${innerColor}, ${outerColor})`;
        gameScoreBG.style.backgroundImage = `linear-gradient(${outerColor}, ${innerColor}, ${outerColor})`;
        
        for(let i = 0; i < risingNums.length; i++){
            risingNums[i].style.background = `-webkit-linear-gradient(${deg}deg, ${outerColor}, ${innerColor})`;
            risingNums[i].style.webkitBackgroundClip = 'text';
            risingNums[i].style.webkitTextFillColor = 'transparent';
            fallingNums[i].style.background = `-webkit-linear-gradient(${deg}deg, ${outerColor}, ${innerColor})`;
            fallingNums[i].style.webkitBackgroundClip = 'text';
            fallingNums[i].style.webkitTextFillColor = 'transparent';
            risingNums[i].style.backgroundImage = `linear-gradient(${outerColor}, ${innerColor}, ${outerColor})`;
            fallingNums[i].style.backgroundImage = `linear-gradient(${outerColor}, ${innerColor}, ${outerColor})`;
        }
    }
    function colorFade(){

        if(!fadeReverse){
            deltaTime += deltaInterval;
        }
        else{
            deltaTime -= deltaInterval;
        }
        if(deltaTime > 1 && !fadeReverse){
            fadeReverse = true;
            deltaTime = 1.0;
        }
        else if(deltaTime < 0 && fadeReverse){
            fadeReverse = false;
            deltaTime = 0.0;
        }
        gameScoreBGColors(colorLerp(babyBlue, transBabyBlue, deltaTime), colorLerp(transBabyBlue, babyBlue, deltaTime));
    }
    function translateBGText(){
        if(yPos > 1500){
            addYPos = false;
        }
        else if( yPos < 0){
            addYPos = true;
        }
        if(addYPos){
            yPos += 15;
        }
        else{
            yPos -= 15;
        }
        xPos = 0;

        for(let i = 0; i < risingNums.length; i++){
            risingNums[i].style.transform = `translate(${xPos}px, ${yPos - 1600}px)`;
            xPos += window.innerWidth/10;
            fallingNums[i].style.transform = `translate(${xPos}px, ${-yPos -200}px)`;
            xPos += window.innerWidth/10;
        }
    }
    function updateEnvironment(){
        colorFade();
        translateBGText();
    }
    function interval(){
        return fadeInterval;
    }
    return{updateEnvironment, interval};
})();



setInterval(gameboardColorEffects.updateEnvironment, 33);//gameboardColorEffects.interval());
