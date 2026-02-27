import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export default async function handler(req,res){
if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

const {race,signals,question,image} = req.body;

let prompt=`Du bist ein erfahrener Hundetrainer/Biologe. Analysiere den Hund mit folgender Rasse: ${race || 'unbekannt'}.\n`;
if(signals?.length) prompt+=`Folgende Signale wurden beobachtet: ${signals.join(', ')}.\n`;
if(image) prompt+=`Das Bild/Video ist beigefügt (Base64) und soll zur Analyse genutzt werden.\n`;
if(question) prompt+=`Frage vom Benutzer: ${question}\n`;
prompt+=`Gib eine prozentuale Einschätzung der Gefühle (z.B. Angst, Freude, Ruhe, Stress) und praktische Tipps, was der Hund gerade fühlt und was man tun sollte.`;

try{
const completion = await openai.chat.completions.create({
model:"gpt-4o-mini",
messages:[
{role:"system",content:"Du bist ein hilfreicher wissenschaftlicher Hundetrainer."},
{role:"user",content:prompt}
],
max_tokens:600,
temperature:0.7
});
res.status(200).json({choices:completion.choices});
}catch(err){
console.error(err);
res.status(500).json({error:"Fehler bei der KI-Analyse"});
}
}
