import React, { useState, useEffect } from 'react';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [newBook, setNewBook] = useState({
    title: '',
    code: '',
    authors: [],
    categories: [],
    short: '',
    summary: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchAuthors();
  }, [currentPage, searchTerm]);

  const fetchBooks = async () => {
    setLoading(true);
    setApiError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('📚 Fetching books with token:', !!token);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '20',
        ...(searchTerm && { q: searchTerm })
      });

      const url = `https://books-api-7hu5.onrender.com/admin/books?${params}`;
      console.log('🌐 Books URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Books response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Books API Response:', data);
        
        const booksList = data.data || data.books || data.items || [];
        const totalCount = data.total || booksList.length;
        
        setBooks(booksList);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / 20));
      } else {
        const errorText = await response.text();
        console.error('❌ Books API Error:', errorText);
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('💥 Books Fetch Error:', error);
      setApiError('წიგნების ჩატვირთვა ვერ მოხერხდა');
      
      // Demo books with images
      const mockBooks = [
        {
          id: 'book-1',
          code: 'BOOK001',
          title: 'ვეფხისტყაოსანი',
          authors: ['შოთა რუსთაველი'],
          categories: ['კლასიკური ლიტერატურა', 'ქართული პოეზია'],
          short: 'ქართული ლიტერატურის შედევრი',
          summary: 'ეპიკური პოემა XII საუკუნისა...',
          imageUrl: 'https://placehold.co/200x300/3498db/ffffff?text=ვეფხისტყაოსანი',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'book-2',
          code: 'BOOK002', 
          title: 'დედამიწა',
          authors: ['მიხეილ ჯავახიშვილი'],
          categories: ['ქართული პროზა', 'რომანი'],
          short: 'სოციალური რომანი',
          summary: 'გლეხობის ცხოვრების აღწერა...',
          imageUrl: 'https://placehold.co/200x300/e74c3c/ffffff?text=დედამიწა',
          created_at: '2024-01-02T00:00:00Z'
        }
      ];
      
      setBooks(mockBooks);
      setTotal(mockBooks.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://books-api-7hu5.onrender.com/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📂 Categories:', data);
        setAvailableCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Predefined categories as fallback
      setAvailableCategories([
        'კლასიკური ლიტერატურა',
        'რომანი',
        'ფანტასტიკა',
        'მისტერი',
        'რომანტიკა',
        'ტრილერი',
        'სათავგადასავლო',
        'ისტორიული ფიქცია',
        'ბიოგრაფია',
        'აუტობიოგრაფია',
        'ფსიქოლოგია',
        'ფილოსოფია',
        'მეცნიერება',
        'ქართული პოეზია',
        'ქართული პროზა',
        'უცხოური ლიტერატურა',
        'საბავშვო წიგნები',
        'საოჯახო რომანი',
        'კრიმინალური',
        'ფენტეზი'
      ]);
    }
  };

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://books-api-7hu5.onrender.com/admin/authors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✍️ Authors:', data);
        setAvailableAuthors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAvailableAuthors([
        'შოთა რუსთაველი',
        'მიხეილ ჯავახიშვილი', 
        'ილია ჭავჭავაძე',
        'ვაჟა-ფშაველა',
        'ალექსანდრე ყაზბეგი',
        'გალაკტიონ ტაბიძე',
        'აკაკი წერეთელი',
        'ნიკო ლორთქიფანიძე'
      ]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ფაილი ძალიან დიდია. გთხოვთ არჩიეთ 5MB-ზე პატარა ფაილი.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('გთხოვთ არჩიეთ სურათის ფაილი (JPG, PNG, GIF).');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setNewBook(prev => ({ ...prev, imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (categoryValue, isChecked) => {
    if (isChecked) {
      setNewBook(prev => ({
        ...prev,
        categories: [...prev.categories, categoryValue]
      }));
    } else {
      setNewBook(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== categoryValue)
      }));
    }
  };

  const handleCreateBook = async () => {
    if (!newBook.title.trim()) {
      alert('სათაური აუცილებელია');
      return;
    }

    setCreateLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const bookData = {
        title: newBook.title.trim(),
        ...(newBook.code.trim() && { code: newBook.code.trim() }),
        authors: newBook.authors.filter(author => author.trim()),
        categories: newBook.categories,
        ...(newBook.short.trim() && { short: newBook.short.trim() }),
        ...(newBook.summary.trim() && { summary: newBook.summary.trim() }),
        ...(newBook.imageUrl && { imageUrl: newBook.imageUrl })
      };

      console.log('📝 Creating book with data:', bookData);

      const response = await fetch('https://books-api-7hu5.onrender.com/admin/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      console.log('📡 Create book response status:', response.status);
      
      const responseData = await response.json();
      console.log('📊 Create book response data:', responseData);

      if (response.ok) {
        setShowCreateModal(false);
        setNewBook({
          title: '',
          code: '',
          authors: [],
          categories: [],
          short: '',
          summary: '',
          imageUrl: ''
        });
        setImagePreview('');
        await fetchBooks();
        alert('წიგნი წარმატებით შეიქმნა');
        
      } else {
        let errorMessage = 'წიგნის შექმნა ვერ მოხერხდა';
        
        if (responseData.error) {
          errorMessage += ': ' + responseData.error;
        } else if (responseData.message) {
          errorMessage += ': ' + responseData.message;
        }
        
        if (response.status === 409) {
          errorMessage = 'წიგნის კოდი უკვე არსებობს. გამოიყენეთ სხვა კოდი.';
        } else if (response.status === 400) {
          errorMessage = 'არასწორი მონაცემები. შეამოწმეთ ყველა ველი.';
        }
        
        alert(errorMessage);
        console.error('❌ Create book failed:', responseData);
      }
      
    } catch (error) {
      console.error('💥 Create book error:', error);
      alert('შეცდომა წიგნის შექმნისას: ' + error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('დარწმუნებული ხართ, რომ გსურთ ამ წიგნის წაშლა?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://books-api-7hu5.onrender.com/admin/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchBooks();
        alert('წიგნი წაიშალა');
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert('შეცდომა წიგნის წაშლისას');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('შეცდომა წიგნის წაშლისას: ' + error.message);
    }
  };

  const handleArrayInput = (value, field) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setNewBook(prev => ({ ...prev, [field]: items }));
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>წიგნები იტვირთება...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📚 წიგნების მართვა</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>სულ: {total} წიგნი</span>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            + ახალი წიგნი
          </button>
        </div>
      </div>

      {apiError && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⚠️ {apiError}
        </div>
      )}
      
      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="ძებნა (სათაური/ავტორი/კოდი)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '12px 15px',
            width: '400px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Books Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>სურათი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>კოდი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>სათაური</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>ავტორები</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>კატეგორიები</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>შექმნის თარიღი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>ქმედებები</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>
                  <img 
                    src={book.imageUrl || 'https://placehold.co/60x80/f0f0f0/666666?text=No+Image'} 
                    alt={book.title}
                    style={{
                      width: '60px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                  {book.code || '-'}
                </td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{book.title}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>
                  {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || '-'}
                </td>
                <td style={{ padding: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Array.isArray(book.categories) ? book.categories.map((cat, i) => (
                      <span key={i} style={{
                        background: '#e3f2fd',
                        color: '#1976d2',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        {cat}
                      </span>
                    )) : (book.categories || '-')}
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                  {new Date(book.created_at).toLocaleDateString('ka-GE')}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingBook(book)}
                      style={{
                        padding: '6px 12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ შეცვლა
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ წაშლა
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {books.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          color: '#666',
          background: 'white',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          {searchTerm ? 'ძებნის შედეგები ვერ მოიძებნა' : 'წიგნები ვერ მოიძებნა'}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>📚 ახალი წიგნის დამატება</h3>
            
            {/* Image Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                📷 წიგნის სურათი
              </label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      padding: '10px',
                      border: '2px dashed #ddd',
                      borderRadius: '6px',
                      width: '300px',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    მაქსიმალური ზომა: 5MB | ფორმატები: JPG, PNG, GIF
                  </div>
                </div>
                {imagePreview && (
                  <div>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{
                        width: '100px',
                        height: '130px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #28a745'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                📖 სათაური * (აუცილებელია)
              </label>
              <input
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                placeholder="მაგ: ვეფხისტყაოსანი"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Code */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                🏷️ კოდი (ოპციონალური)
              </label>
              <input
                type="text"
                value={newBook.code}
                onChange={(e) => setNewBook(prev => ({ ...prev, code: e.target.value }))}
                placeholder="მაგ: BOOK001 (უნიკალური კოდი)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Authors */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                ✍️ ავტორები
              </label>
              <input
                type="text"
                placeholder="ჩამოწერეთ ავტორები მძიმით გამოყოფილი: შოთა რუსთაველი, მიხეილ ჯავახიშვილი"
                onChange={(e) => handleArrayInput(e.target.value, 'authors')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxSizing: 'border-box'
                }}
              />
              {newBook.authors.length > 0 && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>შერჩეული ავტორები:</strong> {newBook.authors.join(', ')}
                </div>
              )}
            </div>

            {/* Categories - Dropdown Selection */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                📚 კატეგორიები (არჩიეთ რამდენიმე)
              </label>
              <div style={{
                maxHeight: '200px',
                overflow: 'auto',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '10px',
                background: '#fafafa'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '8px'
                }}>
                  {availableCategories.map((category, index) => (
                    <label key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: newBook.categories.includes(category) ? '#e3f2fd' : 'white',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      <input
                        type="checkbox"
                        checked={newBook.categories.includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              {newBook.categories.length > 0 && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#e8f5e9', borderRadius: '4px' }}>
                  <strong>შერჩეული კატეგორიები ({newBook.categories.length}):</strong>
                  <div style={{ marginTop: '4px' }}>
                    {newBook.categories.map((cat, i) => (
                      <span key={i} style={{
                        display: 'inline-block',
                        background: '#28a745',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        margin: '2px'
                      }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Short Description */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                📝 მოკლე აღწერა
              </label>
              <textarea
                value={newBook.short}
                onChange={(e) => setNewBook(prev => ({ ...prev, short: e.target.value }))}
                placeholder="წიგნის მოკლე აღწერა..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  minHeight: '80px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Full Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                📄 სრული აღწერა
              </label>
              <textarea
                value={newBook.summary}
                onChange={(e) => setNewBook(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="წიგნის დეტალური აღწერა..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  minHeight: '120px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setImagePreview('');
                  setNewBook({
                    title: '',
                    code: '',
                    authors: [],
                    categories: [],
                    short: '',
                    summary: '',
                    imageUrl: ''
                  });
                }}
                disabled={createLoading}
                style={{
                  padding: '12px 24px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: createLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                🚫 გაუქმება
              </button>
              <button
                onClick={handleCreateBook}
                disabled={!newBook.title.trim() || createLoading}
                style={{
                  padding: '12px 24px',
                  background: (!newBook.title.trim() || createLoading) ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (!newBook.title.trim() || createLoading) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {createLoading ? '⏳ იქმნება...' : '✅ შექმნა'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;