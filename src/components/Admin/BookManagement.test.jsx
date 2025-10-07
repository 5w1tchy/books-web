// src/components/Admin/BookManagement.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookManagement from './BookManagement';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock FileReader for image upload tests
global.FileReader = class {
  readAsDataURL = jest.fn(() => {
    this.onload({ target: { result: 'data:image/jpeg;base64,mockImageData' } });
  });
};

describe('BookManagement Component', () => {
  const mockToken = 'mock-jwt-token';
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    
    // Default successful API responses
    fetch.mockImplementation((url) => {
      if (url.includes('/admin/books')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: 'book-1',
                code: 'BOOK001',
                title: 'ვეფხისტყაოსანი',
                authors: ['შოთა რუსთაველი'],
                categories: ['კლასიკური ლიტერატურა'],
                short: 'ქართული ლიტერატურის შედევრი',
                imageUrl: 'test-image.jpg',
                created_at: '2024-01-01T00:00:00Z'
              }
            ],
            total: 1
          })
        });
      }
      
      if (url.includes('/admin/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: ['კლასიკური ლიტერატურა', 'რომანი', 'ფანტასტიკა']
          })
        });
      }
      
      if (url.includes('/admin/authors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: ['შოთა რუსთაველი', 'მიხეილ ჯავახიშვილი']
          })
        });
      }
      
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  describe('Component Rendering', () => {
    test('renders loading state initially', () => {
      render(<BookManagement />);
      expect(screen.getByText('წიგნები იტვირთება...')).toBeInTheDocument();
    });

    test('renders main heading and create button', async () => {
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('📚 წიგნების მართვა')).toBeInTheDocument();
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
    });

    test('renders search input', async () => {
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('ძებნა (სათაური/ავტორი/კოდი)...')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches and displays books successfully', async () => {
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('ვეფხისტყაოსანი')).toBeInTheDocument();
        expect(screen.getByText('შოთა რუსთაველი')).toBeInTheDocument();
        expect(screen.getByText('BOOK001')).toBeInTheDocument();
      });
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/books'),
        expect.objectContaining({
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        })
      );
    });

    test('handles API error and shows fallback data', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('წიგნების ჩატვირთვა ვერ მოხერხდა')).toBeInTheDocument();
        // Should show demo data
        expect(screen.getByText('ვეფხისტყაოსანი')).toBeInTheDocument();
      });
    });

    test('fetches categories and authors on mount', async () => {
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admin/categories'),
          expect.any(Object)
        );
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admin/authors'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Search Functionality', () => {
    test('updates search term and triggers new fetch', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('ძებნა (სათაური/ავტორი/კოდი)...')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText('ძებნა (სათაური/ავტორი/კოდი)...');
      
      await user.type(searchInput, 'ვეფხისტყაოსანი');
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('q=ვეფხისტყაოსანი'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Create Book Modal', () => {
    test('opens create modal when button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      expect(screen.getByText('📚 ახალი წიგნის დამატება')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('მაგ: ვეფხისტყაოსანი')).toBeInTheDocument();
    });

    test('closes modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      await user.click(screen.getByText('🚫 გაუქმება'));
      
      expect(screen.queryByText('📚 ახალი წიგნის დამატება')).not.toBeInTheDocument();
    });

    test('validates required title field', async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      await user.click(screen.getByText('✅ შექმნა'));
      
      expect(window.alert).toHaveBeenCalledWith('სათაური აუცილებელია');
    });

    test('handles form input changes', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      const titleInput = screen.getByPlaceholderText('მაგ: ვეფხისტყაოსანი');
      const codeInput = screen.getByPlaceholderText('მაგ: BOOK001 (უნიკალური კოდი)');
      
      await user.type(titleInput, 'ახალი წიგნი');
      await user.type(codeInput, 'NEW001');
      
      expect(titleInput).toHaveValue('ახალი წიგნი');
      expect(codeInput).toHaveValue('NEW001');
    });
  });

  describe('Category Selection', () => {
    test('handles category checkbox selection', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      await waitFor(() => {
        expect(screen.getByText('კლასიკური ლიტერატურა')).toBeInTheDocument();
      });
      
      const categoryCheckbox = screen.getByRole('checkbox', { name: /კლასიკური ლიტერატურა/ });
      await user.click(categoryCheckbox);
      
      expect(categoryCheckbox).toBeChecked();
      expect(screen.getByText('შერჩეული კატეგორიები (1):')).toBeInTheDocument();
    });
  });

  describe('Image Upload', () => {
    test('handles image file selection', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByRole('file');
      
      await user.upload(fileInput, file);
      
      expect(fileInput.files[0]).toBe(file);
    });

    test('validates file size limit', async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      // Create file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByRole('file');
      
      await user.upload(fileInput, largeFile);
      
      expect(window.alert).toHaveBeenCalledWith('ფაილი ძალიან დიდია. გთხოვთ არჩიეთ 5MB-ზე პატარა ფაილი.');
    });
  });

  describe('Book Creation', () => {
    test('creates book successfully with valid data', async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();
      
      fetch.mockImplementationOnce((url, options) => {
        if (options.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'new-book-id' })
          });
        }
        return fetch(url, options);
      });
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      const titleInput = screen.getByPlaceholderText('მაგ: ვეფხისტყაოსანი');
      await user.type(titleInput, 'ტესტ წიგნი');
      
      await user.click(screen.getByText('✅ შექმნა'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admin/books'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mockToken}`
            }),
            body: expect.stringContaining('ტესტ წიგნი')
          })
        );
        expect(window.alert).toHaveBeenCalledWith('წიგნი წარმატებით შეიქმნა');
      });
    });

    test('handles book creation error', async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();
      
      fetch.mockImplementationOnce((url, options) => {
        if (options.method === 'POST') {
          return Promise.resolve({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ error: 'Validation failed' })
          });
        }
        return fetch(url, options);
      });
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      const titleInput = screen.getByPlaceholderText('მაგ: ვეფხისტყაოსანი');
      await user.type(titleInput, 'ტესტ წიგნი');
      
      await user.click(screen.getByText('✅ შექმნა'));
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('არასწორი მონაცემები. შეამოწმეთ ყველა ველი.');
      });
    });
  });

  describe('Book Deletion', () => {
    test('deletes book with confirmation', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn(() => true);
      window.alert = jest.fn();
      
      fetch.mockImplementationOnce((url, options) => {
        if (options.method === 'DELETE') {
          return Promise.resolve({ ok: true });
        }
        return fetch(url, options);
      });
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('🗑️ წაშლა')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('🗑️ წაშლა'));
      
      expect(window.confirm).toHaveBeenCalledWith('დარწმუნებული ხართ, რომ გსურთ ამ წიგნის წაშლა?');
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admin/books/book-1'),
          expect.objectContaining({
            method: 'DELETE',
            headers: expect.objectContaining({
              'Authorization': `Bearer ${mockToken}`
            })
          })
        );
        expect(window.alert).toHaveBeenCalledWith('წიგნი წაიშალა');
      });
    });

    test('cancels deletion when user declines confirmation', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn(() => false);
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('🗑️ წაშლა')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('🗑️ წაშლა'));
      
      expect(window.confirm).toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('DELETE'),
        expect.any(Object)
      );
    });
  });

  describe('Author Input Handling', () => {
    test('parses comma-separated authors correctly', async () => {
      const user = userEvent.setup();
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      const authorsInput = screen.getByPlaceholderText(/ჩამოწერეთ ავტორები მძიმით გამოყოფილი/);
      await user.type(authorsInput, 'ავტორი 1, ავტორი 2, ავტორი 3');
      
      expect(screen.getByText('შერჩეული ავტორები: ავტორი 1, ავტორი 2, ავტორი 3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('displays API error message', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText(/წიგნების ჩატვირთვა ვერ მოხერხდა/)).toBeInTheDocument();
      });
    });

    test('handles unauthorized access', async () => {
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          status: 401,
          text: () => Promise.resolve('Unauthorized')
        })
      );
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText(/წიგნების ჩატვირთვა ვერ მოხერხდა/)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    test('shows loading state during book creation', async () => {
      const user = userEvent.setup();
      
      // Mock a slow API response
      fetch.mockImplementationOnce((url, options) => {
        if (options.method === 'POST') {
          return new Promise(() => {}); // Never resolves
        }
        return fetch(url, options);
      });
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('+ ახალი წიგნი')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('+ ახალი წიგნი'));
      
      const titleInput = screen.getByPlaceholderText('მაგ: ვეფხისტყაოსანი');
      await user.type(titleInput, 'ტესტ წიგნი');
      
      await user.click(screen.getByText('✅ შექმნა'));
      
      expect(screen.getByText('⏳ იქმნება...')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    test('displays empty state when no books found', async () => {
      fetch.mockImplementationOnce((url) => {
        if (url.includes('/admin/books')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [], total: 0 })
          });
        }
        return fetch(url);
      });
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByText('წიგნები ვერ მოიძებნა')).toBeInTheDocument();
      });
    });

    test('displays search empty state', async () => {
      const user = userEvent.setup();
      
      fetch.mockImplementation((url) => {
        if (url.includes('q=nonexistent')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: [], total: 0 })
          });
        }
        return fetch(url);
      });
      
      render(<BookManagement />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('ძებნა (სათაური/ავტორი/კოდი)...')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText('ძებნა (სათაური/ავტორი/კოდი)...');
      await user.type(searchInput, 'nonexistent');
      
      await waitFor(() => {
        expect(screen.getByText('ძებნის შედეგები ვერ მოიძებნა')).toBeInTheDocument();
      });
    });
  });
});