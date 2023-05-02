import { useState } from 'react'
import './App.css'
// import { openaiKey } from '../firebase'
import { db } from '../firebase'
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { Configuration, OpenAIApi } from "openai";


const recipeResponse = {
  "dish": "minestrone",
"ingredients": [
"1 tablespoon olive oil",
"1 onion, diced",
"2 cloves garlic, minced",
"2 carrots, diced",
"2 stalks celery, diced",
"1 zucchini, diced",
"1 yellow squash, diced",
"1 can (14.5 ounces) diced tomatoes",
"6 cups chicken or vegetable broth",
"1 can (15 ounces) cannellini beans, drained and rinsed",
"1 teaspoon dried basil",
"1 teaspoon dried oregano",
"1/2 teaspoon dried thyme",
"Salt and pepper, to taste",
"1 cup small pasta, such as ditalini or small shells",
"Grated Parmesan cheese, for serving"
],
"instructions": [
"In a large pot or Dutch oven, heat the olive oil over medium heat. Add the onion and garlic and cook until softened, about 5 minutes.",
"Add the carrots, celery, zucchini, and yellow squash to the pot and cook for another 5 minutes.",
"Add the diced tomatoes, broth, beans, basil, oregano, thyme, salt, and pepper to the pot. Bring to a boil and then reduce the heat to low. Simmer for 20-30 minutes, or until the vegetables are tender.",
"Meanwhile, cook the pasta according to the package directions. Drain and set aside.",
"When the soup is done cooking, add the cooked pasta to the pot and stir to combine.",
"Serve the soup hot, topped with grated Parmesan cheese. Enjoy!"
]
}


function App() {
  const [recipe, setRecipe] = useState({})
  const [popup, setPopup] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState("")
  const [userInput, setUserInput] = useState("")
  

  let dishName = ""
  let ingredients = []
  let instructions = []

  if (recipe && recipe['dish'] && recipe['ingredients']) {
    dishName = recipe['dish']
    console.log(dishName)
    ingredients = recipe['ingredients'].map(each => {
      return (
        <li
          className='text-sm cursor-pointer hover:opacity-60'
          key={each}
          onClick={() => { selectIngredient(each) }}>{each}</li>
      )
    })
    instructions = recipe['instructions'].map((each, index) => {
      return (
        <li className='text-sm list-none' key={each}>{index + 1}. {each}</li>
      )
    })
  }
  
  function togglePopup() {
    setPopup(!popup)
  }

  function selectIngredient(each) {
    setSelectedIngredient(each)
    togglePopup()
  }

  function getRecipe(e) {
    e.preventDefault();
    console.log("getting recipe...");

    // Get api key
    const docRef = doc(db, "api-keys", "openai-api-key");
    getDoc(docRef)
      .then((docSnap) => {
        const key = docSnap.data();
        const openaiKey = key.key;

        const configuration = new Configuration({
          apiKey: openaiKey,
        });         

        const openai = new OpenAIApi(configuration);
        const prompt = `return a recipe for ${userInput} formatted as: {"dish": ${userInput}, "ingredients": ["", "", ""],
        "instructions": ["", "", ""]}`;

        openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        })
          .then((completion) => {
            const generatedText =
              completion.data.choices[0].message.content;

            console.log(completion);  
            console.log(generatedText);
            setRecipe(JSON.parse(generatedText));
          })
          .catch((error) => {
            console.log(error);
            setRecipe("");
          });
      })
      .catch((error) => {
        console.log(error);
        setRecipe("");
      });
  }

  async function getAPIkey() {
          
  }


  return (
    <div className='flex flex-col items-center'>
      <input
        type="text"
        className='input input-bordered max-w-xs'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.toLowerCase())}/>
      <button className='btn btn-primary my-6'
        onClick={getRecipe}>get recipe</button> 
      {instructions.length > 1 && <div className=''>
        <div className='text-2xl font-bold my-3'>{dishName}</div>
        <div className='text-lg font-semibold my-3'>ingredients</div>
        <div className='flex flex-col items-start'>{ingredients}</div>
        <div className='text-lg font-semibold my-3'>instructions</div>
        <div className='flex flex-col items-start text-left'>{instructions}</div>
      </div>}
      {popup && 
        <div className='outline bg-white w-80 h-72 absolute top-56 flex flex-col items-center justify-around'>
          <div className='text-sm'>{selectedIngredient}</div>
          <button className='btn btn-outline w-48'>substitute</button>
          <button className='btn btn-outline w-48'>make without</button>
          <button className='btn btn-outline w-48' onClick={togglePopup}>cancel</button>
        </div>}
    </div>
  )
}

export default App
