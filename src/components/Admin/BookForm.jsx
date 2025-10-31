// Separate component for the book form modal

const IMAGE_MAX_MB = Number(import.meta.env.VITE_IMAGE_MAX_MB || 10);
const AUDIO_MAX_MB = Number(import.meta.env.VITE_AUDIO_MAX_MB || 200);
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AUDIO_TYPES = ["audio/mpeg", "audio/ogg", "audio/wav"];

const BookForm = ({
    book,
    authorsInput,
    categoriesInput,
    imagePreview,
    onBookChange,
    onAuthorsChange,
    onCategoriesChange,
    onImageChange,
    onAudioChange,
    onSave,
    onCancel,
    isEditing
}) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>{isEditing ? "წიგნის რედაქტირება" : "ახალი წიგნის დამატება"}</h3>

                <label>სათაური *</label>
                <input
                    placeholder="სათაური"
                    value={book.title}
                    onChange={(e) => onBookChange({ ...book, title: e.target.value })}
                    required
                />

                <label>ავტორები (კომა-მით მოყოფილი) *</label>
                <input
                    placeholder="მაგ: J.R.R. Tolkien, George R.R. Martin"
                    value={authorsInput}
                    onChange={(e) => onAuthorsChange(e.target.value)}
                />

                <label>კატეგორიები (კომა-მით მოყოფილი) *</label>
                <input
                    placeholder="მაგ: Fantasy, Adventure"
                    value={categoriesInput}
                    onChange={(e) => onCategoriesChange(e.target.value)}
                />

                <label>მოკლე აღწერა</label>
                <textarea
                    placeholder="მოკლე აღწერა (280 სიმბოლომდე)"
                    value={book.short}
                    onChange={(e) => onBookChange({ ...book, short: e.target.value })}
                    rows={3}
                    maxLength={280}
                />

                <label>სრული აღწერა</label>
                <textarea
                    placeholder="სრული აღწერა"
                    value={book.summary}
                    onChange={(e) => onBookChange({ ...book, summary: e.target.value })}
                    rows={5}
                />

                <label>Coda (ციტატა)</label>
                <textarea
                    placeholder="საუკეთესო ციტატა წიგნიდან"
                    value={book.coda}
                    onChange={(e) => onBookChange({ ...book, coda: e.target.value })}
                    rows={2}
                />

                <label>ყდის სურათი</label>
                <input
                    type="file"
                    accept={IMAGE_TYPES.join(",")}
                    onChange={onImageChange}
                />
                {imagePreview && (
                    <div className="image-preview">
                        <span>Preview:</span>
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}
                <div style={{ fontSize: 12, color: "#666" }}>
                    დაშვებული: jpg/png/webp, მაქს {IMAGE_MAX_MB}MB
                </div>

                <label>აუდიო ფაილი</label>
                <input
                    type="file"
                    accept={AUDIO_TYPES.join(",")}
                    onChange={onAudioChange}
                />
                <div style={{ fontSize: 12, color: "#666" }}>
                    დაშვებული: mp3/ogg/wav, მაქს {AUDIO_MAX_MB}MB
                </div>

                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-btn">
                        გაუქმება
                    </button>
                    <button onClick={onSave} className="save-btn">
                        {isEditing ? "განახლება" : "შექმნა"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookForm;
