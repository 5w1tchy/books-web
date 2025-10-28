// Retry utilities for handling rate limits and transient errors

/**
 * Retry a failed request with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - Result of the function
 */
export async function retryWithBackoff(fn, options = {}) {
    const {
        maxRetries = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        backoffMultiplier = 2,
        retryOnStatus = [429, 503], // Rate limit and service unavailable
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on certain errors
            if (error.status && !retryOnStatus.includes(error.status)) {
                throw error;
            }

            // Don't retry if we've exhausted attempts
            if (attempt === maxRetries) {
                throw error;
            }

            // Wait before retrying
            console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
            await sleep(delay);

            // Exponential backoff
            delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
    }

    throw lastError;
}

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default: 15000)
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(url, options = {}, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

/**
 * Rate limit aware fetch wrapper
 * @param {string} url - URL to fetch
 * @param {Object} fetchOptions - Fetch options
 * @param {Object} retryOptions - Retry options
 * @returns {Promise<Response>}
 */
export async function rateLimitAwareFetch(url, fetchOptions = {}, retryOptions = {}) {
    const fetchFn = () => fetchWithTimeout(url, fetchOptions);

    try {
        return await retryWithBackoff(fetchFn, {
            maxRetries: 2,
            initialDelay: 2000,
            retryOnStatus: [429],
            ...retryOptions,
        });
    } catch (error) {
        if (error.status === 429) {
            throw new Error(
                'Rate limit exceeded. Please wait a moment before trying again.'
            );
        }
        throw error;
    }
}
