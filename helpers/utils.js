const pdf = require("html-pdf");
const nodeHtmlToImage = require("node-html-to-image");

// Function to convert HTML to PDF using html-pdf
async function htmlToPdf(htmlContent, options = { format: "A4" }) {
  return new Promise((resolve, reject) => {
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
}

// Function to convert HTML to PNG using node-html-to-image
async function htmlToPng(htmlContent) {
  try {
    const imageBuffer = await nodeHtmlToImage({
      html: htmlContent,
      encoding: "buffer", // Return the image as a buffer
    });
    return imageBuffer;
  } catch (error) {
    console.error("Error generating PNG:", error);
    throw error;
  }
}

// Function to generate a random string
function generateRandomString({ length, lettersLower, lettersUpper, numbers }) {
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  let charPool = "";

  if (lettersLower) charPool += lowerChars;
  if (lettersUpper) charPool += upperChars;
  if (numbers) charPool += numberChars;

  if (!charPool) {
    throw new Error("At least one character type must be selected.");
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    result += charPool[randomIndex];
  }
  return result;
}

// Function to transform an array into an object with random string values
function transformArrayToObject(array) {
  return array.reduce((acc, item) => {
    const { tagName, ...rest } = item;
    acc[tagName] = generateRandomString(rest);
    return acc;
  }, {});
}

// Function to replace dynamic placeholders in content
function replaceDynamicPlaceholders(content, data) {
  for (const key in data) {
    const pattern = new RegExp(`{{${key}}}`, "g");
    content = content?.replace(pattern, data[key]);
  }
  return content;
}

// Export the functions
module.exports = {
  htmlToPdf,
  htmlToPng,
  generateRandomString,
  transformArrayToObject,
  replaceDynamicPlaceholders,
};
