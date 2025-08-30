import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://books-api-7hu5.onrender.com/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>იტვირთება წიგნი...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{book.title}</h1>
      <p>ავტორი: {book.author}</p>
      <p>კატეგორიები: {book.category_slugs.join(", ")}</p>
      <img src={book.imageUrl || "https://placehold.co/300x450/eee/ccc?text=No%20Image"} alt={book.title} />
    </div>
  );
}

export default BookDetails;
