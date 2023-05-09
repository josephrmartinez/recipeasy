import { Outlet, NavLink } from "react-router-dom";
import { List, X } from "@phosphor-icons/react";
import { useState } from 'react'



export default function Root() {
    const [menuVisible, setMenuVisible] = useState(false)

    function toggleMenu() {
        setMenuVisible(!menuVisible)
    }

    return (
        <>
            {menuVisible ? 
            <X
                size={32}
                weight="bold"
                className="mr-0 ml-auto mb-6 cursor-pointer"
                    onClick={toggleMenu} />
                :
                <List
                size={32}
                weight="bold"
                className="mr-0 ml-auto mb-6 cursor-pointer"
                onClick={toggleMenu} />
            }
            
            {menuVisible &&
                <div className="flex flex-col absolute right-0 w-48 h-32 shadow rounded-md bg-[#F7F7F7]">
                    <NavLink
                        to={`/`}
                        onClick={toggleMenu}
                        end
                        className={({ isActive }) =>
                            `h-16 ${isActive ? "text-gray-700 font-bold bg-gray-100" : "text-gray-500 font-semibold"} flex flex-col justify-center hover:bg-gray-200`}>
                        <div>get recipe</div>
                    </NavLink>
                    <NavLink
                        to={`/saved`}
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                            `h-16 ${isActive ? "text-gray-700 font-bold bg-gray-100" : "text-gray-500 font-semibold"} flex flex-col justify-center hover:bg-gray-200`}>
                        <div>saved recipes</div>
                    </NavLink>
                
                </div>}
        <div><Outlet /></div>
            

        
            
            
        </>
    )
}

{/* <div className="flex flex-row w-full absolute justify-around bottom-0 bg-[#F7F7F7]">
            <NavLink
                to={`/`}
                    end
                className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center justify-evenly rounded-full stroke-amber-500 text-gray-700"
                : "flex flex-col items-center justify-evenly rounded-full stroke-gray-500 text-gray-500"}>
                <div>get recipe</div>
            </NavLink> 
            <NavLink
                to={`/saved`}
                end>
                <div>saved recipes</div>
            </NavLink> 
            
        </div> */}