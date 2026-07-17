// SHA-1 Implementation
class SHA1 {
  constructor() {
    this.K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    this.H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  }

  rotateLeft(n, b) {
    return ((n << b) | (n >>> (32 - b))) >>> 0;
  }

  toHexString(num) {
    let hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  sha1(message) {
    const msg = new TextEncoder().encode(message);
    const msgLen = msg.length;
    const bitLen = msgLen * 8;

    // Pre-processing: adding a single 1 bit
    const padLen = (55 - msgLen) % 64;
    const paddedMsg = new Uint8Array(msgLen + padLen + 9);

    paddedMsg.set(msg);
    paddedMsg[msgLen] = 0x80;

    // Append length as 64-bit big-endian
    for (let i = 0; i < 8; i++) {
      paddedMsg[msgLen + padLen + 8 - i] = (bitLen >>> (i * 8)) & 0xff;
    }

    // Process message in 512-bit blocks
    const H = [...this.H];

    for (let offset = 0; offset < paddedMsg.length; offset += 64) {
      const W = new Array(80);

      for (let i = 0; i < 16; i++) {
        W[i] = (
          (paddedMsg[offset + i * 4] << 24) |
          (paddedMsg[offset + i * 4 + 1] << 16) |
          (paddedMsg[offset + i * 4 + 2] << 8) |
          paddedMsg[offset + i * 4 + 3]
        ) >>> 0;
      }

      for (let i = 16; i < 80; i++) {
        W[i] = this.rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      }

      let A = H[0];
      let B = H[1];
      let C = H[2];
      let D = H[3];
      let E = H[4];

      for (let i = 0; i < 80; i++) {
        let f, k;

        if (i < 20) {
          f = (B & C) | (~B & D);
          k = this.K[0];
        } else if (i < 40) {
          f = B ^ C ^ D;
          k = this.K[1];
        } else if (i < 60) {
          f = (B & C) | (B & D) | (C & D);
          k = this.K[2];
        } else {
          f = B ^ C ^ D;
          k = this.K[3];
        }

        const temp = (this.rotateLeft(A, 5) + f + E + k + W[i]) >>> 0;
        E = D;
        D = C;
        C = this.rotateLeft(B, 30);
        B = A;
        A = temp;
      }

      H[0] = (H[0] + A) >>> 0;
      H[1] = (H[1] + B) >>> 0;
      H[2] = (H[2] + C) >>> 0;
      H[3] = (H[3] + D) >>> 0;
      H[4] = (H[4] + E) >>> 0;
    }

    // Produce the final hash value
    let hashHex = '';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        hashHex += this.toHexString((H[i] >>> (24 - j * 8)) & 0xff);
      }
    }

    return hashHex.toLowerCase();
  }
}

// DOM Elements
const inputField = document.getElementById('input-text');
const outputField = document.getElementById('output-hash');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const quickCopyBtn = document.getElementById('quick-copy');

const sha1 = new SHA1();

// Generate Hash
generateBtn.addEventListener('click', () => {
  const input = inputField.value;

  if (!input.trim()) {
    outputField.innerHTML = '<span class="output-placeholder">Please enter some text first...</span>';
    return;
  }

  const hash = sha1.sha1(input);
  outputField.textContent = hash;
  outputField.classList.remove('output-placeholder');

  // Add animation
  outputField.style.animation = 'none';
  setTimeout(() => {
    outputField.style.animation = 'fadeIn 0.5s ease-in';
  }, 10);
});

// Copy Hash
copyBtn.addEventListener('click', () => {
  const hashText = outputField.textContent;

  if (hashText === 'Your hash will appear here...' || !hashText) {
    alert('Generate a hash first!');
    return;
  }

  navigator.clipboard.writeText(hashText).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied! ✓';
    copyBtn.style.background = 'rgba(40, 200, 64, 0.2)';

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
  });
});

// Quick Copy (Icon)
quickCopyBtn.addEventListener('click', () => {
  const hashText = outputField.textContent;

  if (hashText === 'Your hash will appear here...' || !hashText) {
    return;
  }

  navigator.clipboard.writeText(hashText).then(() => {
    const originalEmoji = quickCopyBtn.textContent;
    quickCopyBtn.textContent = '✓';
    quickCopyBtn.style.color = '#28c840';

    setTimeout(() => {
      quickCopyBtn.textContent = originalEmoji;
      quickCopyBtn.style.color = '';
    }, 1500);
  });
});

// Clear All
clearBtn.addEventListener('click', () => {
  inputField.value = '';
  outputField.innerHTML = '<span class="output-placeholder">Your hash will appear here...</span>';
  inputField.focus();
});

// Enter key support
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    generateBtn.click();
  }
});

// Add animation keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
