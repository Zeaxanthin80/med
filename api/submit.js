module.exports = async (req, res) => {
    if (req.method === 'POST') {
        // Log the received form data to Vercel logs
        console.log('Form submission received:', req.body);
        
        // Parse form data
        const { name, email, message } = req.body;

        // Handle CSV writing here (you could store it in a cloud DB like Firebase or AWS S3 for better scalability)
        const fs = require('fs');
        const path = require('path');

        // Make sure to create a folder where the CSV will be saved if needed
        const filePath = path.resolve('/tmp', 'submissions.csv');

        // Add to CSV file (simple append)
        const row = `${name},${email},${message}\n`;

        // Write to the file (for serverless, use /tmp for writing)
        fs.appendFileSync(filePath, row);

        // Respond back to the client
        res.status(200).json({ message: 'Submission successful!' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
