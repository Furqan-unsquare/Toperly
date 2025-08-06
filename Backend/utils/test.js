import { NFTStorage, File } from 'nft.storage';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token });

async function testUpload() {
  try {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const cid = await client.storeBlob(file);
    console.log('Test upload successful, CID:', cid);
  } catch (err) {
    console.error('Test upload failed:', err);
  }
}

testUpload();