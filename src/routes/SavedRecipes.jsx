import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';


export default function SavedRecipes() {
    const [recipes, setRecipes] = useState([])

    async function getRecipes(e) {
  // Store recipe to firebase
    try {
        await getDocs(collection(db, "recipes"))
            .then((querySnapshot) => {
                const savedRecipes = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setRecipes(savedRecipes)
                console.log(savedRecipes[0]['recipe']['dish'])
        })
    }
      catch (e) {
            console.error("Error fetching documents: ", e);
          }
    }
    
    useEffect(() => {
        getRecipes();
    }, [])

    const recipeList = recipes.map(each => {
        return (
            <li
                className='mb-6 text-left max-w-md mx-auto cursor-pointer text-gray-700 hover:text-orange-700 duration-200'
                key={each['recipe']['dish']}
                onClick={()=>console.log(each['recipe'])}>
                <Link to={'/'}
                    state={{ recipe: each['recipe'] }}
                >{each['recipe']['dish']}</Link>
            </li>
        )
    })

    

    return (
        <>
            <div className='text-xl mb-6 font-semibold'>saved recipes</div>
            <ul>{recipeList}</ul>
        </>
        
    )
}