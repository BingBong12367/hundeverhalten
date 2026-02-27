import OpenAI from "openai";

// Dein API Key muss als Umgebungsvariable OPENAI_API_KEY gesetzt sein
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

const { race, signals, question, image } = req.body;

if (!race && !question && !image) {
return res.status(400).json({ error: "Keine Eingaben vorhanden." });
}

// Mega-detaillierter Prompt für wissenschaftliche Hundeverhaltensanalyse
let prompt = `
Du bist ein erfahrener Hundetrainer, Verhaltensexperte und Biologe.
Analysiere das Verhalten des Hundes basierend auf den folgenden Informationen:

Rasse: ${race || "unbekannt"}
Beobachtete Signale: ${signals && signals.length ? signals.join(", ") : "Keine Signale"}
${image ? "Ein Bild oder Video wurde bereitgestellt (Base64), analysiere die Körpersprache." : ""}
Benutzerfrage: ${question || "Keine zusätzliche Frage"}

Gib folgende Informationen zurück:

1. Wahrscheinliche Gefühle des Hundes mit **Prozentangaben** für Freude, Angst, Stress, Ruhe, Verspieltheit usw.
2. Eine kurze, wissenschaftliche Erklärung, warum diese Einschätzung getroffen wird.
3. Praktische Tipps für den Umgang mit dem Hund basierend auf den Signalen.
4. Berücksichtige Besonderheiten der Rasse, z.B. fehlender Schwanz, besondere Ohrenstellungen usw.
5. Falls die Daten unzureichend sind, gib eine höfliche Nachricht, z.B.: "Dieses Verhalten wird noch erforscht."
6. Antworte in deutscher Sprache, klar gegliedert, mit Überschriften für Gefühle, Erklärung und Tipps.

Beispielausgabe (für ein Signal: "Sitzend, Ohren angelegt, Röcheln"):

Gefühle (mit Wahrscheinlichkeit %):
- Angst: 70%
- Stress: 20%
- Ruhe: 10%

Erklärung:
Die angelegten Ohren und das Röcheln deuten darauf hin, dass der Hund unsicher ist. Sitzend zeigt er Bereitschaft zur Beobachtung.

Tipps:
- Den Hund beruhigend ansprechen
- Nicht plötzlich nähern
- Belohnung für ruhiges Verhalten geben
`;

try {
const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "Du bist ein wissenschaftlicher Hundeverhaltens-Experte und Trainer. Antworte präzise, differenziert und professionell." },
{ role: "user", content: prompt }
],
max_tokens: 1200,
temperature: 0.7
});

// Rückgabe an das Frontend
res.status(200).json({ choices: completion.choices });
} catch (err) {
console.error("KI-Fehler:", err);
res.status(500).json({ error: "Fehler bei der KI-Analyse" });
}
}
