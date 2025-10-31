import { useBookManagement } from "../../hooks/useBookManagement";
import BooksTable from "./BooksTable";
import BookForm from "./BookForm";
import "./BookManagement.css";

const BookManagement = () => {
  const {
    books, loading, searchTerm, page, totalPages, showModal, editing,
    newBook, authorsInput, categoriesInput, imagePreview,
    setSearchTerm, setPage, setNewBook, setAuthorsInput, setCategoriesInput,
    handleEdit, handleCreate, handleSave, handleDelete,
    handleImageChange, handleAudioChange, resetForm,
  } = useBookManagement();

  if (loading) {
    return <div style={{ padding: 50, textAlign: "center" }}>იტვირთება...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2> წიგნების მართვა</h2>
        <div>
          <input
            type="text"
            placeholder="ძებნა..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            style={{ padding: 8, marginRight: 10 }}
          />
          <button onClick={handleCreate} className="new-btn">+ ახალი წიგნი</button>
        </div>
      </div>

      <BooksTable books={books} onEdit={handleEdit} onDelete={handleDelete} />

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}></button>
        <span style={{ margin: "0 10px" }}>{page}/{totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}></button>
      </div>

      {showModal && (
        <BookForm
          book={newBook}
          authorsInput={authorsInput}
          categoriesInput={categoriesInput}
          imagePreview={imagePreview}
          onBookChange={setNewBook}
          onAuthorsChange={setAuthorsInput}
          onCategoriesChange={setCategoriesInput}
          onImageChange={handleImageChange}
          onAudioChange={handleAudioChange}
          onSave={handleSave}
          onCancel={resetForm}
          isEditing={!!editing}
        />
      )}
    </div>
  );
};

export default BookManagement;
