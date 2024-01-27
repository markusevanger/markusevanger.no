import "./WindowAnimation.css";
import Tree from "../assets/svg/v1/TreePair.svg?react";
import Fence from "../assets/svg/v1/FenceLong.svg?react"

import Tree_1 from "../assets/svg/v2/Tre-1.svg?react" 



function WindowAnimation(){

    return(

        <div className="trainWindow">
            <div className="scenery">


                <div className="foregroundDiv">
                    <Fence className="foregroundItem"/>
                    <Fence className="foregroundItem"/>
                    
                </div>

                <div className="middlegroundDiv">
                    <Tree className="middlegroundItem"/>
                    <Tree className="middlegroundItem"/>
                </div>

                <div className="background">

                    {/* TODO */}

                </div>

                
            </div>
        </div>
        )
};
export default WindowAnimation;