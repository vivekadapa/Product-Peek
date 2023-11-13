import axios from 'axios';

const pinataApiKey = '1962dbacc07f44bcd4e4';
const pinataSecretApiKey = 'ca1eaed6426a8c1dc49707390f500c8aa2bf422380ac22a212d568a00fe84a74';

export async function uploadTextToIPFS(text) {
  const pinataUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  const pinataOptions = {
    pinataMetadata: {
      name: 'Reviews.txt', // Choose a name for your file
    },
    pinataContent: text, // The text content you want to upload
  };

  const headers = {
    'Content-Type': 'application/json',
    'pinata_api_key': pinataApiKey,
    'pinata_secret_api_key': pinataSecretApiKey,
  };

  try {
    const response = await axios.post(pinataUrl, pinataOptions, { headers });
    console.log('IPFS CID:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return null;
  }
}


const pinataGatewayUrl = 'https://orange-fancy-pony-45.mypinata.cloud/ipfs/'; // Pinata gateway URL

export async function fetchFileFromIPFS(ipfsHash) {
  const fileUrl = pinataGatewayUrl + ipfsHash;

  try {
    const response = await axios.get(fileUrl);
    // You can access the file content in response.data
    console.log('Fetched file content:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching file from IPFS:', error);
    return null;
  }
}


export async function uploadImageToIPFS(imageBlob) {
  const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const pinataFormData = new FormData();
  pinataFormData.append('file', imageBlob);

  const headers = {
    'Content-Type': 'multipart/form-data',
    'pinata_api_key': pinataApiKey,
    'pinata_secret_api_key': pinataSecretApiKey,
  };

  try {
    const response = await axios.post(pinataUrl, pinataFormData, { headers });
    console.log('IPFS CID:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    return null;
  }
}


// // const pinataGatewayUrl = 'https://orange-fancy-pony-45.mypinata.cloud/ipfs/'; // Pinata gateway URL

// export async function fetchImageFromIPFS(ipfsHash) {
//   const imageUrl = pinataGatewayUrl + ipfsHash;

//   try {
//     const response = await axios.get(imageUrl, { responseType: 'blob' });
//     // You can access the image blob in response.data
//     console.log('Fetched image blob:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching image from IPFS:', error);
//     return null;
//   }
// }

// export async function displayImageFromIPFS(ipfsHash, imgElementId) {
//   const imageUrl = pinataGatewayUrl + ipfsHash;

//   try {
//     const response = await axios.get(imageUrl, { responseType: 'blob' });
//     const blob = response.data;
    
//     // Convert the blob to a data URL
//     const reader = new FileReader();
//     reader.onload = function () {
//       const dataURL = reader.result;

//       // Set the data URL as the source for the image tag
//       const imgElement = document.getElementById(imgElementId);
//       imgElement.src = dataURL;
//     };
//     reader.readAsDataURL(blob);
//   } catch (error) {
//     console.error('Error fetching and displaying image from IPFS:', error);
//   }
// }
