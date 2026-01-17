import { ethers } from "ethers";

// 🔴 IMPORTANT: Update this address after deploying the new smart contract
export const CONTRACT_ADDRESS = "0xE894bc126822B8FBbeD56133E27221a0fC74DAd3";

// Contract ABI - matches CertificateVerification.sol
export const CONTRACT_ABI = [
  // Constructor
  {
    "inputs": [{"internalType": "string", "name": "_institutePassword", "type": "string"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "enrollmentNumber", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "registeredBy", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "StudentRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "certificateHash", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "enrollmentNumber", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "studentName", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "course", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "issuer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "certificateHash", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "revokedBy", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "CertificateRevoked",
    "type": "event"
  },
  
  // Admin Functions
  {
    "inputs": [
      {"internalType": "string", "name": "_enrollmentNumber", "type": "string"},
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_email", "type": "string"},
      {"internalType": "string", "name": "_phone", "type": "string"},
      {"internalType": "string", "name": "_photoHash", "type": "string"}
    ],
    "name": "registerStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_certificateHash", "type": "string"},
      {"internalType": "string", "name": "_enrollmentNumber", "type": "string"},
      {"internalType": "string", "name": "_studentName", "type": "string"},
      {"internalType": "string", "name": "_course", "type": "string"},
      {"internalType": "string", "name": "_grade", "type": "string"},
      {"internalType": "uint256", "name": "_year", "type": "uint256"},
      {"internalType": "string", "name": "_pdfHash", "type": "string"},
      {"internalType": "string", "name": "_photoHash", "type": "string"}
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_certificateHash", "type": "string"}],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_newPassword", "type": "string"}],
    "name": "updateInstitutePassword",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_newAdmin", "type": "address"}],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // View Functions
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAdmin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "institutePassword",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCertificates",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStudents",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCertificates",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalStudents",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_certificateHash", "type": "string"}],
    "name": "verifyCertificate",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_certificateHash", "type": "string"}],
    "name": "getCertificate",
    "outputs": [
      {"internalType": "string", "name": "studentName", "type": "string"},
      {"internalType": "string", "name": "course", "type": "string"},
      {"internalType": "string", "name": "grade", "type": "string"},
      {"internalType": "uint256", "name": "year", "type": "uint256"},
      {"internalType": "string", "name": "enrollmentNumber", "type": "string"},
      {"internalType": "address", "name": "issuer", "type": "address"},
      {"internalType": "uint256", "name": "issuedAt", "type": "uint256"},
      {"internalType": "string", "name": "pdfHash", "type": "string"},
      {"internalType": "string", "name": "photoHash", "type": "string"},
      {"internalType": "bool", "name": "isValid", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_enrollmentNumber", "type": "string"}],
    "name": "getStudent",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "email", "type": "string"},
      {"internalType": "string", "name": "phone", "type": "string"},
      {"internalType": "string", "name": "photoHash", "type": "string"},
      {"internalType": "bool", "name": "isRegistered", "type": "bool"},
      {"internalType": "uint256", "name": "registeredAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_enrollmentNumber", "type": "string"}],
    "name": "isStudentRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_enrollmentNumber", "type": "string"},
      {"internalType": "string", "name": "_password", "type": "string"}
    ],
    "name": "authenticateStudent",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_enrollmentNumber", "type": "string"}],
    "name": "getStudentCertificates",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCertificateHashes",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllEnrollmentNumbers",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Mappings (auto-generated getters)
  {
    "inputs": [{"internalType": "string", "name": "", "type": "string"}],
    "name": "students",
    "outputs": [
      {"internalType": "string", "name": "enrollmentNumber", "type": "string"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "email", "type": "string"},
      {"internalType": "string", "name": "phone", "type": "string"},
      {"internalType": "string", "name": "photoHash", "type": "string"},
      {"internalType": "bool", "name": "isRegistered", "type": "bool"},
      {"internalType": "uint256", "name": "registeredAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "", "type": "string"}],
    "name": "certificates",
    "outputs": [
      {"internalType": "string", "name": "certificateHash", "type": "string"},
      {"internalType": "string", "name": "enrollmentNumber", "type": "string"},
      {"internalType": "string", "name": "studentName", "type": "string"},
      {"internalType": "string", "name": "course", "type": "string"},
      {"internalType": "string", "name": "grade", "type": "string"},
      {"internalType": "uint256", "name": "year", "type": "uint256"},
      {"internalType": "string", "name": "pdfHash", "type": "string"},
      {"internalType": "string", "name": "photoHash", "type": "string"},
      {"internalType": "address", "name": "issuer", "type": "address"},
      {"internalType": "uint256", "name": "issuedAt", "type": "uint256"},
      {"internalType": "string", "name": "transactionHash", "type": "string"},
      {"internalType": "bool", "name": "isValid", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "allCertificateHashes",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "allEnrollmentNumbers",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Get contract with signer (for write operations)
export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};

// Read-only contract (for verification without wallet)
export const getReadOnlyContract = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
