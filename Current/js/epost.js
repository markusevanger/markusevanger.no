const EPOST = "markusevanger@gmail.com";
const delay = ms => new Promise(res => setTimeout(res, ms));



const kopierEpost = async (midTekst) => {
    navigator.clipboard.writeText(EPOST);
    tidligereText = document.getElementById("Epost").innerText
    document.getElementById("Epost").innerText = midTekst// "";
    console.log("<3");

    await delay(2000);

    document.getElementById("Epost").innerText = tidligereText;


 
}