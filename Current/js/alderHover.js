
const spanElement = document.getElementById("alder");

function changeContentOnHover() {
    spanElement.innerHTML = " 👴 (" + getSeconds(1) + " år gammel)";
}
function resetContentOnMouseOut() {
    spanElement.innerHTML = " 👶 28/08/2003";
}

spanElement.addEventListener("mouseover", changeContentOnHover);
spanElement.addEventListener("mouseout", resetContentOnMouseOut);
