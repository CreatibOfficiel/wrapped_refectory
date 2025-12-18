/**
 * Social Sharing for Wrapped Refectory
 * Generate shareable images and handle sharing
 */

// ============================================
// IMAGE GENERATION
// ============================================

/**
 * Generate a shareable recap card image
 * @param {object} yearData - Year statistics
 * @param {object} classification - AI classification
 * @returns {Promise<string>} - Base64 image data URL
 */
export async function generateShareCard(yearData, classification) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Instagram Story format (1080x1920)
  canvas.width = 1080;
  canvas.height = 1920;
  
  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(0.5, '#2E7D32');
  gradient.addColorStop(1, '#1B5E20');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add decorative circles
  drawDecorativeElements(ctx, canvas);
  
  // Year badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(540, 300, 120, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px "Inter", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('2024', 540, 320);
  
  // Title
  ctx.font = 'bold 56px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Mon Wrapped Refectory', 540, 500);
  
  // AI Title (if available)
  if (yearData.aiTitle) {
    ctx.font = '36px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(yearData.aiTitle, 540, 580);
  }
  
  // Stats cards
  const stats = [
    { label: 'Commandes', value: yearData.totalOrders.toString(), emoji: '🍽️' },
    { label: 'Plats testés', value: yearData.totalUniqueDishes.toString(), emoji: '🍴' },
    { label: 'Dépensé', value: `${yearData.totalSpent.toFixed(0)}€`, emoji: '💰' },
    { label: 'Économisé', value: `${yearData.discountSaved.toFixed(0)}€`, emoji: '🎉' }
  ];
  
  let yOffset = 700;
  stats.forEach((stat, index) => {
    drawStatCard(ctx, 540, yOffset + (index * 180), stat);
  });
  
  // Top dish
  if (yearData.topDishes[0]) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    roundRect(ctx, 100, 1450, 880, 150, 20, true);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px "Inter", "Segoe UI", sans-serif';
    ctx.fillText('Mon plat préféré', 540, 1500);
    
    ctx.font = 'bold 36px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`🏆 ${yearData.topDishes[0].title}`, 540, 1560);
  }
  
  // Refectory branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '24px "Inter", "Segoe UI", sans-serif';
  ctx.fillText('Généré avec ❤️ par Refectory', 540, 1850);
  
  return canvas.toDataURL('image/png', 0.9);
}

/**
 * Draw decorative background elements
 */
function drawDecorativeElements(ctx, canvas) {
  ctx.globalAlpha = 0.1;
  
  // Floating circles
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 60 + 20;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }
  
  ctx.globalAlpha = 1;
}

/**
 * Draw a stat card
 */
function drawStatCard(ctx, x, y, stat) {
  // Card background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  roundRect(ctx, x - 350, y - 60, 700, 140, 20, true);
  
  // Emoji
  ctx.font = '48px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(stat.emoji, x - 300, y + 15);
  
  // Value
  ctx.font = 'bold 56px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(stat.value, x, y + 15);
  
  // Label
  ctx.font = '24px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(stat.label, x, y + 55);
}

/**
 * Draw a rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
}

// ============================================
// SQUARE FORMAT (Instagram Feed)
// ============================================

/**
 * Generate a square format image (1080x1080)
 */
export async function generateSquareCard(yearData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1080;
  canvas.height = 1080;
  
  // Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#4CAF50');
  gradient.addColorStop(1, '#1B5E20');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Decorative elements
  drawDecorativeElements(ctx, canvas);
  
  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 64px "Inter", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Wrapped 2024', 540, 150);
  ctx.font = '36px "Inter", "Segoe UI", sans-serif';
  ctx.fillText('Refectory', 540, 210);
  
  // Main stats in grid
  const gridStats = [
    { value: yearData.totalOrders, label: 'commandes', emoji: '🍽️' },
    { value: yearData.totalUniqueDishes, label: 'plats testés', emoji: '🍴' }
  ];
  
  gridStats.forEach((stat, i) => {
    const x = 270 + (i * 540);
    const y = 450;
    
    ctx.font = '80px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(stat.value.toString(), x, y);
    
    ctx.font = '28px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(stat.label, x, y + 50);
  });
  
  // Top dish
  if (yearData.topDishes[0]) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    roundRect(ctx, 90, 650, 900, 120, 20, true);
    
    ctx.font = '28px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`🏆 Plat préféré: ${yearData.topDishes[0].title}`, 540, 720);
  }
  
  // AI Title
  if (yearData.aiTitle) {
    ctx.font = 'bold 32px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(yearData.aiTitle, 540, 880);
  }
  
  // Branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '22px "Inter", "Segoe UI", sans-serif';
  ctx.fillText('Généré avec ❤️ par Refectory', 540, 1030);
  
  return canvas.toDataURL('image/png', 0.9);
}

// ============================================
// SHARING FUNCTIONS
// ============================================

/**
 * Download the share card as an image
 * @param {string} dataUrl - Base64 image data
 * @param {string} filename - Download filename
 */
export function downloadImage(dataUrl, filename = 'wrapped-refectory-2024.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Copy image to clipboard (if supported)
 * @param {string} dataUrl - Base64 image data
 */
export async function copyImageToClipboard(dataUrl) {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Share via Web Share API (mobile)
 * @param {string} dataUrl - Base64 image data
 * @param {object} options - Share options
 */
export async function shareNative(dataUrl, options = {}) {
  const {
    title = 'Mon Wrapped Refectory 2024',
    text = 'Découvrez mon récap culinaire 2024 ! 🍽️'
  } = options;
  
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }
  
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'wrapped-2024.png', { type: 'image/png' });
    
    await navigator.share({
      title,
      text,
      files: [file]
    });
    
    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Create share buttons HTML
 * @param {string} storyDataUrl - Story format image
 * @param {string} squareDataUrl - Square format image
 * @returns {string} - HTML string
 */
export function createShareButtons(storyDataUrl, squareDataUrl) {
  return `
    <div class="share-buttons flex flex-wrap gap-3 justify-center mt-6">
      <button 
        onclick="window.wrappedShare.downloadStory()"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
      >
        📱 Story Instagram
      </button>
      
      <button 
        onclick="window.wrappedShare.downloadSquare()"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:opacity-90 transition-opacity"
      >
        🖼️ Post carré
      </button>
      
      <button 
        onclick="window.wrappedShare.copyToClipboard()"
        class="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
      >
        📋 Copier l'image
      </button>
      
      ${navigator.share ? `
        <button 
          onclick="window.wrappedShare.nativeShare()"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          📤 Partager
        </button>
      ` : ''}
    </div>
  `;
}

/**
 * Initialize sharing with generated images
 * @param {object} yearData - Year statistics
 */
export async function initSharing(yearData) {
  const storyDataUrl = await generateShareCard(yearData);
  const squareDataUrl = await generateSquareCard(yearData);
  
  // Expose sharing functions globally
  window.wrappedShare = {
    downloadStory: () => downloadImage(storyDataUrl, 'wrapped-story-2024.png'),
    downloadSquare: () => downloadImage(squareDataUrl, 'wrapped-square-2024.png'),
    copyToClipboard: () => copyImageToClipboard(squareDataUrl),
    nativeShare: () => shareNative(storyDataUrl)
  };
  
  return { storyDataUrl, squareDataUrl };
}

export default {
  generateShareCard,
  generateSquareCard,
  downloadImage,
  copyImageToClipboard,
  shareNative,
  createShareButtons,
  initSharing
};
