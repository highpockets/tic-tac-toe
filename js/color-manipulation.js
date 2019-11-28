const ColorRGBA = (rgba) => {
    
    const Values = () => {
        let rgbaArr = [];

        if(typeof rgba === 'string' || rgba instanceof String){
            rgbaArr = rgba.replace(/[^\d,.]/g, '').split(',');
        }
        else{
            rgbaArr = rgba;

            if(rgba.length === 4){
                rgba[2] = rgba[2] + ',' + rgba[3];
            }
            rgba = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
        }
        if(rgbaArr.length === 3){
            rgbaArr.push(1.0);
        }

        return {
            r: Number(rgbaArr[0]),
            g: Number(rgbaArr[1]),
            b: Number(rgbaArr[2]),
            a: Number(rgbaArr[3])
        };
    }
    const values = Values();

    function vals(){
        
        return{
            str: rgba,
            r: values.r,
            g: values.g,
            b: values.b, 
            a: values.a
        };
    }
    return{vals};
}

const lerp = ((start, end, distance) => {
    
    let val = ((end - start) * distance) + start;

    if(Number.isInteger(start)){
        return Math.floor(val);
    }
    else{
        return val;
    }
});

const colorLerp = ((startColor, endColor, distance) => {
    
    if(distance > 1.0){
        return endColor.vals().str;
    }
    else if(distance < 0.0){
        return startColor.vals().str;
    }
    const r = lerp(startColor.vals().r, endColor.vals().r, distance);
    const g = lerp(startColor.vals().g, endColor.vals().g, distance);
    const b = lerp(startColor.vals().b, endColor.vals().b, distance);
    const a = lerp(startColor.vals().a, endColor.vals().a, distance);
    return ColorRGBA('rgba('+r+','+g+','+b+','+a+')').vals().str;
});