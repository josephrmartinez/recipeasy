// import { openaiKey } from '../firebase'
import { useState } from 'react'
import './App.css'
import { db } from '../firebase'
import { collection, addDoc } from "firebase/firestore";
import { Configuration, OpenAIApi } from "openai";
import { FloppyDisk, HandsClapping, Carrot } from "@phosphor-icons/react";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;


function App() {
  const [recipe, setRecipe] = useState({})
  const [popup, setPopup] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState("")
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)

  // openAI configuration object
  const configuration = new Configuration({
      apiKey: apiKey,
    });         
  const openai = new OpenAIApi(configuration);


  let dishName = ""
  let ingredients = []
  let instructions = []

  if (recipe && recipe['dish'] && recipe['ingredients']) {
    dishName = recipe['dish']
    ingredients = recipe['ingredients'].map(each => {
      return (
        <li
          className='text-sm cursor-pointer list-none mb-2 hover:opacity-60'
          key={each}
          onClick={() => { selectIngredient(each) }}>{each}</li>
      )
    })
    instructions = recipe['instructions'].map((each, index) => {
      return (
        <li className='text-sm list-none mb-1' key={each}><span className='font-bold'>{index + 1}. </span>{each}</li>
      )
    })
  }
  
  function checkForSubmit(event) {
    if (userInput.trim().length < 3) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      getRecipe()
    }
  }
  
  function togglePopup() {
    setPopup(!popup)
  }

  function selectIngredient(each) {
    setSelectedIngredient(each)
    togglePopup()
  }

  function getRecipe() {
    setLoading(true);

    // Submit prompt to openAI API
    const prompt = `return a recipe for ${userInput} formatted as: {"dish": ${userInput}, "ingredients": [array of strings],
    "instructions": [array of strings]}`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        console.log(generatedText);
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setUserInput("")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
        setRecipe("");
      });
  }

  function getRecipeWithSubstitute() {
    setLoading(true);

    // Submit prompt to openAI API
    const prompt = `Substitute ${selectIngredient} with something else in this recipe: ${JSON.stringify(recipe)} Format response as: {"dish": ${dishName}, "ingredients": [array of strings],
    "instructions": [array of strings]}`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        console.log(generatedText);
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setUserInput("")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
        setRecipe("");
      });
  }

  function enhanceRecipe() {
    setLoading(true);

    // Submit prompt to openAI API
    const prompt = `Enhance this recipe to make it more interesting and flavorful: ${JSON.stringify(recipe)} Format response as: {"dish": ${dishName}, "ingredients": [array of strings],
    "instructions": [array of strings]}`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        console.log(generatedText);
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setUserInput("")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
        setRecipe("");
      });
  }

  function getHealthyRecipe() {
    setLoading(true);

    // Submit prompt to openAI API
    const prompt = `Rewrite this recipe to be healthier: ${JSON.stringify(recipe)} Format response as: {"dish": ${dishName}, "ingredients": [array of strings],
    "instructions": [array of strings]}`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        console.log(generatedText);
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setUserInput("")
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
        setRecipe("");
      });
  }

  async function saveRecipe(e) {
  // Store recipe to firebase
    try {
      const docRef = await addDoc(collection(db, "recipes"), {
        recipe: recipe,
      });
      console.log("Document written with ID: ", docRef.id);
    }
      catch (e) {
            console.error("Error adding document: ", e);
          }
  }
  

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-row'><input
        type="text"
        className='input input-bordered max-w-xs'
        value={userInput}
        onKeyDown={checkForSubmit}
        onChange={(e) => setUserInput(e.target.value.toLowerCase())}/>
      <button className='btn btn-primary ml-4'
        onClick={getRecipe}>get recipe</button> </div>
      
      {loading && 
        <div role="status">
        <svg aria-hidden="true" className="w-8 h-8 mt-4 text-gray-200 animate-spin dark:text-gray-600 fill-slate-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
        </div>
      }
      {!loading && 
      <div className='w-8 h-12'></div>}
      {instructions.length > 1 && <div className='max-w-lg'>
        <div className='text-3xl font-bold mt-3 mb-6'>{dishName}</div>
        
     

        <div className='flex flex-row justify-around my-8 mx-auto max-w-lg'>
          <button className='btn btn-ghost text-neutral-600' onClick={enhanceRecipe}><span className='mr-3'><HandsClapping size={26} weight='light' /></span>enhance</button>
          <button className='btn btn-ghost text-neutral-600' onClick={getHealthyRecipe}><span className='mr-3'><Carrot size={26} weight='light' /></span>make healthy</button>
          <button className='btn btn-ghost text-neutral-600'><span className='mr-3'><FloppyDisk size={26} weight='light' /></span>save recipe</button>
        </div>
        
        <div className='text-lg font-bold tracking-wide my-3'>ingredients</div>
        <div className='flex flex-col items-start'>{ingredients}</div>
        <div className='text-lg font-bold tracking-wide my-3'>instructions</div>
        <div className='flex flex-col items-start text-left'>{instructions}</div>
        
        
      </div>}
      {popup && 
        <div className='bg-white rounded-lg w-80 h-72 absolute top-56 flex flex-col items-center'>
          <div className='text-lg font-bold my-16'>{selectedIngredient}</div>
        
          <button className='btn btn-primary w-48 mb-4' onClick={getRecipeWithSubstitute}>substitute</button>
          <button className='btn btn-ghost w-48' onClick={togglePopup}>cancel</button>
          
          </div>}
    </div>
  )
}

export default App



