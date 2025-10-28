// File upload utilities with size validation

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (matches server limit)

/**
 * Validates file size before upload
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum size in bytes (default: 10MB)
 * @returns {boolean} - Returns true if valid
 * @throws {Error} - Throws error if file is too large
 */
export function validateFileSize(file, maxSize = MAX_FILE_SIZE) {
    if (!file) {
        throw new Error('No file provided');
    }

    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        throw new Error(
            `File size (${fileSizeMB}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
        );
    }

    return true;
}

/**
 * Formats file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validates multiple files
 * @param {FileList|File[]} files - Files to validate
 * @param {number} maxSize - Maximum size per file
 * @returns {Object} - Validation result with valid/invalid files
 */
export function validateMultipleFiles(files, maxSize = MAX_FILE_SIZE) {
    const fileArray = Array.from(files);
    const valid = [];
    const invalid = [];

    fileArray.forEach(file => {
        try {
            validateFileSize(file, maxSize);
            valid.push(file);
        } catch (error) {
            invalid.push({ file, error: error.message });
        }
    });

    return { valid, invalid };
}

export { MAX_FILE_SIZE };
