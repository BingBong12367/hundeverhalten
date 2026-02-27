import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res){
if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

const { race, signals, question, image } = req.body;
if(!race && !question && !image) return res.status(400).json({error:"Keine Eingaben vorhanden."});

let prompt=`
Du bist ein erfahrener Hundetrainer, Verhaltensexperte und Biologe.
Analysiere das Verhalten des Hundes anhand der folgenden Informationen:

Rasse: ${race || "unbekannt"}
Signale: ${signals.length ? signals.join(", ") : "keine Signale"}
${image ? "Ein Bild/Video liegt vor (Base64)." : ""}
Benutzerfrage: ${question || "Keine Frage"}

Gib aus:

1. Wahrscheinliche Gefühle in Prozent (z.B. Freude, Angst, Stress, Ruhe, Verspieltheit)
2. Wissenschaftliche Erklärung
3. Tipps für Umgang mit Hund
4. Besonderheiten der Rasse (z.B. fehlender Schwanz, Ohrenstellungen)
5. Falls unzureichende Daten: höfliche Nachricht "Dieses Verhalten wird noch erforscht."

Beantworte auf Deutsch, strukturiert, mit Überschriften.

Beispielausgabe:
Gefühle:
- Angst: 70%
- Stress: 20%
- Ruhe: 10%
Erklärung: ...
Tipps: ...
`;

try{
const completion=await openai.chat.completions.create({
model:"gpt-4o-mini",
messages:[
{role:"system",content:"Du bist ein wissenschaftlicher Hundeverhaltens-Experte, antwortest differenziert und professionell."},
{role:"user",content:prompt}
],
max_tokens:1500,
temperature:0.7
});
res.status(200).json({choices:completion.choices});
}catch(err){
console.error(err);
res.status(500).json({error:"Fehler bei der KI-Analyse"});
}
}
