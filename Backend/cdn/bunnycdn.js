import fs from "fs/promises";
import axios from "axios";

export const uploadFileOnBunny = async (folder, file) => {
  const BUNNY_STORAGE_PASSWORD = process.env.BUNNY_ACCESS_KEY;
  const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
  const BUNNY_PULL_ZONE = process.env.BUNNY_PULL_ZONE;

  // Add debugging to verify credentials
  console.log('Storage Password:', BUNNY_STORAGE_PASSWORD ? 'Set' : 'NOT SET');
  console.log('Storage Zone:', BUNNY_STORAGE_ZONE);
  console.log('Using AccessKey:', BUNNY_STORAGE_PASSWORD?.substring(0, 8) + '...');

  try {
    const fileBuffer = await fs.readFile(file.path);

    const uploadUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${folder}/${file.filename}`;

    const response = await axios.put(uploadUrl, fileBuffer, {
      headers: {
        AccessKey: BUNNY_STORAGE_PASSWORD,
        'Content-Type': 'application/octet-stream',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return response.status === 201 || response.status === 200
      ? {
          url: `https://${BUNNY_PULL_ZONE}/${folder}/${file.filename}`,
          public_id: `${folder}/${file.filename}`,
        }
      : null;

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    return null;
  }
};
