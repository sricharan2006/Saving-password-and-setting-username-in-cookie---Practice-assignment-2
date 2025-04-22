const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store value in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve value from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Clear local storage (add this to a reset function later if needed)
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash of a string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Get a random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Get or generate and store the hash
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) return cached;

  const number = getRandomArbitrary(MIN, MAX).toString();
  const hash = await sha256(number);
  store('sha256', hash);
  return hash;
}

// Main function to set hash on UI
async function main() {
  sha256HashView.textContent = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.textContent = hash;
}

// Compare user input with stored hash
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.textContent = '💡 Enter a 3-digit number.';
    resultView.classList.remove('hidden');
    resultView.style.backgroundColor = '#ffc107'; // Yellow
    return;
  }

  const hashedPin = await sha256(pin);
  const correctHash = sha256HashView.textContent;

  resultView.classList.remove('hidden');
  if (hashedPin === correctHash) {
    resultView.textContent = '🎉 Correct! You guessed it!';
    resultView.style.backgroundColor = '#28a745'; // Green
  } else {
    resultView.textContent = '❌ Wrong. Try again!';
    resultView.style.backgroundColor = '#dc3545'; // Red
  }
}

// Input validation (only 3 digits max)
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// Attach test function to the Check button
document.getElementById('check').addEventListener('click', test);

// Start the app
main();
