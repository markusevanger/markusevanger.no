import "./WindowAnimation.css";


import Fence from "../assets/svg/v1/FenceLong.svg?react"
import Tree_1 from "../assets/svg/v2/Tre-1.svg?react" 
import Tree_2 from "../assets/svg/v2/Tre-2.svg?react" 
import Tree_3 from "../assets/svg/v2/Tre-3.svg?react" 
import { useEffect, useState } from "react";

const treeComponents = [
    <Tree_1 key="tree1" />,
    <Tree_2 key="tree2" />,
    <Tree_3 key="tree3" />
  ];


const treeSpawnInterval = 3000;



function WindowAnimation(){


    const [currentTreeIndex, setCurrentTreeIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTreeIndex(prevIndex => (prevIndex + 1) % treeComponents.length) // takker in2010 linear probing for denne
            console.log(currentTreeIndex)
        }, treeSpawnInterval);

        return () => clearInterval(intervalId)
    }, [])

    return(

        <div className="trainWindow">
            <div className="scenery">


                <div className="foregroundDiv">
                </div>

                <div className="middlegroundDiv">
                    {treeComponents[currentTreeIndex]}
                </div>

                <div className="background">

                    {/* TODO */}

                </div>

                
            </div>
        </div>
        )
};
export default WindowAnimation;