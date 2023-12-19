

const aarSpan = document.getElementById("aar");
function setAlder(){
     aarSpan.innerHTML = (getSeconds(9));
}
setInterval(setAlder, 50);