import { Storage } from '@google-cloud/storage';

import fs = require('fs');

const bucketName = '29f98e10-a489-4c82-ae5e-489dbcd4912f';
const destFilePath = `${__dirname}/open-aip-db`;

if (!fs.existsSync(destFilePath)) {
  fs.mkdirSync(destFilePath);
}

// Creates a client
const storage = new Storage();

async function downloadPublicFile() {
  const files = await storage.bucket(bucketName).getFiles();
  const interestingFiles = files[0]
    .map((file) => file.name)
    .filter((name) => name.startsWith('sk_') && name.endsWith('.geojson'));
  console.log(interestingFiles);

  for (const fileName of interestingFiles) {
    const options = {
      destination: `${destFilePath}/${fileName}`,
    };
    await storage.bucket(bucketName).file(fileName).download(options);
    console.log(
      `Downloaded public file ${bucketName} to ${destFilePath}/${fileName}`
    );
  }
  console.log('Download complete');
}

downloadPublicFile().catch(console.error);
