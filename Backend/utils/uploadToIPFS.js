import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

export async function uploadBufferToIPFS(buffer, filename = 'certificate.pdf') {
  try {
    const formData = new FormData();
    formData.append('file', buffer, { filename });

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity, // avoid size limits
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY
      }
    });

    const cid = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  } catch (err) {
    console.error('❌ Pinata upload failed:', err.response?.data || err.message);
    throw new Error('Failed to upload file to IPFS via Pinata');
  }
}
