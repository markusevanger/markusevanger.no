
const bursdag = new Date("August 28 2003 17:30");

function getSeconds(ant_siffer){

    let now = new Date()

    var sekunder_siden = (now.getTime()/1000) - (bursdag.getTime()/1000);
    var aar_siden = (sekunder_siden/31556952).toFixed(ant_siffer);
    
    aar_str = aar_siden.toString();

    return aar_siden;
    
}