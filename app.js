const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const code = generateRandomCode(); // Generate a 4-digit random code
        const fileName = `${code}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Function to generate a 4-digit random code
function generateRandomCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ code: req.file.filename.split('.')[0] }); // Sending the generated code back to the client
});


app.get('/download', (req, res) => {
    const code = req.query.code;
    const filePath = path.join(__dirname, 'uploads', `${code}.zip`); // Ensure the correct extension is used

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File not found:", filePath); // Log the error for debugging
            return res.status(404).send('File not found');
        }

        // Send the file as an attachment
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err); // Log the error for debugging
                res.status(500).send('Error sending file');
            } else {
                console.log("File sent successfully:", filePath); // Log success for debugging
            }
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
