/**
 * Mengubah URL Supabase Storage biasa menjadi URL dengan fitur Image Transformation.
 * Ini akan meresize gambar secara on-the-fly di server Supabase agar lebih ringan.
 * 
 * @param {string} originalUrl - URL asli dari Supabase Storage
 * @param {number} width - Lebar gambar yang diinginkan dalam pixel
 * @param {number} quality - Kualitas kompresi (1-100)
 * @returns {string} URL yang sudah dioptimasi
 */
export const getOptimizedImageUrl = (originalUrl, width = 600, quality = 80) => {
  if (!originalUrl || typeof originalUrl !== 'string') return originalUrl;
  
  // Hanya proses URL yang berasal dari Supabase Storage
  if (originalUrl.includes('/storage/v1/object/public/')) {
    // Ubah path endpoint untuk render image & tambahkan query parameter
    return originalUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') 
           + `?width=${width}&quality=${quality}`;
  }
  
  return originalUrl;
};
