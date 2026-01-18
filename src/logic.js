// Auto-update year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Enable smooth scrolling for in-page links (CSS fallback for browsers that support it)
document.documentElement.style.scrollBehavior="smooth";

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
function closeMenu(){
  mobileNav.classList.add('hidden');
  menuBtn.setAttribute('aria-expanded','false'); 
  menuBtn.setAttribute('aria-label','Open menu'); 
}
function openMenu(){
  mobileNav.classList.remove('hidden');
  menuBtn.setAttribute('aria-expanded','true'); 
  menuBtn.setAttribute('aria-label','Close menu'); 
}
menuBtn?.addEventListener('click', () => { 
  const isOpen = !mobileNav.classList.contains('hidden');
  if(isOpen) closeMenu(); else openMenu(); 
});

// --- Toast helpers ---
const toast      = document.getElementById('toast');
const toastCard  = document.getElementById('toastCard');
const toastText  = document.getElementById('toastText');
const toastIcon  = document.getElementById('toastIcon');
const toastClose = document.getElementById('toastClose');
let toastTimer;
const successSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
  </svg>`;
const errorSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/><path d="M1 21h22L12 2 1 21z"/>
  </svg>`;
function showToast(message, type = 'success', ms = 4000) {
  clearTimeout(toastTimer);
  toastText.textContent = message;
  toastIcon.innerHTML = type === 'success' ? successSVG : errorSVG;

  // border accent
  toastCard.classList.remove('border-red-500/40','border-emerald-500/40');
  toastCard.classList.add(type === 'success' ? 'border-emerald-500/40' : 'border-red-500/40');

  toast.classList.remove('hidden');
  requestAnimationFrame(() => {
    toastCard.classList.remove('opacity-0','translate-y-2');
  });

  toastTimer = setTimeout(hideToast, ms);
}
function hideToast() {
  toastCard.classList.add('opacity-0','translate-y-2');
  setTimeout(() => toast.classList.add('hidden'), 200);
}
toastClose.addEventListener('click', hideToast);

// Form helpers
const form = document.getElementById('contactForm');
const citySelect = document.getElementById('city');
const cityOther = document.getElementById('cityOther');
const submitBtn = document.getElementById('submitBtn');
// toggle the "other city" input
citySelect?.addEventListener('change', (e) => {
  if (e.target.value === 'other') {
    cityOther.classList.remove('hidden');
    cityOther.setAttribute('aria-hidden', 'false');
    cityOther.setAttribute('required', 'required');
    cityOther.focus();
  } else {
    cityOther.classList.add('hidden');
    cityOther.setAttribute('aria-hidden', 'true');
    cityOther.removeAttribute('required');
    cityOther.value = '';
  }
});

// --- Netlify AJAX submit ---
function encodeForm(fd){ return new URLSearchParams(fd).toString(); }

// Handle form submit
if (!form) { console.warn('contactForm not found'); }
else {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // simple recaptcha check
    const t = document.getElementById('g-recaptcha-response');
    const ok = !!(t && t.value && t.value.trim().length > 0);
    if (!ok) {
      e.stopPropagation();
      showToast('Please complete the reCAPTCHA.', 'error');
      return false;
    }

    const data = new FormData(form);

    if (!data.get('form-name')) data.set('form-name', form.getAttribute('name'));

    // if "other" city, replace with text input value
    if (citySelect.value === 'other') {
      const otherCity = cityOther.value.trim();
      if (otherCity) data.set('city', otherCity);
    }
    
    data.delete('city_other'); // remove the auxiliary field

    // disable button + show progress state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    submitBtn.classList.remove("cursor-pointer");
    submitBtn.classList.add("opacity-60", "cursor-progress");

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(data)
      });

      if (!res.ok) throw new Error('Form submit failed');

      // show toast success
      showToast('Thanks! We received your request. We’ll reply within one business week.', 'success');

      // lock the form in-place after success
      Array.from(form.elements).forEach(el => {
        el.disabled = true;
        el.classList.add('opacity-60', 'cursor-not-allowed');
      });

      // also lock custom upload controls
      document.getElementById('uploadBtn')?.setAttribute('disabled', 'true');
      document.getElementById('uploadBtn')?.classList.add('opacity-60', 'cursor-not-allowed');
      document.querySelector('label[for="planFiles"]')?.classList.add('opacity-60', 'pointer-events-none');

      // mark button as done
      submitBtn.textContent = "Done!";
      submitBtn.classList.remove("bg-amber-500", "hover:bg-amber-400", "cursor-progress");
      submitBtn.classList.add("bg-emerald-500", "text-white", "cursor-not-allowed");
    } catch (err) {
      // error toast
      showToast('Something went wrong. Email contact@upsurfaces.com or call (906) 242-6500.', 'error');

      // re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = "Send request";
      submitBtn.classList.remove("opacity-60", "cursor-progress");
      submitBtn.classList.add("cursor-pointer");
    }
  });
}

// --- R2 Uploads (client -> presigned URL -> PUT to R2) ---
const planFilesEl   = document.getElementById('planFiles');
const uploadBtn     = document.getElementById('uploadBtn');
const uploadStatus  = document.getElementById('uploadStatus');
const uploadedList  = document.getElementById('uploadedList');
const r2FilesHidden = document.getElementById('r2_files');
const r2StateHidden = document.getElementById('r2_upload_state');

let uploaded = []; // { name, url, key }

function setUploadState(state, msg) {
  if (r2StateHidden) r2StateHidden.value = state;
  if (uploadStatus) uploadStatus.textContent = msg || '';
}

function renderUploaded() {
  if (!uploadedList) return;
  uploadedList.innerHTML = '';
  uploaded.forEach(f => {
    const li = document.createElement('li');
    li.textContent = `${f.name} (uploaded)`;
    uploadedList.appendChild(li);
  });
  if (r2FilesHidden) r2FilesHidden.value = JSON.stringify(uploaded.map(x => x.url));
}

async function presign(file) {
  const res = await fetch('/.netlify/functions/r2-presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream'
    })
  });
  if (!res.ok) throw new Error('Failed to get upload URL');
  return res.json(); // { uploadUrl, publicUrl, key }
}

async function uploadOne(file) {
  const { uploadUrl, publicUrl, key } = await presign(file);

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file
  });
  if (!put.ok) throw new Error(`Upload failed: ${file.name}`);

  uploaded.push({ name: file.name, url: publicUrl, key });
  renderUploaded();
}

uploadBtn?.addEventListener('click', async () => {
  const files = planFilesEl?.files ? Array.from(planFilesEl.files) : [];
  if (!files.length) {
    setUploadState('none', 'Pick files first.');
    return;
  }

  uploadBtn.disabled = true;
  setUploadState('uploading', `Uploading ${files.length} file(s)...`);

  try {
    for (const f of files) await uploadOne(f);
    setUploadState('done', `Uploaded ${files.length} file(s). You can submit the form now.`);
  } catch (e) {
    console.error(e);
    setUploadState('error', 'Upload failed. Try again or submit without attachments.');
  } finally {
    uploadBtn.disabled = false;
  }
});

const fileName = document.getElementById('fileName');

planFilesEl?.addEventListener('change', () => {
  const files = planFilesEl.files ? Array.from(planFilesEl.files) : [];
  if (!fileName) return;

  if (!files.length) fileName.textContent = 'No files selected';
  else if (files.length === 1) fileName.textContent = files[0].name;
  else fileName.textContent = `${files.length} files selected`;
});


// OPTIONAL (recommended): prevent form submit while uploads running
form?.addEventListener('submit', (e) => {
  if (r2StateHidden?.value === 'uploading') {
    e.preventDefault();
    showToast('Uploads are still running — wait for them to finish.', 'error');
  }
});

// Form submission test
function testSubmit() {
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  submitBtn.classList.remove("cursor-pointer");
  submitBtn.classList.add("opacity-60", "cursor-progress");

  // simulate success after 2s
  setTimeout(() => {
    submitBtn.textContent = "Done!";
    submitBtn.classList.remove("bg-amber-500", "hover:bg-amber-400", "cursor-progress");
    submitBtn.classList.add("bg-emerald-500", "text-white", "cursor-not-allowed");
  }, 2000);

  // reset button after 10s
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send request";
    submitBtn.classList.remove("opacity-60", "cursor-progress", "bg-emerald-500", "text-white", "cursor-not-allowed");
    submitBtn.classList.add("bg-amber-500", "hover:bg-amber-400", "cursor-pointer");
  }, 10000);

  showToast('This is a test. No data was sent or saved.', 'success');

  form.reset();

  return false;
}
