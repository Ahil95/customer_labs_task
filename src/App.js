import { useState } from "react";
import "./App.css";
import Popup from "./pages/Popup";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setShowPopup(true)} className="popupButton">
        Save Segment
      </button>
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} />
    </div>
  );
}

export default App;
