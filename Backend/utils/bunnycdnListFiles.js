// utils/bunnycdnListFiles.js
import axios from "axios";

export const listFilesOnBunny = async (folder) => {
  const BUNNY_STORAGE_PASSWORD = process.env.BUNNY_ACCESS_KEY;
  const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;

  const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${folder}`;

  try {
    const response = await axios.get(url, {
      headers: {
        AccessKey: BUNNY_STORAGE_PASSWORD,
      },
    });

    return response.data; // Array of file metadata
  } catch (error) {
    console.error("Error fetching files from BunnyCDN:", error.response?.data || error.message);
    return null;
  }
};
