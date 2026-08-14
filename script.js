/* ==========================================================================
   Digital Business Card - Public Card Script & vCard Generator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Default Profile State
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
    mapUrl: 'https://maps.google.com/?q=Chennai,+Tamil+Nadu'
  };

  let profileData = { ...defaultProfile };

  // Load saved profile data from LocalStorage
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
      // Save cleaned data
      localStorage.setItem('intro_card_profile', JSON.stringify(profileData));
    } catch (e) {
      console.error('Error loading saved profile data:', e);
    }
  }

  // DOM Elements
  const avatarImg = document.getElementById('avatarImg');
  const displayName = document.getElementById('displayName');
  const displayTitle = document.getElementById('displayTitle');
  const displayCompanyAccent = document.getElementById('displayCompanyAccent');
  const displayCompany = document.getElementById('displayCompany');
  const displayBio = document.getElementById('displayBio');
  const displayEmail = document.getElementById('displayEmail');
  const displayWebsite = document.getElementById('displayWebsite');
  const displayPhone = document.getElementById('displayPhone');
  
  const emailCard = document.getElementById('emailCard');
  const websiteCard = document.getElementById('websiteCard');
  const phoneCard = document.getElementById('phoneCard');

  const saveContactBtn = document.getElementById('saveContactBtn');
  const connectBtn = document.getElementById('connectBtn');

  // Modals
  const qrModal = document.getElementById('qrModal');
  const closeQrModal = document.getElementById('closeQrModal');
  const shareUrlBtn = document.getElementById('shareUrlBtn');
  const qrcodeContainer = document.getElementById('qrcode');
  const qrUrlInput = document.getElementById('qrUrlInput');
  const downloadQrBtn = document.getElementById('downloadQrBtn');

  const toast = document.getElementById('toast');
  let qrCodeInstance = null;

  // Render Profile Data to UI
  function renderProfile() {
    if (profileData.avatar) {
      avatarImg.src = profileData.avatar;
    }

    displayName.innerHTML = `${escapeHtml(profileData.firstName)} <span class="highlight">${escapeHtml(profileData.lastName)}</span>`;
    displayTitle.textContent = profileData.title;
    displayCompanyAccent.textContent = profileData.companyAccent;
    displayCompany.textContent = profileData.company;

    // Convert newlines in bio to <br>
    const formattedBio = escapeHtml(profileData.bio).replace(/\n/g, '<br>');
    displayBio.innerHTML = formattedBio.replace('INTRO™', '<span class="highlight-inline">INTRO™</span>');

    displayEmail.textContent = profileData.email;
    emailCard.href = `mailto:${profileData.email}`;

    displayWebsite.textContent = profileData.website;
    const cleanWebsite = profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`;
    websiteCard.href = cleanWebsite;

    displayPhone.textContent = profileData.phone;
    const cleanPhone = profileData.phone.replace(/[^0-9+]/g, '');
    phoneCard.href = `tel:${cleanPhone}`;

    // Render Visual Map Widget Section
    const mapCardContainer = document.getElementById('mapCardContainer');
    const mapIframe = document.getElementById('mapIframe');
    const mapOverlayLink = document.getElementById('mapOverlayLink');
    const mapBadgeTitle = document.getElementById('mapBadgeTitle');
    const mapBadgeSub = document.getElementById('mapBadgeSub');

    if (mapCardContainer) {
      if (profileData.location && profileData.location.trim() !== '') {
        mapCardContainer.style.display = 'block';
        const loc = profileData.location.trim();
        const parts = loc.split(',');
        const title = parts[0] ? parts[0].trim() : loc;
        const sub = parts.slice(1).join(',').trim() || 'Location Map';
        
        if (mapBadgeTitle) mapBadgeTitle.textContent = title;
        if (mapBadgeSub) mapBadgeSub.textContent = sub;

        const targetMapUrl = profileData.mapUrl && profileData.mapUrl.trim() !== '' 
          ? profileData.mapUrl 
          : `https://maps.google.com/?q=${encodeURIComponent(loc)}`;
        
        if (mapOverlayLink) mapOverlayLink.href = targetMapUrl;

        const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(loc)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
        if (mapIframe && mapIframe.src !== embedUrl) {
          mapIframe.src = embedUrl;
        }
      } else {
        mapCardContainer.style.display = 'none';
      }
    }

    // Conditional Social Buttons Display
    const waLink = document.getElementById('waLink');
    const linkedinLink = document.getElementById('linkedinLink');
    const instaLink = document.getElementById('instaLink');
    const fbLink = document.getElementById('fbLink');
    const socialGrid = document.querySelector('.social-grid');

    let activeSocialCount = 0;

    function toggleSocialBtn(btnElement, url) {
      if (btnElement) {
        if (url && url.trim() !== '') {
          btnElement.style.display = 'flex';
          btnElement.href = url.trim();
          activeSocialCount++;
        } else {
          btnElement.style.display = 'none';
        }
      }
    }

    toggleSocialBtn(waLink, profileData.whatsapp);
    toggleSocialBtn(linkedinLink, profileData.linkedin);
    toggleSocialBtn(instaLink, profileData.instagram);
    toggleSocialBtn(fbLink, profileData.facebook);

    if (socialGrid) {
      socialGrid.style.display = activeSocialCount > 0 ? 'flex' : 'none';
    }

    // Apply Dynamic Accent Color
    if (profileData.accentColor) {
      const rgb = hexToRgb(profileData.accentColor);
      document.documentElement.style.setProperty('--color-accent', profileData.accentColor);
      document.documentElement.style.setProperty('--color-accent-rgb', rgb);
      document.documentElement.style.setProperty('--color-accent-glow', `rgba(${rgb}, 0.45)`);
    }
  }

  // Convert Hex color string to RGB comma-separated string
  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return '255, 85, 0';
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  // Helper to escape HTML characters
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Toast Notification
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // 1. Save Contact - Download .vcf file
  function downloadVCard() {
    const cleanPhone = profileData.phone.replace(/[^0-9+]/g, '');
    const cleanWebsite = profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`;

    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profileData.firstName} ${profileData.lastName}`,
      `N:${profileData.lastName};${profileData.firstName};;;`,
      `ORG:${profileData.companyAccent} ${profileData.company}`,
      `TITLE:${profileData.title}`,
      `TEL;TYPE=CELL:${cleanPhone}`,
      `EMAIL;TYPE=WORK:${profileData.email}`,
      `URL:${cleanWebsite}`,
      `NOTE:${profileData.bio.replace(/\n/g, ' ')}`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profileData.firstName}_${profileData.lastName}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('💾 Contact saved! (.vcf downloaded)');
  }

  saveContactBtn.addEventListener('click', downloadVCard);

  // 2. Connect Button - Open QR Code Modal
  function renderQRCode(urlToEncode) {
    qrcodeContainer.innerHTML = '';
    qrCodeInstance = new QRCode(qrcodeContainer, {
      text: urlToEncode,
      width: 180,
      height: 180,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  function openQRModal() {
    qrModal.classList.add('active');
    
    let currentUrl = window.location.href;
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      currentUrl = `http://10.164.119.211:3000`;
    }
    
    qrUrlInput.value = currentUrl;
    renderQRCode(currentUrl);
  }

  qrUrlInput.addEventListener('input', (e) => {
    const newUrl = e.target.value.trim();
    if (newUrl) {
      renderQRCode(newUrl);
    }
  });

  downloadQrBtn.addEventListener('click', () => {
    const img = qrcodeContainer.querySelector('img');
    if (img && img.src) {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = `${profileData.firstName}_${profileData.lastName}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📥 QR Code downloaded!');
    } else {
      const canvas = qrcodeContainer.querySelector('canvas');
      if (canvas) {
        const imageURI = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageURI;
        link.download = `${profileData.firstName}_${profileData.lastName}_QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('📥 QR Code downloaded!');
      }
    }
  });

  connectBtn.addEventListener('click', openQRModal);

  closeQrModal.addEventListener('click', () => {
    qrModal.classList.remove('active');
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) {
      qrModal.classList.remove('active');
    }
  });

  // Share Card Link
  shareUrlBtn.addEventListener('click', async () => {
    const shareData = {
      title: `${profileData.firstName} ${profileData.lastName} - INTRO Card`,
      text: `Connect with ${profileData.firstName} ${profileData.lastName} (${profileData.title} at ${profileData.companyAccent} ${profileData.company})`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Card link copied to clipboard!');
    }
  });

  // Initialize
  renderProfile();
});
