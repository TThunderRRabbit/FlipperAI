import { useState } from "react";
import "./App.css";

function App() {
  const [bookCollection, setBookCollection] = useState([]);
  const [input, setInput] = useState("");
  const [view, setView] = useState("books");
  const [user, setUser] = useState({
    name: "Flipper",
    wishlist: [],
    completed: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setView("books");
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${input}&limit=4`
      );
      const data = await response.json();
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

  const handleWishlistView = () =>
    setView(view === "wishlist" ? "books" : "wishlist");
  const handleCompletedView = () =>
    setView(view === "completed" ? "books" : "completed");

  return (
    <div className="App">
      <aside className="sidebar">
        <div className="user-account">{user.name}</div>
        <nav className="navigation">
          <button className="wishlist-btn" onClick={handleWishlistView}>
            Wishlist
          </button>
          <button className="completed-btn" onClick={handleCompletedView}>
            Completed
          </button>
        </nav>
      </aside>

      <main className="content">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Search for books..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {view === "books" && bookCollection.length > 0 && (
          <section className="book-list">
            <ul>
              {bookCollection.map((book, index) => (
                <li key={index} className="book-item">
                  <h3 className="book-title">{book.title}</h3>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-image"
                  />
                  <button
                    className="wishlist-add"
                    onClick={() => addToWishList(book)}
                  >
                    Add to Wishlist
                  </button>
                  <p className="book-ratings">
                    Ratings: {book.ratings_average || "N/A"}
                  </p>
                  <label className="book-completed">
                    <input
                      type="checkbox"
                      checked={book.completed}
                      onChange={() => handleChecked(index)}
                    />
                    Mark as Completed
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )}

        {view === "wishlist" && (
          <section className="wishlist">
            <ul>
              {user.wishlist.map((book, index) => (
                <li key={index} className="wishlist-item">
                  <h3 className="wishlist-title">{book.title}</h3>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="wishlist-image"
                  />
                  <p className="wishlist-ratings">
                    {book.ratings_average || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {view === "completed" && (
          <section className="completed">
            <ul>
              {user.completed.map((book, index) => (
                <li key={index} className="completed-item">
                  <h3 className="completed-title">{book.title}</h3>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="completed-image"
                  />
                  <p className="completed-ratings">
                    {book.ratings_average || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
