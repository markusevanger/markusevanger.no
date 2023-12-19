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
      
      
      {counter === 0  && <img src={require("../assets/0001.jpg")} alt="1" />}
      {counter === 1  && <img src={require("../assets/0002.jpg")} alt="2" />}
      {counter === 2  && <img src={require("../assets/0003.jpg")} alt="3" />}
      {counter === 3  && <img src={require("../assets/0004.jpg")} alt="4" />}
      {counter === 4  && <img src={require("../assets/0005.jpg")} alt="5" />}
      {counter === 5  && <img src={require("../assets/0006.jpg")} alt="bilde1" />}
      {counter === 6  && <img src={require("../assets/0007.jpg")} alt="bilde1" />}
      {counter === 7  && <img src={require("../assets/0008.jpg")} alt="bilde1" />}
      {counter === 8  && <img src={require("../assets/0009.jpg")} alt="bilde1" />}
      {counter === 9  && <img src={require("../assets/0010.jpg")} alt="bilde1" />}
      {counter === 10 && <img src={require("../assets/0011.jpg")} alt="bilde1" />}
      {counter === 11 && <img src={require("../assets/0012.jpg")} alt="bilde1" />}
      {counter === 12 && <img src={require("../assets/0013.jpg")} alt="bilde1" />}
      {counter === 13 && <img src={require("../assets/0014.jpg")} alt="bilde1" />}
      {counter === 14 && <img src={require("../assets/0015.jpg")} alt="bilde1" />}
      {counter === 15 && <img src={require("../assets/0016.jpg")} alt="bilde1" />}
      {counter === 16 && <img src={require("../assets/0017.jpg")} alt="bilde1" />}
      {counter === 17 && <img src={require("../assets/0018.jpg")} alt="bilde1" />}
      {counter === 18 && <img src={require("../assets/0019.jpg")} alt="bilde1" />}
      {counter === 19 && <img src={require("../assets/0020.jpg")} alt="bilde1" />}
      {counter === 20 && <img src={require("../assets/0021.jpg")} alt="bilde1" />}
      {counter === 21 && <img src={require("../assets/0022.jpg")} alt="bilde1" />}
      {counter === 22 && <img src={require("../assets/0023.jpg")} alt="bilde1" />}
      {counter === 23 && <img src={require("../assets/0024.jpg")} alt="bilde1" />}
      {counter === 24 && <img src={require("../assets/0025.jpg")} alt="bilde1" />}
      {counter === 25 && <img src={require("../assets/0026.jpg")} alt="bilde1" />}
      {counter === 26 && <img src={require("../assets/0027.jpg")} alt="bilde1" />}
      {counter === 27 && <img src={require("../assets/0028.jpg")} alt="bilde1" />}
      {counter === 28 && <img src={require("../assets/0029.jpg")} alt="bilde1" />}
      {counter === 29 && <img src={require("../assets/0030.jpg")} alt="bilde1" />}
      {counter === 30 && <img src={require("../assets/0031.jpg")} alt="bilde1" />}
      {counter === 31 && <img src={require("../assets/0032.jpg")} alt="bilde1" />}
      {counter === 32 && <img src={require("../assets/0033.jpg")} alt="bilde1" />}
      {counter === 33 && <img src={require("../assets/0034.jpg")} alt="bilde1" />}
      {counter === 34 && <img src={require("../assets/0035.jpg")} alt="bilde1" />}
      {counter === 35 && <img src={require("../assets/0036.jpg")} alt="bilde1" />}

    </div>
  
  );
};

export default ImageComponent;