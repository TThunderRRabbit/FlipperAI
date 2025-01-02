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
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setView("books");
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${input}&limit=1`
      );
      const data = await response.json();
      console.log(data.docs);
      const newBooks = data.docs.map((book) => {
        const sortedSubjects =
          book.subject?.slice().sort((a, b) => {
            const aCount = book.work_count?.[a] || 0;
            const bCount = book.work_count?.[b] || 0;
            return bCount - aCount;
          }) || [];

        return {
          title: book.title,
          image: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
          ratings_average: book.ratings_average,
          completed: false,
          author_name: book.author_name || [],
          subject: book.subject,
          popularSubject: sortedSubjects.slice(0, 5),
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
  const handleBookDataView = (book) => {
    setSelectedBook(book);
    setView(view === "bookData" ? "books" : "bookData");
    console.log(book.popularSubject);
  };

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

      <main className="mainContent">
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
                <li
                  key={index}
                  className="book-item"
                  onClick={() => handleBookDataView(book)}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-image"
                  />
                  <h3 className="book-title">{book.title}</h3>
                  <h4 className="book-author">
                    {"Author: " +
                      (book.author_name?.map((author) => author).join(", ") ||
                        "not available")}
                  </h4>
                  <p className="book-ratings">
                    Ratings: {Number(book.ratings_average.toFixed(2)) || "N/A"}
                  </p>
                  <button
                    className="wishlist-add"
                    onClick={() => addToWishList(book)}
                  >
                    Add to Wishlist
                  </button>
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
                  <img
                    src={book.image}
                    alt={book.title}
                    className="wishlist-image"
                  />
                  <h3 className="wishlist-title">{book.title}</h3>
                  <p className="wishlist-ratings">
                    Ratings: {Number(book.ratings_average.toFixed(2)) || "N/A"}
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
                  <img
                    src={book.image}
                    alt={book.title}
                    className="completed-image"
                  />
                  <h3 className="completed-title">{book.title}</h3>
                  <p className="completed-ratings">
                    Ratings: {Number(book.ratings_average.toFixed(2)) || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {view === "bookData" && (
          <div className="bookDiv">{selectedBook.title}</div>
        )}
      </main>
    </div>
  );
}

export default App;
