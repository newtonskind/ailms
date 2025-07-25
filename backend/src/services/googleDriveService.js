const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Load credentials from environment variables
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Upload a file to Google Drive
async function uploadFile(filePath, fileName) {
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };
  const media = {
    body: fs.createReadStream(filePath),
  };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });
  return response.data.id;
}

// Download a file from Google Drive
async function downloadFile(fileId, destPath) {
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  }, { responseType: 'stream' });
  await new Promise((resolve, reject) => {
    res.data
      .on('end', resolve)
      .on('error', reject)
      .pipe(dest);
  });
}

module.exports = {
  uploadFile,
  downloadFile,
}; 