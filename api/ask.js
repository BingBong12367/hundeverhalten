export default async function handler(req, res) {

if(req.method !== "POST"){
return res.status(400).json({error:"POST only"});
}

const {prompt} = req.body;

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
content:"Du bist ein wissenschaftlicher Hundeexperte."
},
{
role:"user",
content:prompt
}
]
})
});

const data = await response.json();

res.status(200).json(data);

}
