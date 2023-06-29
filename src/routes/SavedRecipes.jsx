import { useEffect, useState, useRef } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from 'react-router-dom';


export default function SavedRecipes() {
    const [recipes, setRecipes] = useState([])
    const [popup, setPopup] = useState(false)
    const [selectedRecipe, setSelectedRecipe] = useState({})
    const [dataObj, setDataObj] = useState({})
    const popupRef = useRef(null);

    function togglePopup() {
        setPopup(!popup)
    }

    function clickRecipe(each, event) {
        event.stopPropagation();
        setSelectedRecipe(each.recipe)
        setDataObj(each)
        togglePopup()
        
    }

    async function getRecipes(e) {
     // Store recipe to firebase
    try {
        await getDocs(collection(db, "recipes"))
            .then((querySnapshot) => {
                const savedRecipes = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setRecipes(savedRecipes)
        })
    } catch (e) {
            console.error("Error fetching documents: ", e);
          }
    }
    
    const deleteRecipe = async (dishName) => {
        try {
        console.log(dishName)
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const matchingRecipes = querySnapshot.docs.filter((doc) => doc.data().recipe.dish === dishName);
        if (matchingRecipes.length > 0) {
        const recipeId = matchingRecipes[0].id;
        await deleteDoc(doc(db, "recipes", recipeId));
        console.log(`Recipe with dish name "${dishName}" deleted successfully.`);
        togglePopup()
        }
    } catch (e) {
        console.error("Error deleting recipe: ", e);
    }
    };

    useEffect(() => {
        getRecipes();
    }, [recipes])

    useEffect(() => {
        // Attach the event listener when the popup is open
        if (popup) {
        document.addEventListener('click', handleOutsideClick);
        }
        // Cleanup the event listener when the popup is closed
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [popup]);

  const handleOutsideClick = (event) => {
    // Check if the clicked element is outside the popup
    if (popupRef.current && !popupRef.current.contains(event.target)) {
    togglePopup();
    }
  };

    
    const recipeList = recipes.map((each, index) => (
            <li
            className={`py-6 px-3 text-left max-w-md w-full mx-auto cursor-pointer tracking-wide text-gray-700 hover:text-orange-700 duration-200 ${index % 2 === 0 ? 'bg-neutral-200/20' : ''}`}
                key={each['recipe']['dish']}
                onClick={(event)=> clickRecipe(each, event)}>
                {each['recipe']['dish']}
            </li>
        ))

    return (
        <div className='flex flex-col items-center'>
            <div className='btn btn-wide btn-primary mb-6 cursor-default hover:bg-[#2D6645]'>SAVED RECIPES</div>
            <ul>{recipeList}</ul>
            {popup && 
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                <div
                    ref={popupRef}
                    className='bg-white shadow-md rounded-lg w-72 h-72 absolute top-52 flex flex-col items-center'>
                        
                <div className='text-lg font-bold my-12' onClick={() => {console.log(dataObj.img)}}>{selectedRecipe['dish']}</div>
                <button className='btn btn-primary w-48 mb-4'><Link to={'/'}
                    state={{ recipe: selectedRecipe, healthy: dataObj.healthy, saved: dataObj.recipeSaved, enhanced: dataObj.enhanced, dataObj: dataObj, img: dataObj.img }}
                >get recipe</Link></button>
                <button className='btn btn-ghost w-48 text-red-500' onClick={()=>deleteRecipe(selectedRecipe['dish'])}>delete</button>
          </div></div>}
        </div>    
    )
}

