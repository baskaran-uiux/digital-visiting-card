/* ==========================================================================
   Admin Dashboard Script - Realtime Sync & Management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const defaultProfile = {
    firstName: 'Tauhidul',
    lastName: 'Islam',
    title: 'Co-Founder & Director',
    companyAccent: 'INTRO',
    company: '',
    phone: '+880 1725-956076',
    email: 'tauhidul.islam@introcard.com',
    website: 'www.introcard.com',
    bio: "Co-Founder & Director, INTRO\nHelping people to grow their business network by using INTRO™",
    whatsapp: 'https://wa.me/8801725956076',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    avatar: 'avatar.png',
    accentColor: '#FF5500',
    location: 'Chennai, Tamil Nadu, India',
    mapUrl: 'https://maps.google.com/?q=Chennai,+Tamil+Nadu',
    adminPasscode: 'admin123'
  };

  let profileData = { ...defaultProfile };

  // Load saved profile data
  const savedData = localStorage.getItem('intro_card_profile');
  if (savedData) {
    try {
      profileData = { ...defaultProfile, ...JSON.parse(savedData) };
      if (profileData.company) {
        profileData.company = profileData.company.replace(/Card Ltd\.?/gi, '').trim();
      }
      if (profileData.bio) {
        profileData.bio = profileData.bio.replace(/Card Ltd\.?/gi, '').trim();
      }
      // Resave cleaned data
      localStorage.setItem('intro_card_profile', JSON.stringify(profileData));
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }

  // DOM Elements
  const form = document.getElementById('dashboardForm');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const titleInput = document.getElementById('title');
  const companyInput = document.getElementById('company');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const websiteInput = document.getElementById('website');
  const locationInput = document.getElementById('location');
  const mapUrlInput = document.getElementById('mapUrl');
  const bioInput = document.getElementById('bio');
  const whatsappInput = document.getElementById('whatsapp');
  const linkedinInput = document.getElementById('linkedin');
  const instagramInput = document.getElementById('instagram');
  const facebookInput = document.getElementById('facebook');
  const accentColorInput = document.getElementById('accentColor');
  const changePasscodeInput = document.getElementById('changePasscode');

  const avatarPreview = document.getElementById('avatarPreview');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
  const resetAvatarBtn = document.getElementById('resetAvatarBtn');

  const saveTopBtn = document.getElementById('saveTopBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
  const previewIframe = document.getElementById('previewIframe');
  const dashToast = document.getElementById('dashToast');

  // Populate Form Fields
  function populateForm() {
    firstNameInput.value = profileData.firstName;
    lastNameInput.value = profileData.lastName;
    titleInput.value = profileData.title;
    companyInput.value = (profileData.companyAccent + ' ' + profileData.company).trim();
    phoneInput.value = profileData.phone;
    emailInput.value = profileData.email;
    websiteInput.value = profileData.website;
    if (locationInput) locationInput.value = profileData.location || '';
    if (mapUrlInput) mapUrlInput.value = profileData.mapUrl || '';
    bioInput.value = profileData.bio;
    whatsappInput.value = profileData.whatsapp;
    linkedinInput.value = profileData.linkedin;
    instagramInput.value = profileData.instagram;
    facebookInput.value = profileData.facebook;
    accentColorInput.value = profileData.accentColor || '#FF5500';
    if (changePasscodeInput) changePasscodeInput.value = profileData.adminPasscode || 'admin123';

    if (profileData.avatar) {
      avatarPreview.src = profileData.avatar;
    }
  }

  // Toast alert
  function showToast(msg) {
    dashToast.textContent = msg;
    dashToast.classList.add('show');
    setTimeout(() => {
      dashToast.classList.remove('show');
    }, 2500);
  }

  // Save State and Reload Preview
  function saveProfileData(notify = true) {
    const fullCompany = companyInput.value.trim();
    const parts = fullCompany.split(' ');
    const companyAccent = parts[0] || 'INTRO';
    const companyRest = parts.slice(1).join(' ');

    profileData.firstName = firstNameInput.value.trim();
    profileData.lastName = lastNameInput.value.trim();
    profileData.title = titleInput.value.trim();
    profileData.companyAccent = companyAccent;
    profileData.company = companyRest;
    profileData.phone = phoneInput.value.trim();
    profileData.email = emailInput.value.trim();
    profileData.website = websiteInput.value.trim();
    if (locationInput) profileData.location = locationInput.value.trim();
    if (mapUrlInput) profileData.mapUrl = mapUrlInput.value.trim();
    profileData.bio = bioInput.value.trim();
    profileData.whatsapp = whatsappInput.value.trim();
    profileData.linkedin = linkedinInput.value.trim();
    profileData.instagram = instagramInput.value.trim();
    profileData.facebook = facebookInput.value.trim();
    profileData.accentColor = accentColorInput.value;
    if (changePasscodeInput) profileData.adminPasscode = changePasscodeInput.value.trim() || 'admin123';

    localStorage.setItem('intro_card_profile', JSON.stringify(profileData));

    // Reload iframe preview
    if (previewIframe && previewIframe.contentWindow) {
      previewIframe.contentWindow.location.reload();
    }

    if (notify) {
      showToast('⚡ Saved successfully!');
    }
  }

  // Live Auto-Save on typing
  let debounceTimer;
  function triggerAutoSave() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      saveProfileData(false);
    }, 400);
  }

  // Event Listeners for Live Preview Typing
  const inputList = [
    firstNameInput, lastNameInput, titleInput, companyInput,
    phoneInput, emailInput, websiteInput, locationInput, mapUrlInput, bioInput,
    whatsappInput, linkedinInput, instagramInput, facebookInput
  ];

  inputList.forEach(input => {
    input.addEventListener('input', triggerAutoSave);
  });

  accentColorInput.addEventListener('input', () => {
    saveProfileData(false);
  });
  accentColorInput.addEventListener('change', () => {
    saveProfileData(true);
  });

  // Preset Buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedColor = e.target.getAttribute('data-color');
      accentColorInput.value = selectedColor;
      saveProfileData(true);
    });
  });

  // Handle Avatar Image Upload
  uploadAvatarBtn.addEventListener('click', () => {
    avatarFileInput.click();
  });

  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Img = evt.target.result;
        profileData.avatar = base64Img;
        avatarPreview.src = base64Img;
        saveProfileData(true);
      };
      reader.readAsDataURL(file);
    }
  });

  resetAvatarBtn.addEventListener('click', () => {
    profileData.avatar = 'avatar.png';
    avatarPreview.src = 'avatar.png';
    saveProfileData(true);
  });

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfileData(true);
  });

  saveTopBtn.addEventListener('click', () => {
    saveProfileData(true);
  });

  // Reset Defaults
  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all card details to default?')) {
      profileData = { ...defaultProfile };
      localStorage.removeItem('intro_card_profile');
      populateForm();
      saveProfileData(true);
      showToast('🔄 Reset to default details');
    }
  });

  // Initialize
  populateForm();

  // ==========================================================================
  // Security Authentication Gate Logic
  // ==========================================================================
  const loginOverlay = document.getElementById('loginOverlay');
  const loginCard = document.getElementById('loginCard');
  const loginForm = document.getElementById('loginForm');
  const adminPasswordInput = document.getElementById('adminPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const logoutBtn = document.getElementById('logoutBtn');
  const hintPasscode = document.getElementById('hintPasscode');

  function checkSessionAuth() {
    const isLogged = sessionStorage.getItem('intro_card_admin_logged');
    if (isLogged === 'true') {
      loginOverlay.classList.remove('active');
      loginOverlay.style.display = 'none';
    } else {
      loginOverlay.classList.add('active');
      loginOverlay.style.display = 'flex';
      setTimeout(() => {
        if (adminPasswordInput) adminPasswordInput.focus();
      }, 100);
    }
    if (hintPasscode) {
      hintPasscode.textContent = profileData.adminPasscode || 'admin123';
    }
  }

  window.handleLogout = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sessionStorage.removeItem('intro_card_admin_logged');
    if (loginOverlay) {
      loginOverlay.classList.add('active');
      loginOverlay.style.display = 'flex';
    }
    showToast('🔒 Dashboard Locked');
    setTimeout(() => {
      if (adminPasswordInput) adminPasswordInput.focus();
    }, 100);
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminPasswordInput.value.trim();
      const expected = profileData.adminPasscode || 'admin123';

      if (entered === expected) {
        sessionStorage.setItem('intro_card_admin_logged', 'true');
        loginOverlay.classList.remove('active');
        loginOverlay.style.display = 'none';
        loginErrorMsg.textContent = '';
        adminPasswordInput.value = '';
        showToast('🔓 Access Granted! Welcome Admin.');
      } else {
        loginErrorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Incorrect Passcode!';
        if (loginCard) {
          loginCard.classList.add('shake');
          setTimeout(() => loginCard.classList.remove('shake'), 400);
        }
      }
    });
  }

  if (togglePasswordBtn && adminPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      adminPasswordInput.setAttribute('type', type);
      togglePasswordBtn.innerHTML = type === 'password' ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', window.handleLogout);
  }

  checkSessionAuth();
});
