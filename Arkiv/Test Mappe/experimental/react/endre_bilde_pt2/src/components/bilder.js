import React, { useState } from 'react';

const ImageComponent = () => {
  const [counter, setCounter] = useState(0);

  const handleIncrement = (event) => {
    if (event.deltaY < 0) {
      if(counter >= 35){
        setCounter(0)
      }
      else{
        setCounter(counter + 1);
      }
      
    } else if (event.deltaY > 0) {
      if (counter <= 0){
        setCounter(35);
      }
      else{
        setCounter(counter - 1);
      }
    }


    console.log({counter})
  };

  return (
    <div onWheel={handleIncrement}>
      <img src={require("../assets/" + String(counter+1).padStart(4,"0") + ".jpg")} alt="1" />
    </div>
  
  );
};

export default ImageComponent;