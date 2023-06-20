import { useState, useEffect } from 'react'
import '../App.css'
import { db } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";
import { Configuration, OpenAIApi } from "openai";
import { FloppyDisk, FloppyDiskBack, HandsClapping, Carrot } from "@phosphor-icons/react";
import { useLocation } from 'react-router-dom';
import sendToTrello from '../utilities/sendToTrello';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export default function GetRecipe() {
  const location = useLocation();
  const displayRecipe = location.state ? location.state.recipe : {}
  const isEnhanced = location.state ? location.state.enhanced : false
  const isHealthy = location.state ? location.state.healthy : false
  const isSaved = location.state ? location.state.saved : false

  const [recipe, setRecipe] = useState(displayRecipe)
  const [popup, setPopup] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState("")
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [enhanced, setEnhanced] = useState(isEnhanced)
  const [healthy, setHealthy] = useState(isHealthy)
  const [recipeSaved, setRecipeSaved] = useState(isSaved)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [sentToTrello, setSentToTrello] = useState(false)
  const [ingredients, setIngredients] = useState([])
  const [dishName, setDishName] = useState("")
  const [instructions, setInstructions] = useState([])
  const [displayIngredients, setDisplayIngredients] = useState([])
  const [imgSrc, setImgSrc] = useState("")
  

  function renderDisplayIngredients() {
    return ingredients.map((ingredient, index) => {
      return (
        <div className='flex flex-row' key={index}>
              <input
                  type="checkbox"
                  className='mr-3'
                  style={{ verticalAlign: 'middle', position: 'relative', bottom: '.25em' }} 
                  checked={ingredient.checked}  
                  onChange={() => handleCheckboxChange(index)} />
              <li
          className='text-sm cursor-pointer list-none mb-2 hover:opacity-60'
          onClick={() => { clickIngredient(ingredient.name) }}>{ingredient.name}</li>
        </div>)
    })
  }


  function renderInstructions() {
    return recipe['instructions'].map((each, index) => {
      return (
        <li className='text-sm list-none mb-1' key={index}>{each}</li>
    )})
  }
  
  useEffect(() => {
  if (recipe['ingredients']) {
    console.log("running useEffect");
    setDishName(recipe['dish']);
    const mappedIngredients = recipe.ingredients.map((ingredient) => ({
      name: ingredient,
      checked: false
    }));
    setIngredients(mappedIngredients);
  }
}, [recipe]);

useEffect(() => {
  if (ingredients.length > 0) {
    setDisplayIngredients(renderDisplayIngredients);
    setInstructions(renderInstructions);
  }
}, [ingredients]);




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

  function clickIngredient(each) {
    setSelectedIngredient(each)
    togglePopup()
  }

    
    function handleCheckboxChange(index) {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index].checked = !updatedIngredients[index].checked;
        setIngredients(updatedIngredients);
        const selectedIngredients = updatedIngredients
            .filter(ingredient => ingredient.checked)
            .map(ingredient => ingredient.name);
        setSelectedIngredients(selectedIngredients);
};


  function handleCheckAll() {
  const updatedIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    checked: false,
  }));
  setIngredients(updatedIngredients);
}
    
  
  // openAI configuration object
  const configuration = new Configuration({
      apiKey: apiKey,
    });         
  const openai = new OpenAIApi(configuration);
  
  
  
  // function getRecipe() {
  //   setLoading(true);

  //   // Submit prompt to openAI API
  //   const prompt = `return a recipe for ${userInput}. Provide your response as a JSON object with the following schema: {"dish": ${userInput}, "ingredients": ["", "", ...],
  //   "instructions": ["1. ...", "2. ...", ... ]}`;

  //   openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     messages: [{ role: "system", "content": "You are a helpful recipe assistant."},
  //       { role: "user", content: prompt }],
      
  //   })
  //     .then((completion) => {
  //       // Handle API response
  //       const generatedText =
  //         completion.data.choices[0].message.content;
  //       console.log(prompt)
  //       console.log(completion);  
  //       console.log(generatedText);
  //       setLoading(false)
  //       setRecipe(JSON.parse(generatedText));
  //       setRecipeSaved(false)
  //       setUserInput("")
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setLoading(false)
  //       setRecipe("");
  //     });
  // }


  function getRecipe() {
  if (!userInput) {
    console.error("Please provide a valid input.");
    return;
  }

  setLoading(true);

  const prompt = `return a recipe for ${userInput}`;

  const schema = {
    "type": "object",
    "properties": {
      "dish": {
        "type": "string",
        "description": "Descriptive title of the dish"
      },
      "ingredients": {
        "type": "array",
        "items": { "type": "string" }
      },
      "instructions": {
        "type": "array",
        "description": "Numbered steps to prepare the recipe.",
        "items": { "type": "string" }
      }
    }
  };

  const chatCompletionParams = {
    model: "gpt-3.5-turbo-0613", // Specify the OpenAI model version here
    messages: [
      { role: "system", "content": "You are a helpful recipe assistant." },
      { role: "user", content: prompt }
    ],
    functions: [{ name: "set_recipe", parameters: schema }],
    function_call: { name: "set_recipe" }
  };

  const imageParams = {
    prompt: `A high quality, detailed, 4k image of ${userInput} that is of very high quality and precision.`,
    n: 1,
    size: '256x256',
    response_format: 'b64_json'
  };

  openai.createChatCompletion(chatCompletionParams)
    .then((completion) => {
      const generatedText = completion.data.choices[0].message.function_call.arguments;
      setRecipe(JSON.parse(generatedText));
      setRecipeSaved(false);

      return openai.createImage(imageParams);
    })
    .then((response) => {
      const imageData = response.data.data[0].b64_json;
      setImgSrc(`data:image/png;base64,${imageData}`);
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      setRecipe("");
    })
    .finally(() => {
      setLoading(false);
      setUserInput("");
    });
  }
  



  function getRecipeWithSubstitute() {
    setLoading(true);
    setPopup(false)
    // Submit prompt to openAI API
    const prompt = `Generate another version of this recipe but substitute the ${selectedIngredient} with something else: ${JSON.stringify(recipe)} Format response as: {"dish": ${userInput}, "ingredients": ["", "", ...],
    "instructions": ["1. ...", "2. ...", ... ]} Do not include anything outside of the curly braces.`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setRecipeSaved(false)
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
    const prompt = `Enhance this recipe to make it more interesting and flavorful: ${JSON.stringify(recipe)} Format response as: {"dish": ${userInput}, "ingredients": ["", "", ...],
    "instructions": ["1. ...", "2. ...", ... ]} Do not include anything outside of the curly braces.`;


    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setRecipeSaved(false)
        setEnhanced(true)
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
    const prompt = `Rewrite this recipe to be healthier: ${JSON.stringify(recipe)} Format response as: {"dish": ${userInput}, "ingredients": ["", "", ...],
    "instructions": ["1. ...", "2. ...", ... ]} Do not include anything outside of the curly braces.`;

    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
      .then((completion) => {
        // Handle API response
        const generatedText =
          completion.data.choices[0].message.content;

        console.log(completion);  
        setLoading(false)
        setRecipe(JSON.parse(generatedText));
        setRecipeSaved(false)
        setHealthy(true)
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
        date: new Date(),
        recipeSaved: true,
        healthy: healthy,
        enhanced: enhanced
      });
      console.log("Document written with ID: ", docRef.id);
      setRecipeSaved(true)
    }
      catch (e) {
            console.error("Error adding document: ", e);
          }
  }
  
    function handleTrelloClick() {
        console.log(selectedIngredients)
        sendToTrello(selectedIngredients)
        setSelectedIngredients([])
        handleCheckAll()
        setSentToTrello(true)
  }
    
    function selectIngredient(ingredient) {
        setSelectedIngredients((prevIngredients)=> [...prevIngredients, ingredient])
    }

    function unselectIngredient(ingredient) {
        setSelectedIngredients((prevIngredients) => 
        prevIngredients.filter((item) => item != ingredient))
    }


  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-row mx-auto w-fit'>
        <input
        type="text"
        className='input input-bordered w-36 sm:w-48'
        value={userInput}
        onKeyDown={checkForSubmit}
        onChange={(e) => setUserInput(e.target.value.toLowerCase())}/>
      <button className='btn btn-primary ml-4'
        onClick={getRecipe}>get recipe</button> </div>
      
      {loading && 
        <div role="status" className='flex flex-col items-center'>
        <svg aria-hidden="true" className="w-8 h-8 mt-6 text-gray-200 animate-spin  fill-slate-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        </div>
      }
      {!loading && 
      <div className='w-8 h-14'></div>}
      {instructions.length > 1 &&
        <div className='max-w-lg'>
          
          <div className='text-3xl font-bold mt-3 mb-3'>{dishName}</div>
    <div className='flex flex-col items-center w-full'><img className="rounded-lg" src={imgSrc}></img></div>
        <div className='flex flex-row sm:w-auto justify-around my-8 mx-auto'>
            {enhanced ?
              <div className='select-none w-24 h-16  flex flex-col items-center justify-center uppercase cursor-default font-semibold text-neutral-600 text-xs'><span className='mb-2'><HandsClapping size={26} weight='duotone' fill='green' /></span>enhanced</div>
              : <button className='btn w-24 h-16  btn-ghost text-neutral-600 text-xs' onClick={enhanceRecipe}><span className=''><HandsClapping size={26} weight='light' /></span>enhance</button>}
            {healthy ?
              <div className='select-none w-24 h-16 flex flex-col items-center justify-center uppercase cursor-default font-semibold text-neutral-600 text-xs'><span className='mb-2'><Carrot size={26} weight='duotone' fill='orange' /></span>healthy</div>
              : <button className='btn w-24 h-16 btn-ghost text-neutral-600 text-xs' onClick={getHealthyRecipe}><span className=''><Carrot size={26} weight='light' /></span>make healthy</button>}
            {recipeSaved ?
              <div className='select-none w-24 h-16 flex flex-col items-center justify-center uppercase cursor-default font-semibold text-neutral-600 text-xs'><span className='mb-2'><FloppyDiskBack size={26} weight='duotone' fill='grey'/></span>recipe saved</div>
              : <button className='btn w-24 h-16 btn-ghost text-neutral-600 text-xs' onClick={saveRecipe}><span className=''><FloppyDisk size={26} weight='light' /></span>save recipe</button>}
          </div>
        
        <div className='text-lg font-bold tracking-wide text-left my-3'>ingredients</div>
        <div className='flex flex-col items-start text-left'>{displayIngredients}</div>
        <div className='w-full flex items-start mb-8'>
            <button
              className='btn btn-ghost text-xs'
            onClick={handleTrelloClick}>
                          {sentToTrello ?
                              ('items sent to trello')
                              : (<span>add items to trello <span className='ml-2'>&#8594;</span></span>)}</button>  
          </div>
          
        <div className='text-lg font-bold tracking-wide text-left my-3'>instructions</div>
        <div className='flex flex-col items-start text-left'>{instructions}</div>
        
        
      </div>}
      {popup && 
        <div className='bg-white shadow-md rounded-lg w-72 sm:w-80 h-72 absolute top-52 flex flex-col items-center'>
          <div className='text-lg font-bold my-12 sm:my-16'>{selectedIngredient}</div>
        
          <button className='btn btn-primary w-48 mb-4' onClick={getRecipeWithSubstitute}>substitute</button>
          <button className='btn btn-ghost w-48' onClick={togglePopup}>cancel</button>
          
          </div>}
    </div>
  )
}