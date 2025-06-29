const chatbotIcon = document.getElementById('chatbot-icon');
if (chatbotIcon) {
  chatbotIcon.addEventListener('click', () => {
    alert("Chatbot coming soon! You'll be able to talk to a doctor here.");
  });
}

// mobile nav
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");


const addr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
}


// ether script - don't touch

const contractABI = [
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
  }
];

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed contract on Anvil

let provider, signer, contract;

// ====== Wallet Connection ======
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not detected.");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const userAddress = await signer.getAddress();
    document.getElementById("walletAddress").innerText = userAddress;

    alert("Wallet connected successfully!");
  } catch (error) {
    console.error("Wallet connection error:", error);
    alert("Failed to connect wallet.");
  }
}

// ====== Upload Record ======
async function uploadRecord() {
  if (!contract) {
    alert("Wallet not connected.");
    return;
  }

  const cid = document.getElementById("recordCID").value;
  if (!cid) return alert("Please enter a CID.");

  try {
    const userAddress = await signer.getAddress();
    const tx = await contract.storeRecord(userAddress, cid);
    await tx.wait();
    alert("Record uploaded!");
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to upload record.");
  }
}

// ====== Read Records ======
async function readMyRecords() {
  if (!contract) {
    alert("Wallet not connected.");
    return;
  }

  try {
    const userAddress = await signer.getAddress();
    const records = await contract.getRecords(userAddress);

    const output = document.getElementById("recordOutput");
    output.innerHTML = records.length
      ? records.map(cid => `🔗 ${cid}`).join("<br>")
      : "No records found.";
  } catch (err) {
    console.error("Read error:", err);
    alert("Failed to fetch records.");
  }
}
