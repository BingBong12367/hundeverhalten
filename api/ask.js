// ask.js - Mega Hundeverhalten Analyse
const hundeDaten = {
"Labrador Retriever": {
"Sitzend|Schwanz hoch|Ohren vorne": {
gefuehle: { Freude: 80, Angst: 5, Stress: 5, Ruhe: 10, Verspieltheit: 50 },
erklaerung: "Der Labrador ist aufmerksam und freundlich, entspannt, zeigt positive Stimmung.",
tipps: "Kann gestreichelt werden, ideal für Spiel und Training."
},
"Sitzend|Schwanz unten|Ohren angelegt": {
gefuehle: { Freude: 20, Angst: 60, Stress: 10, Ruhe: 10, Verspieltheit: 5 },
erklaerung: "Der Hund wirkt unsicher oder ängstlich, möglicherweise vorsichtig oder gestresst.",
tipps: "Distanz wahren, beruhigend sprechen, keine plötzlichen Bewegungen."
},
"Stehend|Schwanz hoch|Ohren vorne": {
gefuehle: { Freude: 70, Angst: 0, Stress: 5, Ruhe: 15, Verspieltheit: 60 },
erklaerung: "Der Hund ist aktiv, aufmerksam und bereit zum Spiel.",
tipps: "Spielzeug anbieten oder Trainingseinheit starten."
},
"Spielend|Schwanz hoch|Ohren vorne": {
gefuehle: { Freude: 95, Angst: 0, Stress: 0, Ruhe: 5, Verspieltheit: 100 },
erklaerung: "Extrem verspielt, voller Energie.",
tipps: "Idealer Zeitpunkt für Interaktion und Training."
},
// ... weitere Kombinationen für Labrador
},
"Mops": {
"Sitzend|Schwanz nicht vorhanden|Ohren vorne": {
gefuehle: { Freude: 50, Angst: 10, Stress: 10, Ruhe: 30, Verspieltheit: 20 },
erklaerung: "Mops sitzt ruhig, etwas aufmerksam.",
tipps: "Sanftes Streicheln, ruhige Ansprache."
},
"Stehend|Schwanz nicht vorhanden|Ohren angelegt": {
gefuehle: { Freude: 20, Angst: 50, Stress: 20, Ruhe: 10, Verspieltheit: 5 },
erklaerung: "Hund wirkt unsicher oder vorsichtig.",
tipps: "Distanz halten, beruhigend sprechen."
},
// ... weitere Kombinationen für Mops
},
"Deutscher Schäferhund": {
"Sitzend|Schwanz hoch|Ohren vorne": {
gefuehle: { Freude: 60, Angst: 5, Stress: 10, Ruhe: 25, Verspieltheit: 40 },
erklaerung: "Aufmerksam, wachsam, leicht entspannt.",
tipps: "Training oder Spielzeit kann folgen."
},
// ... weitere Kombinationen
},
// ... analog für alle weiteren 19 Rassen
};

// Funktion: Signale aus Auswahl zu Key kombinieren
function kombinationKey(signale) {
return signale.join("|");
}

// Anzeige im Frontend
function zeigeAnalyse(rasse, signale) {
const key = kombinationKey(signale);
const daten = hundeDaten[rasse][key];

const antwortDiv = document.getElementById("antwort");
if(daten){
let text = `Gefühle (Prozent):\n`;
for(const g in daten.gefuehle){
text += `${g}: ${daten.gefuehle[g]}%\n`;
}
text += `\nErklärung: ${daten.erklaerung}\nTipps: ${daten.tipps}`;
antwortDiv.innerText = text;
} else {
antwortDiv.innerText = "Dieses Verhalten wird noch erforscht.";
}
}

// Upload-Vorschau
document.getElementById("upload").addEventListener("change", (e)=>{
const file = e.target.files[0];
if(!file) return;
const img = document.getElementById("previewImg");
const video = document.getElementById("previewVideo");
if(file.type.startsWith("image")){
img.src = URL.createObjectURL(file);
img.style.display="block";
video.style.display="none";
} else if(file.type.startsWith("video")){
video.src = URL.createObjectURL(file);
video.style.display="block";
img.style.display="none";
}
});

// Baum-Interaktion
document.querySelectorAll(".tree .node[data-race]").forEach(raceNode=>{
raceNode.addEventListener("click", ()=>{
const children = raceNode.querySelector(".child-nodes");
if(children) children.style.display = children.style.display==="block"?"none":"block";
});
});

document.querySelectorAll(".child-nodes .node").forEach(signalNode=>{
signalNode.addEventListener("click", ()=>{
signalNode.classList.toggle("selected");
});
});

// Analyse-Button
document.getElementById("analyzeBtn").addEventListener("click", ()=>{
const rasseNode = document.querySelector(".tree .node.selected") || document.querySelector(".tree .node[data-race]");
const rasse = rasseNode.dataset.race;
const signale = Array.from(document.querySelectorAll(".child-nodes .node.selected")).map(n=>n.dataset.signal);
zeigeAnalyse(rasse, signale);
});
