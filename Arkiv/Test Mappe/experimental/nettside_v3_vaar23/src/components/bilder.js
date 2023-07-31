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

  // spin hvert sekund:
  React.useEffect(() => {
    const speed = 200 // ms mellom hver frame
    const timer = setInterval(() => {
        
        if (counter >= 35) {
            setCounter(0);
        }
        else if (counter < 0) {
          setCounter(35);   
        } 
        else {
            setCounter(counter + 1);
        }

        console.log(counter);
    }, speed);

    return () => clearInterval(timer);
  }, [counter]);

  return (

    



    <div onWheel={handleIncrement}>
      
      <img src={require("../assets/" + (counter + 1) + ".jpg")} alt="cd disk"></img>
      

    </div>
  
  );
};

export default ImageComponent;