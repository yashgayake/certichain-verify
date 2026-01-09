import { ethers } from "ethers";

// 1️⃣ Contract address
export const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

// 2️⃣ Contract ABI (tumhara poora copy kiya hua JSON)
export const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string","name": "_studentName","type": "string"},
      {"internalType": "string","name": "_course","type": "string"},
      {"internalType": "uint256","name": "_year","type": "uint256"},
      {"internalType": "string","name": "_certificateID","type": "string"}
    ],
    "name": "addCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string","name": "_certificateID","type": "string"}],
    "name": "getCertificate",
    "outputs": [
      {"internalType": "string","name": "studentName","type": "string"},
      {"internalType": "string","name": "course","type": "string"},
      {"internalType": "uint256","name": "year","type": "uint256"},
      {"internalType": "string","name": "certificateID","type": "string"},
      {"internalType": "address","name": "issuer","type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string","name": "_certificateID","type": "string"}],
    "name": "verifyCertificate",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// 3️⃣ Contract instance helper
export const getContract = (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Read-only contract (for verification without wallet)
export const getReadOnlyContract = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
