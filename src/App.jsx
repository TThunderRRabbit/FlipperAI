import { useState } from "react";
import "./App.css";

function App() {
  const [bookCollection, setBookCollection] = useState([]);
  const [input, setInput] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${input}&limit=2`
      );
      const data = await response.json();
      console.log(data.docs);
      const newBooks = data.docs.map((book) => {
        return {
          title: book.title,
          bookImage: `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`,
          ratings_averagew: book.ratings_average,
        };
      });
      setBookCollection(newBooks);
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
      <div className="bookList">
        {bookCollection.length > 0 && (
          <ul>
            {bookCollection.map((book, index) => {
              return <li key={index}>{book.title}</li>;
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
