const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;
const EXCEL_FILE = 'reports.xlsx';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize Excel file if it doesn't exist
function initExcel() {
  if (!fs.existsSync(EXCEL_FILE)) {
    console.log("Initializing reports.xlsx...");
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["ID", "Headline", "Platform", "Description", "Image", "URL", "Location", "Status", "Date", "Name", "Lat", "Lng"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, EXCEL_FILE);
  }
}

initExcel();

function readExcel() {
  const file = XLSX.readFile(EXCEL_FILE);
  const sheet = file.Sheets['Reports'];
  return XLSX.utils.sheet_to_json(sheet);
}

// Write to Excel with a retry mechanism if the file is locked (e.g., open in Microsoft Excel)
async function writeExcelWithRetry(data, retries = 5, delayMs = 1000) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');

  for (let i = 0; i < retries; i++) {
    try {
      XLSX.writeFile(wb, EXCEL_FILE);
      return true; // Success
    } catch (error) {
      if (error.code === 'EBUSY') {
        console.warn(`Excel Sync: File locked. Retrying in ${delayMs}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.error("Excel Sync Error:", error.message);
        throw error;
      }
    }
  }
  // If we reach here, all retries failed
  throw new Error('EBUSY'); 
}

// API Endpoints
app.get('/api/reports', (req, res) => {
  try {
    const data = readExcel();
    res.json(data);
  } catch (error) {
    console.error("Error reading Excel:", error.message);
    res.status(500).json({ error: "Failed to read excel file from disk" });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { Headline, Platform, Description } = req.body;
    if (!Headline || !Platform || !Description) {
      return res.status(400).json({ error: "Missing required fields: Headline, Platform, and Description" });
    }

    const data = readExcel();
    const newReport = {
      ID: Date.now(),
      Date: new Date().toLocaleDateString(),
      Status: 'Pending',
      ...req.body
    };
    data.push(newReport);
    
    await writeExcelWithRetry(data);
    
    res.status(201).json(newReport);
  } catch (error) {
    if (error.message === 'EBUSY') {
      res.status(409).json({ error: "The Excel database is currently open in another program (like Microsoft Excel). Please close it so your report can be saved." });
    } else {
      console.error(error);
      res.status(500).json({ error: "Failed to save report" });
    }
  }
});

app.put('/api/reports/:id', async (req, res) => {
  try {
    let data = readExcel();
    const id = parseInt(req.params.id);
    let found = false;

    data = data.map(r => {
      // Use loose equality (==) for robust ID matching
      if (r.ID == id) {
        r.Status = req.body.status || r.Status;
        found = true;
      }
      return r;
    });

    if (!found) return res.status(404).send("Report not found");

    await writeExcelWithRetry(data);
    
    res.json({ message: "Updated Successfully" });
  } catch (error) {
    if (error.message === 'EBUSY') {
      res.status(409).json({ error: "Please close reports.xlsx in Microsoft Excel so the system can save your status update." });
    } else {
      res.status(500).json({ error: "Failed to update report" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`DrishtiX Server running at http://localhost:${PORT}`);
});
