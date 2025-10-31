// Custom hook for book management logic
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { validateFileSize } from "../utils/fileValidation";

const IMAGE_MAX_MB = Number(import.meta.env.VITE_IMAGE_MAX_MB || 10);
const AUDIO_MAX_MB = Number(import.meta.env.VITE_AUDIO_MAX_MB || 200);
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AUDIO_TYPES = ["audio/mpeg", "audio/ogg", "audio/wav"];

const INITIAL_BOOK_STATE = {
    title: "",
    authors: [],
    categories: [],
    short: "",
    summary: "",
    coda: "",
    imageUrl: "",
};

export const useBookManagement = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [newBook, setNewBook] = useState(INITIAL_BOOK_STATE);
    const [authorsInput, setAuthorsInput] = useState("");
    const [categoriesInput, setCategoriesInput] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);

    // Normalize book data from API
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
            imageUrl: raw.imageUrl || raw.image || "https://placehold.co/60x80/eee/ccc?text=No+Image",
        };
    };

    // Fetch books from API
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
            const url = `${API_BASE_URL}/admin/books?page=${page}&size=20${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ""
                }`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (res.ok) {
                const normalizedBooks = (data.data || data.items || []).map(normalizeBookData);
                const total = data.total || data.total_items || data.totalItems || 0;
                setBooks(normalizedBooks);
                setTotalPages(Math.max(1, Math.ceil(total / 20)));
            } else {
                throw new Error(data.message || "Error fetching books");
            }
        } catch (error) {
            console.error("Failed to fetch books:", error);
            setBooks([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Validate file type and size
    const validateFile = (file, allowedTypes, maxMB, label) => {
        if (!file) return { ok: true };

        if (!allowedTypes.includes(file.type)) {
            return { ok: false, msg: `${label}: დაუშვებელი ტიპი (${file.type})` };
        }

        try {
            validateFileSize(file, maxMB * 1024 * 1024);
            return { ok: true };
        } catch (error) {
            return { ok: false, msg: `${label}: ${error.message}` };
        }
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        const validation = validateFile(file, IMAGE_TYPES, IMAGE_MAX_MB, "სურათი");

        if (!validation.ok) {
            alert(validation.msg);
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

    // Handle audio file selection
    const handleAudioChange = (e) => {
        const file = e.target.files?.[0] || null;
        const validation = validateFile(file, AUDIO_TYPES, AUDIO_MAX_MB, "აუდიო");

        if (!validation.ok) {
            alert(validation.msg);
            e.target.value = "";
            setAudioFile(null);
            return;
        }

        setAudioFile(file);
    };

    // Upload cover image for existing book
    const uploadCover = async (bookId, file, token) => {
        if (!file) return;

        const validation = validateFile(file, IMAGE_TYPES, IMAGE_MAX_MB, "სურათი");
        if (!validation.ok) throw new Error(validation.msg);

        const fd = new FormData();
        fd.append("cover", file);

        const res = await fetch(`${API_BASE_URL}/admin/books/${bookId}/cover`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || data.message || `Cover upload failed`);
        }
    };

    // Upload audio for existing book
    const uploadAudio = async (bookId, file, token) => {
        if (!file) return;

        const validation = validateFile(file, AUDIO_TYPES, AUDIO_MAX_MB, "აუდიო");
        if (!validation.ok) throw new Error(validation.msg);

        const fd = new FormData();
        fd.append("audio", file);

        const res = await fetch(`${API_BASE_URL}/admin/books/${bookId}/audio/upload`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || data.message || `Audio upload failed`);
        }
    };

    // Reset form state
    const resetForm = () => {
        setShowModal(false);
        setEditing(null);
        setNewBook(INITIAL_BOOK_STATE);
        setAuthorsInput("");
        setCategoriesInput("");
        setImagePreview("");
        setCoverFile(null);
        setAudioFile(null);
    };

    // Open edit modal
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

    // Open create modal
    const handleCreate = () => {
        resetForm();
        setShowModal(true);
    };

    // Save book (create or update)
    const handleSave = async () => {
        if (!newBook.title.trim()) {
            alert("სათაური აუცილებელია");
            return;
        }

        try {
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

            if (!editing) {
                // CREATE - multipart with files
                const vImg = validateFile(coverFile, IMAGE_TYPES, IMAGE_MAX_MB, "სურათი");
                if (!vImg.ok) throw new Error(vImg.msg);

                const vAud = validateFile(audioFile, AUDIO_TYPES, AUDIO_MAX_MB, "აუდიო");
                if (!vAud.ok) throw new Error(vAud.msg);

                const authorsArray = authorsInput.split(",").map((a) => a.trim()).filter(Boolean);
                const categoriesArray = categoriesInput.split(",").map((c) => c.trim()).filter(Boolean);

                if (authorsArray.length === 0) {
                    throw new Error("მიუთითეთ მინიმუმ ერთი ავტორი");
                }

                if (categoriesArray.length === 0) {
                    throw new Error("მიუთითეთ მინიმუმ ერთი კატეგორია");
                }

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
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || data.message || `HTTP ${res.status}`);
                }
            } else {
                // UPDATE - JSON + optional file uploads
                const res = await fetch(`${API_BASE_URL}/admin/books/${editing.id}`, {
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

                // Upload new files if selected
                if (coverFile) await uploadCover(editing.id, coverFile, token);
                if (audioFile) await uploadAudio(editing.id, audioFile, token);
            }

            resetForm();
            fetchBooks();
        } catch (error) {
            alert(error.message);
        }
    };

    // Delete book
    const handleDelete = async (id) => {
        if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ წიგნის წაშლა?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
            const res = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error("Failed to delete book");
            }

            fetchBooks();
        } catch (error) {
            alert(error.message);
        }
    };

    return {
        // State
        books,
        loading,
        searchTerm,
        page,
        totalPages,
        showModal,
        editing,
        newBook,
        authorsInput,
        categoriesInput,
        imagePreview,

        // State setters
        setSearchTerm,
        setPage,
        setNewBook,
        setAuthorsInput,
        setCategoriesInput,

        // Actions
        handleEdit,
        handleCreate,
        handleSave,
        handleDelete,
        handleImageChange,
        handleAudioChange,
        resetForm,
    };
};
