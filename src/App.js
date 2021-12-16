import "./App.css";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { useEffect, useState, useRef } from "react";
// import { useRef } from "react/cjs/react.development";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    console.log(e);
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const identify = async () => {
    textInputRef.current.value = "";
    const results = await model.classify(imageRef.current);
    console.log(results);
    setResults(results);
  };

  const handleOnChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setHistory([imageUrl, ...history]);
    }
  }, [imageUrl]);

  if (isModelLoading) {
    // return <h2>Model Loading!</h2>;
    return (
      <button className="btn btn-primary loadingBtn" type="button" disabled>
        <span
          class="spinner-border spinner-border-sm loadanim"
          role="status"
          aria-hidden="true"
        >
          Loading...
        </span>
      </button>
    );
  }

  console.log(imageUrl);

  return (
    <div className="App">
      <h1 className="header">Image Identification</h1>
      <div className="inputHolder">
        <input
          type="file"
          capture="camera"
          className="uploadInput"
          onChange={uploadImage}
          ref={fileInputRef}
          // style={{ display: "none" }}
        />
        <button onClick={triggerUpload} className="uploadImage">
          Upload Image
        </button>
        <span className="or">OR</span>
        <input
          type="text"
          name=""
          id=""
          placeholder="Paste Image URL"
          ref={textInputRef}
          onChange={handleOnChange}
        />
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Upload Preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
          {results.length > 0 && (
            <div className="resultsHolder">
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="confidence">
                      Confidence Level: {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Best Guess</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {imageUrl && (
          <button className="button" onClick={identify}>
            Identify Image
          </button>
        )}
      </div>
      {history.length > 0 && (
        <div className="recentPredictions">
          <h2>Recent Images</h2>
          <div className="recentImages">
            {history.map((image, index) => {
              return (
                <div className="recentPrediction" key={`${image}${index}`}>
                  <img
                    src={image}
                    alt="Recent Prediction"
                    onClick={() => setImageUrl(image)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
