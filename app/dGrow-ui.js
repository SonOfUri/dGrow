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


const hideClaimBtn = document.getElementById('toggleClaim');

hideClaimBtn.addEventListener("click", hideProps);

function hideProps(){
    var prop1 = document.getElementById('claimVar1');
    var prop2 = document.getElementById('claimVar2');

    prop1.classList.remove("utility-class_2");
    prop2.classList.remove("utility-class_2");

    hideClaimBtn.style.transform = "rotate(180deg)";
    hideClaimBtn.style.transition = "0.5s";

}

const stakeBtn = document.getElementById('stakeBtn');
const unstakeBtn = document.getElementById('unstakeBtn');


stakeBtn.addEventListener("click", appDisplay3);
function appDisplay3(){
    document.getElementById('unstakeBoard').classList.add("utility-class_2");
    document.getElementById('stakeBoard').classList.remove("utility-class_2");

    unstakeBtn.classList.remove("utility-class_1");
    stakeBtn.classList.add("utility-class_1");

}


unstakeBtn.addEventListener("click", appDisplay4);
function appDisplay4(){
    document.getElementById('stakeBoard').classList.add("utility-class_2");
    document.getElementById('unstakeBoard').classList.remove("utility-class_2");

    stakeBtn.classList.remove("utility-class_1");
    unstakeBtn.classList.add("utility-class_1");

}