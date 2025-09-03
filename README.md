# KPH Tools 

A simple **Image Converter** and **Thumbnail A/B Testing Tool** built with Node.js, Express, Multer, and Sharp.  
Works out-of-the-box with minimal setup.

---

## **Features**

### 1. Image Converter
- Upload an image and convert it to **JPG, PNG, or WEBP**.  
- Download the converted image immediately.  
- Minimal setup: just run the server.

### 2. Thumbnail A/B Tester
- Create an experiment for a video with multiple thumbnails.  
- Randomly selects a thumbnail each time.  
- Tracks how many times each thumbnail was chosen.  
- View results to see which thumbnail is “winning.”  

**Note:** This is a **default, simulated A/B tester**. It does not track actual YouTube user clicks but works immediately with any Video ID and thumbnail URLs.

---

## **Getting Started**

### **Prerequisites**
- Node.js >= 24.x  
- npm  

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/KPH.git
   cd KPH
Install dependencies:

bash
Copy code
npm install
Run the Server
bash
Copy code
npm start
Open your browser at http://localhost:3000

You will see the KPH Tools webpage with both Image Converter and Thumbnail A/B Tester.

Usage
Image Converter
Choose an image file.

Select the output format (JPG, PNG, WEBP).

Click Convert → download the converted image.

Thumbnail A/B Tester
Create Experiment

Enter a Video ID (any name you like).

Enter thumbnail URLs or names separated by commas.

Click Create Experiment → experiment is registered.

Get Random Thumbnail

Enter the same Video ID.

Click Get Random Thumbnail → a thumbnail is picked randomly.

Get Results

Enter the same Video ID.

Click Get Results → see how many times each thumbnail was chosen.

Example:


{
  "thumb1.jpg": 2,
  "thumb2.jpg": 5,
  "thumb3.jpg": 3
}
The thumbnail with the highest count is considered the “winner.”

Project Structure

KPH/
 ├─ public/
 │   └─ index.html       # Frontend UI
 ├─ app.js               # Express server + APIs
 ├─ package.json
 └─ package-lock.json
