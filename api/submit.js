// module.exports = async (req, res) => {
//     if (req.method === 'POST') {
//         // Log the received form data to Vercel logs
//         console.log('Form submission received:', req.body);

//         // Parse form data
//         const { name, email, message } = req.body;

//         // Handle CSV writing here (you could store it in a cloud DB like Firebase or AWS S3 for better scalability)
//         const fs = require('fs');
//         const path = require('path');

//         // Make sure to create a folder where the CSV will be saved if needed
//         const filePath = path.resolve('/tmp', 'submissions.csv');

//         // Add to CSV file (simple append)
//         const row = `${name},${email},${message}\n`;

//         // Write to the file (for serverless, use /tmp for writing)
//         fs.appendFileSync(filePath, row);

//         // Respond back to the client
//         res.status(200).json({ message: 'Submission successful!' });
//     } else {
//         res.status(405).json({ error: 'Method not allowed' });
//     }
// };

const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        // Log the received form data to Vercel logs
        console.log('Form submission received:', req.body);

        const { name, email, message } = req.body;
        
        // Create the CSV row
        const csvRow = `${name},${email},${message}\n`;

        // GitHub Repository Info
        const repoOwner = 'Zeaxanthin80';
        const repoName = 'med';
        const filePath = 'submissions.csv';
        const githubToken = process.env.GITHUB_TOKEN;  // Set your GitHub token securely in Vercel's environment variables

        const updateGitHubFile = async () => {
            try {
                const response = await axios.get('https://api.github.com/repos/Zeaxanthin80/med/contents/submissions.csv', {
                    headers: {
                        'Authorization': `Bearer ${githubToken}`
                    }
                });
        
                // Logic to update the file...
        
            } catch (error) {
                console.error('Error accessing GitHub:', error);
            }
        };
        
        try {
            // Get the current file content from GitHub
            const fileContent = await axios.get(
                `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, 
                {
                    headers: {
                        'Authorization': `Bearer ${githubToken}`
                    }
                }
            );

            // Decode the file content (GitHub API returns the file content in base64)
            const decodedContent = Buffer.from(fileContent.data.content, 'base64').toString('utf8');

            // Append the new submission to the existing content
            const updatedContent = decodedContent + csvRow;

            // Encode the updated content back to base64
            const encodedContent = Buffer.from(updatedContent, 'utf8').toString('base64');

            // Create the commit on GitHub
            await axios.put(
                `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
                {
                    message: 'Add new form submission',
                    content: encodedContent,
                    sha: fileContent.data.sha  // GitHub requires the sha of the current file to update it
                },
                {
                    headers: {
                        'Authorization': `Bearer ${githubToken}`
                    }
                }
            );

            res.status(200).json({ message: 'Submission successfully added to GitHub!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating CSV file on GitHub' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

