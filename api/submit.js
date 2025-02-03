const axios = require('axios');

module.exports = async (req, res) => {
    // Ensure that the request method is POST
    if (req.method === 'POST') {
        // Log the received form data to Vercel logs
        console.log('Form submission received:', req.body);

        // Destructure form data from the request body
        const {firstname, lastname, address, city, state, zipcode, phone, email, medicalhistory, allergies} = req.body;

        // Create the CSV row to be added to the file
        const csvRow = `${firstname},${lastname},${address},${city},${state},${zipcode},${phone},${email},${medicalhistory},${allergies}\n`;

        // GitHub Repository Info (Make sure to replace with your actual repo details)
        const repoOwner = 'Zeaxanthin80';  // Replace with your GitHub username or organization
        const repoName = 'med'; // Replace with your repository name
        const filePath = 'submissions.csv'; // The path to your CSV file in the repo
        const githubToken = process.env.GITHUB_TOKEN;  // Your GitHub token stored securely in Vercel environment variables

        try {
            // Step 1: Fetch the current file content from GitHub (we need the file's SHA to update it)
            const fileContentResponse = await axios.get(
                `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
                {
                    headers: {
                        'Authorization': `Bearer ${githubToken}`
                    }
                }
            );

            // Step 2: Decode the file content from base64 (GitHub API returns base64-encoded content)
            const decodedContent = Buffer.from(fileContentResponse.data.content, 'base64').toString('utf8');

            // Step 3: Append the new CSV row to the existing content
            const updatedContent = decodedContent + csvRow;

            // Step 4: Re-encode the updated content back to base64
            const encodedContent = Buffer.from(updatedContent, 'utf8').toString('base64');

            // Step 5: Update the file on GitHub (commit the new content)
            await axios.put(
                `https://api.github.com/repos/Zeaxanthin80/med/contents/submissions.csv`,
                {
                    message: 'Add new form submission',  // Commit message
                    content: encodedContent,            // The updated content (base64-encoded)
                    sha: fileContentResponse.data.sha   // SHA of the current file to update it
                },
                {
                    headers: {
                        'Authorization': `Bearer ${githubToken}`
                    }
                }
            );

            // Step 6: Respond with a success message
            res.status(200).json({ message: 'Submission successfully sent!' });

        } catch (error) {
            // Handle errors and respond with a failure message
            console.error('Error updating GitHub file:', error);
            res.status(500).json({ error: 'Error updating CSV file.' });
        }
    } else {
        // Respond with 405 Method Not Allowed if the request method is not POST
        res.status(405).json({ error: 'Method not allowed' });
    }
};
