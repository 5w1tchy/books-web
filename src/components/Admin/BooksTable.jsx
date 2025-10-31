// Separate component for the books table
const BooksTable = ({ books, onEdit, onDelete }) => {
    if (books.length === 0) {
        return (
            <div className="empty-state">
                <p>წიგნები არ მოიძებნა</p>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="books-table">
                <thead>
                    <tr>
                        <th>სურათი</th>
                        <th>სათაური</th>
                        <th>ავტორები</th>
                        <th>კატეგორიები</th>
                        <th>ქმედებები</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    width={60}
                                    height={80}
                                    style={{ objectFit: "cover", borderRadius: 4 }}
                                />
                            </td>
                            <td>
                                <div className="book-title">{book.title}</div>
                                {book.short && (
                                    <div className="book-short">{book.short}</div>
                                )}
                                {book.coda && (
                                    <div className="book-coda">"{book.coda}"</div>
                                )}
                            </td>
                            <td>{book.authors.join(", ")}</td>
                            <td>{book.categories.join(", ")}</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => onEdit(book)}
                                    title="რედაქტირება"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => onDelete(book.id)}
                                    title="წაშლა"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BooksTable;
