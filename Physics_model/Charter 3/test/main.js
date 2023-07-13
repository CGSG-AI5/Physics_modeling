function  getRandomArbitary(min, max){
    return Math.random() * (max - min) + min;
}

function  getRandomInt(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function gaussianRandom(mean, stdev) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log(u)) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function directionVectorInSphere(){
    let phi = getRandomArbitary(-Math.PI, Math.PI);
    let y = getRandomArbitary(-1, 1)
    let r  = Math.sqrt(1  - y * y)
    return [r * Math.cos(phi), y, -r * Math.sin(phi)];
}
for (let i = 0; i < 10000; i++){
    console.log(directionVectorInSphere())
}

