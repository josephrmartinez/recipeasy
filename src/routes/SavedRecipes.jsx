import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from "firebase/firestore";


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
            <div className='h-10' key={each['recipe']['dish']}>{each['recipe']['dish']}</div>
        )
    })

    

    return (
        <>
            <div className='text-xl mb-6 font-semibold'>saved recipes</div>
            <div>{recipeList}</div>
        </>
        
    )
}