// src/pages/BookManagement.jsx
import React, { useState, useEffect } from "react";
import "./BookManagement.css"; // ახ. სტილებისთვის

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    authors: [],
    categories: [],
    short: "",
    summary: "",
    coda: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  // Normalize მონაცემები
  const normalizeBookData = (raw) => {
    if (!raw) return {};
    const authorsArray = raw.authors?.length
      ? raw.authors
      : raw.author
      ? Array.isArray(raw.author)
        ? raw.author
        : [raw.author]
      : ["უცნობი ავტორი"];

    const categoriesArray = raw.categories?.length
      ? raw.categories
      : raw.category
      ? Array.isArray(raw.category)
        ? raw.category
        : [raw.category]
      : [];

    return {
      id: raw.id || null,
      title: raw.title || raw.name || "უცნობი სათაური",
      authors: authorsArray,
      categories: categoriesArray,
      short: raw.short || raw.description || raw.short_description || "",
      summary: raw.summary || raw.full_description || raw.content || "",
      coda: raw.coda || raw.quote || raw.best_quote || raw.excerpt || "",
      imageUrl:
        raw.imageUrl || raw.image || "https://placehold.co/60x80/eee/ccc?text=No+Image",
    };
  };

  // მონაცემების წამოღება
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `https://books-api-7hu5.onrender.com/admin/books?page=${page}&size=20${
        searchTerm ? `&q=${searchTerm}` : ""
      }`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const normalizedBooks = (data.data || []).map(normalizeBookData);
        setBooks(normalizedBooks);
        setTotalPages(Math.ceil((data.total || 0) / 20));
      } else throw new Error(data.message || "Error");
    } catch {
      setBooks([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [page, searchTerm]);

  // Edit
  const handleEdit = (book) => {
    setEditing(book);
    setNewBook({
      title: book.title,
      authors: book.authors,
      categories: book.categories,
      short: book.short,
      summary: book.summary,
      coda: book.coda,
      imageUrl: book.imageUrl,
    });
    setImagePreview(book.imageUrl);
    setShowModal(true);
  };

  // Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setNewBook((prev) => ({ ...prev, imageUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save
  const handleSave = async () => {
    if (!newBook.title.trim()) return alert("სათაური აუცილებელია");
    try {
      const token = localStorage.getItem("token");
      const url = editing
        ? `https://books-api-7hu5.onrender.com/admin/books/${editing.id}`
        : "https://books-api-7hu5.onrender.com/admin/books";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });
      if (res.ok) {
        setShowModal(false);
        setEditing(null);
        setNewBook({
          title: "",
          authors: [],
          categories: [],
          short: "",
          summary: "",
          coda: "",
          imageUrl: "",
        });
        fetchBooks();
      } else alert("შეცდომა");
    } catch (e) {
      alert(e.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("წაშლა?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://books-api-7hu5.onrender.com/admin/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading)
    return <div style={{ padding: 50, textAlign: "center" }}>იტვირთება...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>📚 წიგნების მართვა</h2>
        <div>
          <input
            type="text"
            placeholder="ძებნა..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            style={{ padding: 8, marginRight: 10 }}
          />
          <button onClick={() => setShowModal(true)} className="new-btn">+ ახალი წიგნი</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="books-table">
          <thead>
            <tr>
              <th>სურათი</th>
              <th>სათაური / მოკლე / Coda</th>
              <th>ავტორები</th>
              <th>კატეგორიები</th>
              <th>ქმედებები</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td><img src={b.imageUrl} alt={b.title} width={60} height={80} /></td>
                <td>
                  {b.title}
                  <div style={{fontSize:12, color:'#666'}}>{b.short}</div>
                  <div style={{fontSize:12, color:'#007bff'}}>{b.coda}</div>
                </td>
                <td>{b.authors.join(", ")}</td>
                <td>{b.categories.join(", ")}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(b)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(b.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>←</button>
        <span style={{ margin: '0 10px' }}>{page}/{totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <label>სათაური</label>
            <input placeholder="სათაური" value={newBook.title} onChange={e=>setNewBook({...newBook,title:e.target.value})}/>

            <label>ავტორები (კომა-მით მოყოფილი)</label>
            <input placeholder="ავტორები" value={newBook.authors.join(", ")} onChange={e=>setNewBook({...newBook,authors:e.target.value.split(",").map(a=>a.trim())})}/>

            <label>კატეგორიები (კომა-მით მოყოფილი)</label>
            <input placeholder="კატეგორიები" value={newBook.categories.join(", ")} onChange={e=>setNewBook({...newBook,categories:e.target.value.split(",").map(a=>a.trim())})}/>

            <label>მოკლე აღწერა</label>
            <textarea placeholder="მოკლე აღწერა" value={newBook.short} onChange={e=>setNewBook({...newBook,short:e.target.value})} rows={3}></textarea>

            <label>სრული აღწერა</label>
            <textarea placeholder="სრული აღწერა" value={newBook.summary} onChange={e=>setNewBook({...newBook,summary:e.target.value})} rows={5}></textarea>

            <label>Coda</label>
            <textarea placeholder="Coda" value={newBook.coda} onChange={e=>setNewBook({...newBook,coda:e.target.value})} rows={2}></textarea>

            <label>სურათი</label>
            <input type="file" onChange={handleImageChange}/>
            {imagePreview && (
              <div className="image-preview">
                <span>Preview:</span>
                <img src={imagePreview} alt="Preview"/>
              </div>
            )}

            <div className="modal-actions">
              <button onClick={()=>{setShowModal(false); setEditing(null);}}>გაუქმება</button>
              <button onClick={handleSave}>{editing ? "განახლება" : "შექმნა"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
