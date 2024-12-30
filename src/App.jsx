import { useState } from "react";
import "./App.css";

function App() {
  const [bookCollection, setBookCollection] = useState([]);
  const [input, setInput] = useState("");

  const [user, setUser] = useState({
    name: "Carl Landicho",
    myBooks: [],
    wishlist: [],
    completed: [],
  });

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

  const addToWishList = (book) => {
    setUser((prev) => ({
      ...prev,
      wishlist: [...prev.wishlist, book],
    }));
  };

  const [showWishlist, setShowWishlist] = useState(false);
  return (
    <>
      <div className="App">
        <div className="sideBar">
          <div className="userAccount">Carl Landicho</div>
          <div className="userNavigation">
            <div className="myBooks">My Books</div>
            <div
              className="wishList"
              onClick={() => setShowWishlist(!showWishlist)}
            >
              Wishlist
            </div>
            <div className="completed">Completed</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={handleChange} />
          <button>search</button>
        </form>
        <div className="bookList">
          {bookCollection.length > 0 && showWishlist == false && (
            <ul>
              {bookCollection.map((book, index) => {
                return (
                  <li key={index}>
                    <h3>{book.title}</h3>
                    <img src={book.image} />
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
                    <img src={book.image} />
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
