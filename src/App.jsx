import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${input}`
      );
      const data = await response.json();
      console.log(data.docs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={handleChange} />
        <button>search</button>
      </form>
    </>
  );
}

export default App;
