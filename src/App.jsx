import { useState } from "react";
import "./App.css";

function App() {
  const [bookCollection, setBookCollection] = useState([]);
  const [input, setInput] = useState("");

  const [user, setUser] = useState({
    name: "Flipper",
    wishlist: [],
    completed: [],
  });

  const [showWishlist, setShowWishlist] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${input}&limit=4`
      );
      const data = await response.json();
      console.log(data.docs);
      const newBooks = data.docs.map((book) => {
        return {
          title: book.title,
          image: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
          ratings_average: book.ratings_average,
          completed: false,
        };
      });
      setBookCollection(newBooks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChecked = (index) => {
    const updatedBooks = bookCollection.map((book, i) =>
      i === index ? { ...book, completed: !book.completed } : book
    );

    setBookCollection(updatedBooks);

    const completedBooks = updatedBooks.filter((book) => book.completed);
    setUser((prev) => ({
      ...prev,
      completed: completedBooks,
    }));
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const addToWishList = (book) => {
    setUser((prev) => ({
      ...prev,
      wishlist: [...prev.wishlist, book],
    }));
  };

  return (
    <>
      <div className="App">
        <div className="sideBar">
          <div className="userAccount">Flipper</div>
          <div className="userNavigation">
            <div
              className="wishList"
              onClick={() => setShowWishlist(!showWishlist)}
            >
              Wishlist
            </div>
            <div
              className="completed"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              Completed
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={handleChange} />
          <button>search</button>
        </form>
        <div className="bookList">
          {bookCollection.length > 0 && !showWishlist && !showCompleted && (
            <ul>
              {bookCollection.map((book, index) => {
                return (
                  <li key={index}>
                    <h3>{book.title}</h3>
                    <img src={book.image} alt={book.title} />
                    <button
                      className="addToWishlist"
                      onClick={() => {
                        addToWishList(book);
                      }}
                    >
                      Wishlist
                    </button>
                    <p>
                      Ratings: {book.ratings_average || "Ratings not available"}
                    </p>
                    <input
                      type="checkbox"
                      checked={book.completed}
                      onChange={() => handleChecked(index)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="userWishlist">
          {showWishlist && (
            <ul>
              {user.wishlist.map((book, index) => {
                return (
                  <li key={index}>
                    <h3>{book.title}</h3>
                    <img src={book.image} alt={book.title} />
                    <p>{book.ratings_average}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="userCompleted">
          {showCompleted && (
            <ul>
              {user.completed.map((book, index) => {
                return (
                  <li key={index}>
                    <h3>{book.title}</h3>
                    <img src={book.image} alt={book.title} />
                    <p>{book.ratings_average}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
