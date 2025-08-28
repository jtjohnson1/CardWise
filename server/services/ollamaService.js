const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class OllamaService {
  constructor() {
    this.ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'llava:latest';
    console.log(`[OLLAMA] Initialized with host: ${this.ollamaHost}, model: ${this.ollamaModel}`);
  }

  /**
   * Test connection to Ollama
   */
  async testConnection() {
    try {
      console.log('[OLLAMA] Testing connection to Ollama...');
      const response = await axios.get(`${this.ollamaHost}/api/tags`, {
        timeout: 5000
      });
      console.log('[OLLAMA] Connection successful, available models:', response.data.models?.map(m => m.name));
      return true;
    } catch (error) {
      console.error('[OLLAMA] Connection failed:', error.message);
      return false;
    }
  }

  /**
   * Analyze a card image using Ollama
   */
  async analyzeCardImage(imagePath) {
    try {
      console.log(`[OLLAMA] Analyzing card image: ${imagePath}`);
      
      // Read and encode image
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const prompt = `Analyze this trading card image and extract the following information in JSON format:
{
  "playerName": "player's full name",
  "sport": "sport type (Baseball, Basketball, Football, Hockey, etc.)",
  "year": "card year as number",
  "manufacturer": "card manufacturer/brand",
  "setName": "set or product name",
  "cardNumber": "card number",
  "isRookieCard": "true if rookie card, false otherwise",
  "isAutograph": "true if autographed, false otherwise",
  "isMemorabilia": "true if contains memorabilia/patch, false otherwise",
  "condition": {
    "centering": "rate 1-10",
    "corners": "rate 1-10", 
    "edges": "rate 1-10",
    "surface": "rate 1-10",
    "overall": "Poor, Fair, Good, Very Good, Excellent, Near Mint, Mint, or Gem Mint"
  },
  "estimatedValue": "estimated value in dollars as number",
  "confidence": "confidence level 0-1"
}

Only return valid JSON, no other text.`;

      const response = await axios.post(`${this.ollamaHost}/api/generate`, {
        model: this.ollamaModel,
        prompt: prompt,
        images: [base64Image],
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9
        }
      }, {
        timeout: 60000 // 60 second timeout for AI processing
      });

      console.log(`[OLLAMA] Raw response for ${imagePath}:`, response.data.response);

      // Parse the JSON response
      let cardData;
      try {
        // Clean up the response - sometimes Ollama adds extra text
        let jsonStr = response.data.response.trim();
        
        // Find JSON object in response
        const jsonStart = jsonStr.indexOf('{');
        const jsonEnd = jsonStr.lastIndexOf('}') + 1;
        
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          jsonStr = jsonStr.substring(jsonStart, jsonEnd);
        }
        
        cardData = JSON.parse(jsonStr);
        console.log(`[OLLAMA] Parsed card data for ${imagePath}:`, cardData);
        
      } catch (parseError) {
        console.error(`[OLLAMA] Failed to parse JSON response for ${imagePath}:`, parseError.message);
        console.error(`[OLLAMA] Raw response was:`, response.data.response);
        
        // Return default data if parsing fails
        cardData = {
          playerName: 'Unknown Player',
          sport: 'Unknown',
          year: new Date().getFullYear(),
          manufacturer: 'Unknown',
          setName: 'Unknown Set',
          cardNumber: '1',
          isRookieCard: false,
          isAutograph: false,
          isMemorabilia: false,
          condition: {
            centering: 5,
            corners: 5,
            edges: 5,
            surface: 5,
            overall: 'Good'
          },
          estimatedValue: 1,
          confidence: 0.1
        };
      }

      return cardData;

    } catch (error) {
      console.error(`[OLLAMA] Error analyzing image ${imagePath}:`, error.message);
      throw error;
    }
  }

  /**
   * Process a folder of card images
   */
  async processCardFolder(folderPath, progressCallback) {
    try {
      console.log(`[OLLAMA] Processing card folder: ${folderPath}`);
      
      // Check if folder exists
      try {
        await fs.access(folderPath);
      } catch (error) {
        throw new Error(`Folder not found: ${folderPath}`);
      }

      // Read folder contents
      const files = await fs.readdir(folderPath);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|bmp)$/i.test(file)
      );

      console.log(`[OLLAMA] Found ${imageFiles.length} image files in ${folderPath}`);

      if (imageFiles.length === 0) {
        throw new Error('No image files found in the specified folder');
      }

      const results = [];
      let processed = 0;

      for (const imageFile of imageFiles) {
        try {
          const imagePath = path.join(folderPath, imageFile);
          console.log(`[OLLAMA] Processing image ${processed + 1}/${imageFiles.length}: ${imageFile}`);
          
          const cardData = await this.analyzeCardImage(imagePath);
          
          // Add image paths
          cardData.frontImage = imagePath;
          cardData.backImage = imagePath; // For now, use same image for both
          cardData.lotNumber = path.basename(folderPath);
          
          results.push({
            success: true,
            imageFile,
            cardData
          });

          processed++;
          
          // Call progress callback if provided
          if (progressCallback) {
            progressCallback(processed, imageFiles.length);
          }

        } catch (error) {
          console.error(`[OLLAMA] Failed to process ${imageFile}:`, error.message);
          results.push({
            success: false,
            imageFile,
            error: error.message
          });
          processed++;
          
          if (progressCallback) {
            progressCallback(processed, imageFiles.length);
          }
        }
      }

      console.log(`[OLLAMA] Completed processing ${folderPath}. Success: ${results.filter(r => r.success).length}, Failed: ${results.filter(r => !r.success).length}`);
      
      return results;

    } catch (error) {
      console.error(`[OLLAMA] Error processing folder ${folderPath}:`, error.message);
      throw error;
    }
  }
}

module.exports = new OllamaService();