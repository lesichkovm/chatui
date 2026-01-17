/**
 * Adjust a hex color by a specified amount
 * @param {string} color - Hex color string (with or without #)
 * @param {number} amount - Amount to adjust (-255 to 255)
 * @returns {string} Adjusted hex color string
 */
export function adjustColor(color, amount) {
    return color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
      .replace(/^/, "#");
  }