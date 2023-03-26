const settingsBtn = document.getElementById('switch');
const navSwap = document.getElementById('navSwap');
const navStake = document.getElementById('navStake');


settingsBtn.addEventListener("click", showSettings);

function showSettings(){
    var sp1 = document.getElementById('speed');
    var sp2 = document.getElementById('slippage');

    sp1.classList.toggle("utility-class_2");
    sp2.classList.toggle("utility-class_2");
    settingsBtn.classList.toggle("utility-class_3");
}

navStake.addEventListener("click", appDisplay);
function appDisplay(){
    document.getElementById('stakeApp').classList.remove("utility-class_2");
    document.getElementById('swapApp').classList.add("utility-class_2");

    navSwap.classList.remove("utility-class_1");
    navStake.classList.add("utility-class_1");

}

navSwap.addEventListener("click", appDisplay2);
function appDisplay2(){
    document.getElementById('stakeApp').classList.add("utility-class_2")
    document.getElementById('swapApp').classList.remove("utility-class_2")

    navStake.classList.remove("utility-class_1");
    navSwap.classList.add("utility-class_1");
}