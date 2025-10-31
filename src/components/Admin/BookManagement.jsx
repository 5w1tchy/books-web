// src/pages/BookManagement.jsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { formatFileSize, validateFileSize } from "../../utils/fileValidation";
import "./BookManagement.css"; // ახ. სტილებისთვის

// Configurable limits (env or defaults)
const IMAGE_MAX_MB = Number(import.meta.env.VITE_IMAGE_MAX_MB || 10);   // 10 MB
const AUDIO_MAX_MB = Number(import.meta.env.VITE_AUDIO_MAX_MB || 200);  // 200 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AUDIO_TYPES = ["audio/mpeg", "audio/ogg", "audio/wav"];

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

  // Temporary input strings for comma-separated fields
  const [authorsInput, setAuthorsInput] = useState("");
  const [categoriesInput, setCategoriesInput] = useState("");

  // Local file state (NOT part of JSON)
  const [imagePreview, setImagePreview] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

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
      const url = `${API_BASE_URL}/admin/books?page=${page}&size=20${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ""
        }`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const normalizedBooks = (data.data || data.items || []).map(normalizeBookData);
        const total =
          data.total ||
          data.total_items ||
          data.totalItems ||
          (data.pagination && data.pagination.total) ||
          0;
        setBooks(normalizedBooks);
        setTotalPages(Math.max(1, Math.ceil(total / 20)));
      } else {
        throw new Error(data.message || "Error");
      }
    } catch {
      setBooks([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setAuthorsInput((book.authors || []).join(", "));
    setCategoriesInput((book.categories || []).join(", "));
    setImagePreview(book.imageUrl || "");
    setCoverFile(null);
    setAudioFile(null);
    setShowModal(true);
  };

  // Type/size guards
  const validateFile = (file, allowedTypes, maxMB, label) => {
    if (!file) return { ok: true };
    if (!allowedTypes.includes(file.type)) {
      return { ok: false, msg: `${label}: დაუშვებელი ტიპი (${file.type})` };
    }

    try {
      validateFileSize(file, maxMB * 1024 * 1024);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        msg: `${label}: ${error.message} (მაქსიმალური: ${formatFileSize(maxMB * 1024 * 1024)})`
      };
    }
  };

  // Cover image choose/preview (stores File separately)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    // validate now to give immediate feedback
    const v = validateFile(file, IMAGE_TYPES, IMAGE_MAX_MB, "სურათი");
    if (!v.ok) {
      alert(v.msg);
      e.target.value = "";
      setCoverFile(null);
      return;
    }
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  // Audio file choose
  const handleAudioChange = (e) => {
    const file = e.target.files?.[0] || null;
    const v = validateFile(file, AUDIO_TYPES, AUDIO_MAX_MB, "აუდიო");
    if (!v.ok) {
      alert(v.msg);
      e.target.value = "";
      setAudioFile(null);
      return;
    }
    setAudioFile(file);
  };

  // Upload helpers for EDIT
  const uploadCover = async (bookId, file, token) => {
    if (!file) return;
    const v = validateFile(file, IMAGE_TYPES, IMAGE_MAX_MB, "სურათი");
    if (!v.ok) throw new Error(v.msg);
    const fd = new FormData();
    fd.append("cover", file);
    const res = await fetch(`${API_BASE_URL}/admin/books/${bookId}/cover`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || data.message || `Cover HTTP ${res.status}`);
    }
  };

  const uploadAudio = async (bookId, file, token) => {
    if (!file) return;
    const v = validateFile(file, AUDIO_TYPES, AUDIO_MAX_MB, "აუდიო");
    if (!v.ok) throw new Error(v.msg);

    console.log("🎵 Starting audio upload for book:", bookId);

    // Direct upload through backend (CORS workaround)
    const fd = new FormData();
    fd.append("audio", file);

    const res = await fetch(`${API_BASE_URL}/admin/books/${bookId}/audio/upload`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || data.message || `Audio upload failed: ${res.status}`);
    }

    console.log("✅ Audio uploaded successfully");
  };

  // Save (Create uses multipart with cover+audio; Edit keeps JSON + optional media uploads)
  const handleSave = async () => {
    if (!newBook.title.trim()) return alert("სათაური აუცილებელია");
    try {
      const token = localStorage.getItem("token");

      if (!editing) {
        // CREATE — multipart/form-data (single step with files)
        // validate files before sending
        const vImg = validateFile(coverFile, IMAGE_TYPES, IMAGE_MAX_MB, "სურათი");
        if (!vImg.ok) throw new Error(vImg.msg);
        const vAud = validateFile(audioFile, AUDIO_TYPES, AUDIO_MAX_MB, "აუდიო");
        if (!vAud.ok) throw new Error(vAud.msg);

        // Convert input strings to arrays
        const authorsArray = authorsInput.split(",").map((a) => a.trim()).filter(Boolean);
        const categoriesArray = categoriesInput.split(",").map((c) => c.trim()).filter(Boolean);

        const fd = new FormData();
        fd.append("title", newBook.title);
        fd.append("short", newBook.short || "");
        fd.append("summary", newBook.summary || "");
        fd.append("coda", newBook.coda || "");
        authorsArray.forEach((a) => fd.append("authors", a));
        categoriesArray.forEach((c) => fd.append("categories", c));
        if (coverFile) fd.append("cover", coverFile);
        if (audioFile) fd.append("audio", audioFile);

        const res = await fetch(`${API_BASE_URL}/admin/books`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }, // no Content-Type
          body: fd,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const errorMsg = data.error || data.message || `HTTP ${res.status}`;
          console.error("❌ Create book failed:", errorMsg, data);
          throw new Error(errorMsg);
        }
        console.log("✅ Book created successfully");
      } else {
        // EDIT — 1) update text JSON
        const url = `${API_BASE_URL}/admin/books/${editing.id}`;
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newBook),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || data.message || `HTTP ${res.status}`);
        }

        // 2) optionally upload media (if user picked files)
        if (coverFile) await uploadCover(editing.id, coverFile, token);
        if (audioFile) await uploadAudio(editing.id, audioFile, token);
      }

      // reset UI
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
      setAuthorsInput("");
      setCategoriesInput("");
      setImagePreview("");
      setCoverFile(null);
      setAudioFile(null);
      fetchBooks();
    } catch (e) {
      alert(e.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("წაშლა?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/admin/books/${id}`, {
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            style={{ padding: 8, marginRight: 10 }}
          />
          <button
            onClick={() => {
              setShowModal(true);
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
              setImagePreview("");
              setCoverFile(null);
              setAudioFile(null);
            }}
            className="new-btn"
          >
            + ახალი წიგნი
          </button>
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
                  <div style={{ fontSize: 12, color: "#666" }}>{b.short}</div>
                  <div style={{ fontSize: 12, color: "#007bff" }}>{b.coda}</div>
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
        <span style={{ margin: "0 10px" }}>{page}/{totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <label>სათაური</label>
            <input
              placeholder="სათაური"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />

            <label>ავტორები (კომა-მით მოყოფილი)</label>
            <input
              placeholder="ავტორები (მაგ: J.R.R. Tolkien, George R.R. Martin)"
              value={authorsInput}
              onChange={(e) => setAuthorsInput(e.target.value)}
            />

            <label>კატეგორიები (კომა-მით მოყოფილი)</label>
            <input
              placeholder="კატეგორიები (მაგ: Fantasy, Adventure)"
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(e.target.value)}
            />

            <label>მოკლე აღწერა</label>
            <textarea
              placeholder="მოკლე აღწერა"
              value={newBook.short}
              onChange={(e) => setNewBook({ ...newBook, short: e.target.value })}
              rows={3}
            />

            <label>სრული აღწერა</label>
            <textarea
              placeholder="სრული აღწერა"
              value={newBook.summary}
              onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })}
              rows={5}
            />

            <label>Coda</label>
            <textarea
              placeholder="Coda"
              value={newBook.coda}
              onChange={(e) => setNewBook({ ...newBook, coda: e.target.value })}
              rows={2}
            />

            <label>სურათი</label>
            <input type="file" accept={IMAGE_TYPES.join(",")} onChange={handleImageChange} />
            {imagePreview && (
              <div className="image-preview">
                <span>Preview:</span>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            <div style={{ fontSize: 12, color: "#666" }}>
              {`დაშვებული: jpg/png/webp, მაქს ${IMAGE_MAX_MB}MB`}
            </div>

            <label>აუდიო</label>
            <input type="file" accept={AUDIO_TYPES.join(",")} onChange={handleAudioChange} />
            <div style={{ fontSize: 12, color: "#666" }}>
              {`დაშვებული: mp3/ogg/wav, მაქს ${AUDIO_MAX_MB}MB`}
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setAuthorsInput("");
                  setCategoriesInput("");
                  setNewBook({
                    title: "",
                    authors: [],
                    categories: [],
                    short: "",
                    summary: "",
                    coda: "",
                    imageUrl: "",
                  });
                  setImagePreview("");
                  setCoverFile(null);
                  setAudioFile(null);
                }}
              >
                გაუქმება
              </button>
              <button onClick={handleSave}>{editing ? "განახლება" : "შექმნა"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
