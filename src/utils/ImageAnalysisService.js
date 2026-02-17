
// Social Media Image Standards (2025/2026 specs)
export const SOCIAL_SPECS = {
    instagram: {
        feed: { width: 1080, height: 1080, aspect: 1, label: 'Instagram Square (1:1)' },
        portrait: { width: 1080, height: 1350, aspect: 4 / 5, label: 'Instagram Portrait (4:5)' },
        story: { width: 1080, height: 1920, aspect: 9 / 16, label: 'Instagram Story (9:16)' }
    },
    facebook: {
        feed: { width: 1200, height: 630, aspect: 1.91, label: 'Facebook Link/Feed (1.91:1)' },
        square: { width: 1200, height: 1200, aspect: 1, label: 'Facebook Square (1:1)' },
        story: { width: 1080, height: 1920, aspect: 9 / 16, label: 'Facebook Story (9:16)' }
    },
    linkedin: {
        feed: { width: 1200, height: 627, aspect: 1.91, label: 'LinkedIn Post (1.91:1)' },
        square: { width: 1200, height: 1200, aspect: 1, label: 'LinkedIn Square (1:1)' }
    },
    tiktok: {
        video: { width: 1080, height: 1920, aspect: 9 / 16, label: 'TikTok Video (9:16)' }
    }
};

/**
 * Analyzes an image file to check if it meets social media best practices.
 * @param {File} file - The image file object
 * @returns {Promise<Object>} - Analysis results { width, height, aspect, warnings }
 */
export const analyzeImage = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const aspect = width / height;
            let warnings = [];
            let recommended = [];

            // General Low Resolution Check
            if (width < 600 || height < 600) {
                warnings.push("Image resolution is low. It may look pixelated on retina displays.");
            }

            // Aspect Ratio Classification
            const isSquare = Math.abs(aspect - 1) < 0.05;
            const isLandscape = aspect > 1.2;
            const isPortrait = aspect < 0.85;

            // Generate recommendations based on dimensions
            if (isSquare) {
                recommended.push(SOCIAL_SPECS.instagram.feed);
                recommended.push(SOCIAL_SPECS.linkedin.square);
            } else if (isPortrait) {
                recommended.push(SOCIAL_SPECS.instagram.portrait);
                recommended.push(SOCIAL_SPECS.tiktok.video);
            } else if (isLandscape) {
                recommended.push(SOCIAL_SPECS.facebook.feed);
                recommended.push(SOCIAL_SPECS.linkedin.feed);
            }

            URL.revokeObjectURL(objectUrl);

            resolve({
                width,
                height,
                aspect,
                warnings,
                recommended
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load image for analysis."));
        };

        img.src = objectUrl;
    });
};

/**
 * Resizes and/or crops an image using a canvas.
 * @param {string} imageSrc - The source URL of the image
 * @param {Object} cropArea - { x, y, width, height } in percent (0-1) or pixels
 * @param {number} targetWidth - Desired output width
 * @param {number} targetHeight - Desired output height
 * @returns {Promise<Blob>} - Resulting blob
 */
export const processImage = async (imageSrc, cropArea, targetWidth, targetHeight) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');

            // Draw image to canvas with optional cropping
            // Simple resize for now if no complex crop provided
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };
        img.onerror = reject;
        img.src = imageSrc;
    });
};
