/*
Übung 10 Web Engineering

Gruppe:
Lilian Alice Drabinski
Jonas Dreßler
*/


{
    "use strict";

    let names = document.getElementsByName("player");
    let stiche = document.getElementsByName("s-player");
    let actualStiche = document.getElementsByName("fs-player");
    let zwischenstaende = document.getElementsByClassName("zwischenstand-player");

    function showSuccessMessage(text, duration) {
        let successNachricht = document.getElementById("success-nachricht");
        let failureNachricht = document.getElementById("failure-nachricht");

        successNachricht.setAttribute('style','visibility:visible');
        failureNachricht.setAttribute('style','visibility:hidden');

        successNachricht.innerHTML = text;

        setTimeout(function(){
            successNachricht.setAttribute('style','visibility:hidden');
        }, duration);
    }


    function showFailureMessage(text) {
        let successNachricht = document.getElementById("success-nachricht");
        let failureNachricht = document.getElementById("failure-nachricht");

        failureNachricht.setAttribute('style','visibility:visible');
        successNachricht.setAttribute('style','visibility:hidden');

        failureNachricht.innerHTML = text;

        setTimeout(function(){
            failureNachricht.setAttribute('style','visibility:hidden');
        }, 3000);
    }

    function calculateNRounds(nPlayers) {
        if (nPlayers === 3)
          return 20;
        if (nPlayers === 4)
          return 15;
        if (nPlayers === 5)
          return 12;
        if (nPlayers === 6)
          return 10;
    }

    const submitButton = document.querySelector("[type=submit]");
    const resetButton = document.querySelector("[type=reset]");

    let currentRound = 0;
    let actualRound = 0;
    let nPlayers = 0;
    let nRounds = 0;
    let punkte = [];

    names.forEach(e => { e.disabled = false; e.value = ""; });
    stiche.forEach(e => { e.disabled = true; e.value = ""; });
    actualStiche.forEach(e => { e.disabled = true; e.value = ""; });

    function resetGame(){
        names.forEach(e => { e.disabled = false; e.value = ""; });
        stiche.forEach(e => { e.disabled = true; e.value = ""; });
        actualStiche.forEach(e => { e.disabled = true; e.value = ""; });

        for (let i=0; i<6; i++)
           zwischenstaende[i].innerHTML = "";

        nPlayers = 0;
        nRounds = 0;
        punkte = [];
        currentRound = 0;
        actualRound = 0;
        updateRoundText("Ihr habt noch nicht angefangen zu spielen...")
    }

    function nextRound(e) {
        e.preventDefault();

        // If this is the first round, gather the names
        if (currentRound === 0) {
            let a = [];
            for (let i=0 ; i<6 ; i++){
                console.log("Name: " + names[i].value + ", Angesagte Stiche: " + stiche[i].value + ", Actual Stiche: " + actualStiche[i].value);   
                if (a.includes(names[i].value)){
                    showFailureMessage("Doppelter Name, bitte ändern."); 
                    return;
                }

                if (names[i].value != null && names[i].value != "")
                    a.push(names[i].value);
            }

            if (a.length < 3){
                showFailureMessage("Zu wenig Spieler");
                return;
            }

            nPlayers = a.length;
            nRounds = calculateNRounds(nPlayers);

            names.forEach(name => { name.disabled = true });
            stiche.forEach(name => { name.disabled = false });
            actualStiche.forEach(name => { name.disabled = true });

            showSuccessMessage("Welcome to WIZARD!", 2000);
            updateRoundText("Ihr seid in Runde: " + (actualRound+1));


            submitButton.value = "Weiter!"

        // first step of the round
        } else if (currentRound % 2 === 1) {
            for (let i = 0; i < nPlayers; i++) {
                if (stiche[i].value === "") {
                    showFailureMessage("Gib mal Zahlen ein");
                    return;
                }
            }

            names.forEach(e => { e.disabled = true });
            stiche.forEach(e => { e.disabled = true });
            actualStiche.forEach(e => { e.disabled = false });

            submitButton.value = "Nächste Runde!"

        // second step of the round
        } else if (currentRound % 2 === 0) {
            for (let i = 0; i < nPlayers; i++) {
                if (actualStiche[i].value === "") {
                    showFailureMessage("Gib mal Zahlen ein");
                    return;
                }
            }

            for (let i = 0; i < nPlayers; i++) {
                const result = stiche[i].value - actualStiche[i].value;

                let points = 0;
                if (result === 0)
                  points = 20 + parseInt(stiche[i].value) * 10;
                else
                  points = -10 * Math.abs(result);

                if (punkte[i] == null)
                    punkte[i] = 0;

                punkte[i] += points;
                zwischenstaende[i].innerHTML = punkte[i];
            }

            names.forEach(e => { e.disabled = true });
            stiche.forEach(e => { e.disabled = false; e.value = ""; });
            actualStiche.forEach(e => { e.disabled = true; e.value = ""; });
            actualRound++;

            updateRoundText("Ihr seid in Runde: " + (actualRound+1));

            submitButton.value = "Weiter!"
        }

        // If this is the last round, find out who won and show a message
        if (actualRound === nRounds) {
            let playerWithMostPoints = 0;
            let highestPoints = 0;

            for (let i = 0; i < nPlayers; i++) {
                if (punkte[i] > highestPoints) {
                    playerWithMostPoints = i;
                    highestPoints = punkte[i];
                }
            }

            showSuccessMessage("Spieler " + names[playerWithMostPoints].value + " hat mit " + highestPoints + " Punkten gewonnen", 10000);
            resetGame();
            return;
        }

        currentRound++;
    }

    function updateRoundText(text){
        let round = document.getElementById("runde");
        round.innerHTML = text;
    }


    submitButton.addEventListener("click",
                            nextRound,
                            false);
    resetButton.addEventListener("click",
                            resetGame,
                            false);
}
