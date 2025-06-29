const chatbotIcon = document.getElementById('chatbot-icon');
if (chatbotIcon) {
  chatbotIcon.addEventListener('click', () => {
    alert("Chatbot coming soon! You'll be able to talk to a doctor here.");
  });
}

// Toggle mobile nav
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

const addr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}


// ether script - don't touch

const recordRegistryABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "patient", "type": "address" },
      { "internalType": "string", "name": "cid", "type": "string" }
    ],
    "name": "storeRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "patient", "type": "address" }
    ],
    "name": "getRecords",
    "outputs": [
      { "internalType": "string[]", "name": "", "type": "string[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "uploader", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "cid", "type": "string" }
    ],
    "name": "RecordStored",
    "type": "event"
  }
];

// Set the Anvil address of your deployed contract
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

let signer;
let recordContract;

async function connectWallet() {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    signer = metamaskProvider.getSigner();
    recordContract = new ethers.Contract(contractAddress, recordRegistryABI, signer);
    alert("Wallet connected!");
  } catch (error) {
    console.error("Wallet connection failed:", error);
    alert("Failed to connect wallet");
  }
}

// Upload record (CID) for a patient
async function uploadRecord() {
  const patient = document.getElementById("patientAddress").value;
  const cid = document.getElementById("recordCID").value;

  if (!patient || !cid) {
    alert("Please enter both patient address and CID.");
    return;
  }

  try {
    const tx = await recordContract.storeRecord(patient, cid);
    await tx.wait();
    alert("Record uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Transaction failed. Check console.");
  }
}

// Read records for a patient
async function readRecords() {
  const patient = document.getElementById("readPatient").value;

  if (!patient) {
    alert("Please enter a patient address.");
    return;
  }

  try {
    const records = await recordContract.getRecords(patient);
    const output = document.getElementById("recordOutput");
    output.innerHTML = "<strong>Records:</strong><br>" + records.map(cid => `<code>${cid}</code>`).join("<br>");
  } catch (error) {
    console.error("Read failed:", error);
    alert("Failed to fetch records.");
  }
}
