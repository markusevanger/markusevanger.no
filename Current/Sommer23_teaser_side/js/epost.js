const EPOST = "markusevanger@gmail.com";
const delay = ms => new Promise(res => setTimeout(res, ms));



const kopierEpost = async () => {
    navigator.clipboard.writeText(EPOST);
    document.getElementById("Epost").innerText = "Kopiert! 📋";
    console.log("<3");

    await delay(2000);

    document.getElementById("Epost").innerText = "Epost";


 
}