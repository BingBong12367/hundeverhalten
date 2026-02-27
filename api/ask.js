export default async function handler(req,res){

if(req.method !== "POST"){
return res.status(400).json({error:"POST only"});
}

try{

const {question,image} = req.body;

const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
},

body:JSON.stringify({

model:"gpt-4o-mini",

messages:[

{
role:"system",
content:
"Du bist ein wissenschaftlicher Hunde-Verhaltensforscher. Analysiere Körpersprache, Stresssignale, Emotionen, Schwanzhaltung, Ohrenstellung, Rassenunterschiede und Kontext. Wenn etwas unklar ist, erkläre mögliche Hypothesen."
},

{

role:"user",

content:[

{
type:"text",
text:question || "Analysiere das Verhalten des Hundes."
},

image ? {

type:"image_url",

image_url:{
url:image
}

} : null

].filter(Boolean)

}

],

max_tokens:800

})

});

const data = await response.json();

res.status(200).json(data);

}catch(e){

res.status(500).json({error:e.message});

}

}
