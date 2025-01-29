import React, { useState } from "react";
import "./RightBar.css";

interface AppProps {
  value1: number;
  value2?: string;
}

export const RightBar = () => {
  const [inputData, setInputData] = useState({
    sepal_length: 0,
    sepal_width: 0,
    petal_length: 0,
    petal_width: 0,
  });
  const [prediction, setPrediction] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: parseFloat(value) });
  };

  const callModel = () => {
    fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPrediction(data.prediction);
        console.log("Prediction:", data.prediction);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const callRetrainModel = () => {
    fetch("http://localhost:8000/train", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Message:", data.message);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  return (
    <div className="right-bar">
      <h1>Iris Classification</h1>
      <div>
        <label>Sepal Length:</label>
        <input
          type="number"
          step="0.01"
          name="sepal_length"
          value={inputData.sepal_length}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Sepal Width:</label>
        <input
          type="number"
          step="0.01"
          name="sepal_width"
          value={inputData.sepal_width}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Petal Length:</label>
        <input
          type="number"
          step="0.01"
          name="petal_length"
          value={inputData.petal_length}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Petal Width:</label>
        <input
          type="number"
          step="0.01"
          name="petal_width"
          value={inputData.petal_width}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={callModel}>Predict</button>
      {prediction !== null && <p>The predicted class is: {prediction}</p>}
      <button onClick={callRetrainModel}>Retrain</button>
    </div>
  );
};
