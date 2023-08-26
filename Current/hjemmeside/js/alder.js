const bursdag = new Date("August 28 2003 17:30");

function getSeconds(){

    let now = new Date()

    var sekunder_siden = (now.getTime()/1000) - (bursdag.getTime()/1000);
    var aar_siden = (sekunder_siden/31556952).toFixed(9)


    aar_str = aar_siden.toString();

    //result_1 = aar_str.replaceAll(7,8)
    //result_2 = result_1.replaceAll(1,2)
    //result_3 = result_2.replace(2, 1)




    document.getElementById("aar").innerHTML = aar_siden;
    //document.getElementById("sek").innerHTML = Math.round(sekunder_siden);
    

}
setInterval(getSeconds, 50)