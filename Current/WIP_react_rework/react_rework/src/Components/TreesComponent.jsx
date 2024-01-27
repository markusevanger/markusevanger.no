import React from "react";
import PropTypes from 'prop-types';

import Tree_1 from "../assets/svg/v2/Tre-1.svg?react" 
import Tree_2 from "../assets/svg/v2/Tre-2.svg?react" 
import Tree_3 from "../assets/svg/v2/Tre-3.svg?react" 

const TreeSvg = ({ variant, size }) => {


  let svgContent;


  switch (variant) {
   case 0:
    svgContent = (
     <Tree_1></Tree_1>
    );
    break;

   case 1:
    svgContent = (
        <Tree_2></Tree_2>
    );
    break;

    case 2:
        svgContent = (
            <Tree_3></Tree_3>
        );
        break;



   default: // fallback
    svgContent = (
        <Tree_1></Tree_1>
    );
  }

  return (
    <svg
      className={`tree tree-${variant}`}
      style={{
        position: 'absolute',
        right: 0,
        height: `${size}px`, // Controlling size from props
        animation: `move-tree ${20 + variant}s linear`, // Variable animation speed
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      {svgContent}
    </svg>
  );
};

export default TreeSvg;