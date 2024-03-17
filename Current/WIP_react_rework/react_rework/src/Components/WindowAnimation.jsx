import "./WindowAnimation.css";


import { useEffect, useState } from "react";

import biomes from './WindowAnimationBiomes.json'



function WindowAnimation(){

    return(

        <div className="trainWindow">
            <div className="scenery">


                <div className="foregroundDiv">
                    <img className="foregroundItem" src={biomes.biomes[0].default.foreground}/>
                    <img className="foregroundItem" src={biomes.biomes[0].default.foreground}/>
                </div>

                <div className="middlegroundDiv">
                    <img className="middlegroundItem" src={biomes.biomes[0].default.middleground}/>
                    <img className="middlegroundItem" src={biomes.biomes[0].default.middleground}/>
                </div>

                <div className="backgroundDiv">

                    <img className="backgroundItem" src={biomes.biomes[0].default.background}/>

                </div>

                
            </div>
        </div>
        )
};
export default WindowAnimation;