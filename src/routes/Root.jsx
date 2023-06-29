import { Outlet, NavLink } from "react-router-dom";
import { List, X, Hamburger, Archive, CookingPot } from "@phosphor-icons/react";
import { useState } from 'react'



export default function Root() {
    const [menuVisible, setMenuVisible] = useState(false)

    function toggleMenu() {
        setMenuVisible(!menuVisible)
    }

    return (
        <div className="flex flex-col items-center">
        <div className="flex flex-row w-full max-w-lg mb-4 justify-between">
        <NavLink
        to={`/`}
        onClick={toggleMenu}
        end
        className={({ isActive }) =>
            `${isActive ? "text-green-800" : "text-gray-400"} flex flex-col justify-center ml-1`}>
        <CookingPot
            size={26}
            weight="light"
            className="cursor-pointer" />
            </NavLink>
            <NavLink
        to={`/saved`}
        onClick={toggleMenu}
        end
        className={({ isActive }) =>
            `${isActive ? "text-green-800" : "text-gray-400"} flex flex-col justify-center mr-1`}>
        <Archive
            size={26}
            weight="light"
            className="cursor-pointer" />
            </NavLink>
        </div>
            
        <div><Outlet /></div>
            
        </div>
    )
}

// {menuVisible ? 
//     <X
//         size={32}
//         weight="bold"
//         className="mr-0 ml-auto mb-6 cursor-pointer"
//             onClick={toggleMenu} />
//         :
//         <Hamburger
//         size={32}
//         weight="regular"
//         className="mr-0 ml-auto mb-6 cursor-pointer"
//         onClick={toggleMenu} />
//     }
    
//     {menuVisible &&
//         <div className="flex flex-col absolute right-0 w-48 h-32 shadow rounded-md bg-[#F7F7F7]">
//             <NavLink
//                 to={`/`}
//                 onClick={toggleMenu}
//                 end
//                 className={({ isActive }) =>
//                     `h-16 ${isActive ? "text-gray-700 font-bold bg-gray-100" : "text-gray-500 font-semibold"} flex flex-col justify-center hover:bg-gray-200`}>
//                 <div>get recipe</div>
//             </NavLink>
//             <NavLink
//                 to={`/saved`}
//                 onClick={toggleMenu}
//                 className={({ isActive }) =>
//                     `h-16 ${isActive ? "text-gray-700 font-bold bg-gray-100" : "text-gray-500 font-semibold"} flex flex-col justify-center hover:bg-gray-200`}>
//                 <div>saved recipes</div>
//             </NavLink>
        
//         </div>}