import React, { useState, useEffect } from "react";

// ეს არის შენს API-ის ტოკენი (JWT)
const API_TOKEN = "შენი_ბიერერ_ტოკენი";

const BooksAdminList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination მაგალითად, უნდა დაემატოს თუ გინდა
  const [page, setPage] = useState(1);
  const size = 20;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3000/admin/books?page=${page}&size=${size}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Map უკეთესი ფორმატისთვის
        const mappedBooks = data.data.map((book) => ({
          id: book.id,
          code: book.code || "–",
          title: book.title || "–",
          summary: book.summary || "–",
          short: book.short || "–",
          authors: book.authors || [],
          categories: book.categories || [],
          created_at: book.created_at || "",
        }));

        setBooks(mappedBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Books Admin List</h1>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <h2>{book.title}</h2>
              <p>
                <strong>Code:</strong> {book.code}
              </p>
              <p>
                <strong>Short Description:</strong> {book.short}
              </p>
              <p>
                <strong>Summary:</strong> {book.summary}
              </p>
              <p>
                <strong>Authors:</strong> {book.authors.join(", ")}
              </p>
              <p>
                <strong>Categories:</strong> {book.categories.join(", ")}
              </p>
              <p>
                <small>Created at: {book.created_at}</small>
              </p>
            </div>
          ))}
        </div>
      )}
      {/* Pagination მაგალითი */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BooksAdminList;
