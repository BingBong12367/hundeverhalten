// api/ask.js
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY, // dein OpenAI-Key in Vercel als Umgebungsvariable setzen
});

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

const { question, image } = req.body;

try {
// Prompt für KI
let prompt = `Du bist ein erfahrener Hundetrainer und Biologe.
Analysiere die folgende Frage und falls ein Bild oder Video vorhanden ist, beziehe dich darauf.
Gib eine ausführliche, sachliche Antwort für den Hundebesitzer.\n\n`;
prompt += `Frage: ${question}\n`;
if (image) prompt += `Bild/Video: [Base64-Daten]\n`;

const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "Du bist ein hilfreicher, wissenschaftlicher Hundetrainer." },
{ role: "user", content: prompt }
],
max_tokens: 500,
temperature: 0.7
});

res.status(200).json({ choices: completion.choices });
} catch (err) {
console.error(err);
res.status(500).json({ error: "Fehler bei der KI-Abfrage" });
}
}
