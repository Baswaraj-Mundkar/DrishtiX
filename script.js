// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: Starting initialization...");
    try {

    // --- Inject Theme Toggle into Navbar ---
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        // Only inject if it doesn't already exist
        if(!document.querySelector('.theme-toggle')){
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'theme-toggle';
            toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
            
            const currentTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

            const hamburger = document.querySelector('.hamburger');
            if (hamburger) {
                navContainer.insertBefore(toggleBtn, hamburger);
            } else {
                navContainer.appendChild(toggleBtn);
            }

            toggleBtn.addEventListener('click', () => {
                let theme = document.documentElement.getAttribute('data-theme');
                let newTheme = theme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                toggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            });
        }
    }

    // --- Dynamic Navbar Auth Setup ---
    window.logoutDrishtiX = function() {
        localStorage.removeItem('drishti_current_user');
        localStorage.removeItem('drishti_user_role');
        if(window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            window.location.reload();
        } else {
            window.location.href = 'index.html';
        }
    };

    function renderAuthLinks() {
        const navList = document.querySelector('.nav-links');
        if (!navList) return;

        const currentUser = localStorage.getItem('drishti_current_user');
        const userRole = localStorage.getItem('drishti_user_role');
        
        // Remove any existing auth items to prevent duplication
        document.querySelectorAll('.auth-nav-item').forEach(el => el.remove());
        
        const authLi = document.createElement('li');
        authLi.className = 'auth-nav-item';
        navList.appendChild(authLi);
        
        // Toggle Dashboard link visibility
        const dashLink = navList.querySelector('a[href="dashboard.html"]');
        const dashLi = dashLink ? dashLink.parentElement : null;

        if(currentUser) {
            const roleBadge = userRole === 'admin' ? `(${window.i18n.t('admin')})` : ''; 
            const firstName = currentUser.split(' ')[0];
            authLi.innerHTML = `
                <div style="display:flex; align-items:center; gap:1rem; margin-left:1rem;">
                    <span style="font-weight:600; color:var(--text);">${window.i18n.t('nav_hi', {name: firstName})} ${roleBadge}</span>
                    <a href="javascript:void(0)" onclick="logoutDrishtiX()" style="color:var(--danger, #ef4444); font-size:0.9rem; font-weight:600; padding:0; border:none; background:none;">${window.i18n.t('logout_btn')}</a>
                </div>
            `;
            if(dashLi) dashLi.style.display = 'block';
        } else {
            const isActive = window.location.pathname.includes('login.html') ? 'class="active"' : '';
            authLi.innerHTML = `<a href="login.html" ${isActive} style="background:var(--gradient); color:white; padding:0.5rem 1.5rem; border-radius:50px; font-weight:600; box-shadow: var(--shadow);">${window.i18n.t('signin_btn')}</a>`;
            if(dashLi) dashLi.style.display = 'none';
        }
    }

    renderAuthLinks();

    document.addEventListener('languageChanged', () => {
        renderAuthLinks();
        if (typeof updateSessionSection === 'function') updateSessionSection();
    });

    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '&#9776;';
            });
        });
    }

    // --- 2. Sticky Navbar styling on scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });

    // --- 3. Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Failsafe: Trigger faders after 2.5s anyway to avoid blank pages if IntersectionObserver fails
    setTimeout(() => {
        faders.forEach(fader => {
            if (!fader.classList.contains('appear')) {
                console.warn("script.js: Failsafe triggered for fader", fader);
                fader.classList.add('appear');
            }
        });
    }, 2500);

    // --- 4. Map Initialization for report.html ---
    try {
        if (typeof initMap === 'function') {
            initMap();
        }
    } catch (e) {
        console.error("script.js: Map Init Error (report.html):", e);
    }

    // --- 4.5 Map Initialization for index.html ---
    try {
        if (typeof initHomeMap === 'function') {
            initHomeMap();
        }
    } catch (e) {
        console.error("script.js: Map Init Error (index.html):", e);
    }

    // --- 5. Form Submission & LocalStorage Simulation ---
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        const currentUser = localStorage.getItem('drishti_current_user');
        
        // UX Enhancement: Restore Draft if exists
        const draft = JSON.parse(localStorage.getItem('drishti_draft_report'));
        if(draft) {
            const h = document.getElementById('headline');
            const p = document.getElementById('platform');
            const d = document.getElementById('description');
            if(h) h.value = draft.headline || '';
            if(p) p.value = draft.platform || '';
            if(d) d.value = draft.desc || '';
        }

        // Set name dynamically if logged in
        const nameInput = document.getElementById('reporterName');
        if(currentUser && nameInput) {
            nameInput.value = currentUser;
            nameInput.readOnly = true;
            nameInput.style.backgroundColor = 'var(--bg-subtle)';
            nameInput.style.cursor = 'not-allowed';
        }

        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Post-fill Barricade Check
            if(!currentUser) {
                const headline = document.getElementById('headline').value;
                const platform = document.getElementById('platform').value;
                const desc = document.getElementById('description').value;
                localStorage.setItem('drishti_draft_report', JSON.stringify({ headline, platform, desc }));
                
                reportForm.innerHTML = `
                    <div class="fade-in appear" style="text-align:center; padding: 4rem 1rem; border: 2px dashed var(--border); border-radius: 12px; background: var(--accent-soft); margin-top: 1rem;">
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" style="margin-bottom: 1.5rem;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <h3 style="color: var(--text); margin-bottom: 0.5rem; font-size: 1.8rem;">Secure Authentication Required</h3>
                        <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 1.1rem; max-width: 500px; margin-left: auto; margin-right: auto;">To maintain the integrity of our database, you must sign in to submit this incident. We have securely saved your draft.</p>
                        <a href="login.html" class="btn btn-primary" style="padding: 1rem 2.5rem; font-size: 1.1rem;">Go to Login Portal</a>
                    </div>
                `;
                return;
            }
            
            const reporterName = nameInput ? nameInput.value.trim() : currentUser;
            const headline = document.getElementById('headline').value.trim();
            const platform = document.getElementById('platform').value;
            const description = document.getElementById('description').value.trim();

            if (!headline || !platform || !description) {
                alert(window.i18n.t('form_error'));
                return;
            }

            const submitBtn = reportForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = window.i18n.t('submitting');
            submitBtn.disabled = true;

            const lat = document.getElementById('lat') ? document.getElementById('lat').value : null;
            const lng = document.getElementById('lng') ? document.getElementById('lng').value : null;

            // Prepare data for Backend (Excel)
            const reportData = {
                Name: reporterName,
                Headline: headline,
                Platform: platform,
                Description: description,
                Lat: lat,
                Lng: lng
            };

            fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData)
            })
            .then(async res => {
                if (res.status === 409) {
                    const errorData = await res.json();
                    throw new Error(errorData.error);
                }
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                alert(window.i18n.t('report_success'));
                reportForm.reset();
                localStorage.removeItem('drishti_draft_report');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                const latInput = document.getElementById('lat');
                if(latInput) latInput.value = '';
                const lngInput = document.getElementById('lng');
                if(lngInput) lngInput.value = '';
                const coordsDiv = document.getElementById('selected-coords');
                if(coordsDiv) coordsDiv.textContent = 'None';
            })
            .catch(err => {
                console.error("Backend Error:", err);
                alert(err.message || "Failed to save report to database. Please check connection.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- 6. Migration Helper: LocalStorage to Excel ---
    function migrateLocalStorageToExcel() {
        const localRS = localStorage.getItem('drishti_reports');
        if (!localRS) return;

        try {
            const reports = JSON.parse(localRS);
            if (!Array.isArray(reports) || reports.length === 0) return;

            console.log(`DrishtiX: Migrating ${reports.length} reports to Excel...`);
            
            // Map keys and preserve data
            const migrationQueue = reports.map(r => ({
                Headline: r.headline,
                Platform: r.platform,
                Description: r.description,
                Name: r.name,
                Lat: r.lat,
                Lng: r.lng,
                Status: r.status || 'Pending',
                Date: r.date || new Date().toLocaleDateString()
            }));

            // Sequentially post to avoid potential write locks (though Excel lib handles it)
            Promise.all(migrationQueue.map(item => 
                fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                })
            ))
            .then(() => {
                console.log("DrishtiX: Migration successful. Clearing localStorage.");
                localStorage.removeItem('drishti_reports');
            })
            .catch(err => console.error("Migration Error:", err));

        } catch (e) {
            console.error("Migration failed:", e);
        }
    }

    migrateLocalStorageToExcel();

    // --- 7. About Section Editor Logic ---
    initAboutEditor();

    // --- 7. Session Status Tracker ---
    updateSessionSection();
    } catch (globalError) {
        console.error("script.js: FATAL INITIALIZATION ERROR:", globalError);
        // Emergency reveal to prevent blank screen
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('appear'));
    }
});

function updateSessionSection() {
    const sessionInfo = document.getElementById('session-info');
    if (!sessionInfo) return;

    const currentUser = localStorage.getItem('drishti_current_user');
    const userRole = localStorage.getItem('drishti_user_role');

    if (currentUser) {
        const roleLabel = userRole === 'admin' ? (window.i18n.t('admin') || 'Admin') : (window.i18n.t('user') || 'User');
        sessionInfo.innerHTML = `
            <div class="card" style="max-width: 320px; margin: 0 auto; padding: 3rem 2rem; border: 2px solid var(--accent); display: flex; flex-direction: column; align-items: center; gap: 1.5rem; border-radius: 20px;">
                <div style="width: 80px; height: 80px; border-radius: 12px; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: white; box-shadow: var(--shadow);">
                    ${currentUser.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 style="margin-bottom: 0.25rem;">${window.i18n.t('nav_hi', {name: currentUser})}</h3>
                    <span class="badge" style="background: var(--accent-soft); color: var(--accent); padding: 0.2rem 0.8rem; border-radius: 5px; font-weight: bold; font-size: 0.85rem;">${window.i18n.t('acc_badge', {role: roleLabel})}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%;">
                    <a href="dashboard.html" class="btn btn-primary" style="padding: 0.75rem; font-size: 0.95rem; width: 100%; text-align:center;">${window.i18n.t('go_dash')}</a>
                    <button onclick="logoutDrishtiX()" class="btn btn-secondary" style="padding: 0.75rem; font-size: 0.95rem; width: 100%; color: var(--text);">${window.i18n.t('sign_out_acc')}</button>
                </div>
            </div>
        `;
    } else {
        sessionInfo.innerHTML = `
            <div class="card" style="max-width: 320px; margin: 0 auto; padding: 3rem 2rem; border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; gap: 1.5rem; opacity: 0.8;">
                <div style="width: 80px; height: 80px; border-radius: 12px; background: var(--bg-subtle); border: 2px dashed var(--border); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--text-muted);">
                    ?
                </div>
                <div>
                    <h3 style="margin-bottom: 0.25rem; color: var(--text-muted);">${window.i18n.t('no_session')}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">${window.i18n.t('secure_logout')}</p>
                </div>
                <a href="login.html" class="btn btn-primary" style="padding: 0.75rem 2rem; font-size: 1rem; width: 100%; text-align:center;">${window.i18n.t('signin_now')}</a>
            </div>
        `;
    }
}

function initMap() {
    const mapElement = document.getElementById('report-map');
    if (!mapElement) return;

    // Default location: India
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    const defaultZoom = 5;

    // Initialize Leaflet Map
    const map = L.map('report-map').setView([defaultLat, defaultLng], defaultZoom);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Create marker
    const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

    // DOM Elements
    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');
    const cityInput = document.getElementById('city');
    const coordDisplay = document.getElementById('selected-coords');
    const btnLocation = document.getElementById('btn-location');
    const btnSearchCity = document.getElementById('btn-search-city');
    const btnManualCoords = document.getElementById('btn-manual-coords');

    function updateMarker(lat, lng, zoomLevel = 13, animate = true) {
        const newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        
        if (animate) {
            map.flyTo(newLatLng, zoomLevel, {
                animate: true,
                duration: 1.5
            });
        } else {
            map.setView(newLatLng, zoomLevel);
        }

        latInput.value = parseFloat(lat).toFixed(6);
        lngInput.value = parseFloat(lng).toFixed(6);
        coordDisplay.textContent = `${parseFloat(lat).toFixed(5)}, ${parseFloat(lng).toFixed(5)}`;
    }

    marker.on('dragend', function (e) {
        const coords = e.target.getLatLng();
        updateMarker(coords.lat, coords.lng, map.getZoom(), false);
    });

    map.on('click', function(e) {
        updateMarker(e.latlng.lat, e.latlng.lng, map.getZoom(), false);
    });

    if (btnLocation) {
        btnLocation.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btnLocation.innerHTML;
            btnLocation.innerHTML = 'Locating...';
            
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        updateMarker(position.coords.latitude, position.coords.longitude, 15);
                        btnLocation.innerHTML = originalText;
                    }, 
                    error => {
                        alert(window.i18n.t('geo_error'));
                        btnLocation.innerHTML = originalText;
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                alert(window.i18n.t('geo_not_supported'));
                btnLocation.innerHTML = originalText;
            }
        });
    }

    if (btnSearchCity) {
        btnSearchCity.addEventListener('click', async (e) => {
            e.preventDefault();
            const city = cityInput.value.trim();
            if (!city) return alert(window.i18n.t('city_error'));

            const originalText = btnSearchCity.innerHTML;
            btnSearchCity.innerHTML = '...';
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
                const data = await res.json();
                
                if (data && data.length > 0) {
                    updateMarker(parseFloat(data[0].lat), parseFloat(data[0].lon), 13);
                } else {
                    alert(window.i18n.t('loc_not_found'));
                }
            } catch (err) {
                alert(window.i18n.t('loc_hunt_error'));
            } finally {
                btnSearchCity.innerHTML = originalText;
            }
        });
    }

    if (btnManualCoords) {
        btnManualCoords.addEventListener('click', (e) => {
            e.preventDefault();
            const lat = parseFloat(latInput.value);
            const lng = parseFloat(lngInput.value);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                updateMarker(lat, lng, map.getZoom() < 13 ? 13 : map.getZoom());
            } else {
                alert(window.i18n.t('coord_error'));
            }
        });
    }
}

function initHomeMap() {
    const homeMapEl = document.getElementById('home-map');
    if(!homeMapEl) return;
    
    // Seed demo data if none exists
    seedDemoReports();
    
    // Default location: India center
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    
    const map = L.map('home-map').setView([defaultLat, defaultLng], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    fetch('/api/reports')
    .then(res => res.json())
    .then(allReports => {
        let bounds = [];
        allReports.forEach(r => {
            if(r.Lat && r.Lng) {
                const lat = parseFloat(r.Lat);
                const lng = parseFloat(r.Lng);
                if(!isNaN(lat) && !isNaN(lng)) {
                    let color = "red";
                    if(r.Status === "Verified True") color = "green";
                    if(r.Status === "Pending") color = "orange";
                    
                    const circleIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="hotspot-pulse" style="background-color:${color}; --pulse-color:${color};"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    L.marker([lat, lng], {icon: circleIcon}).addTo(map)
                     .bindPopup(`<b>${r.Platform}</b><br>${r.Headline}<br><i>Status: ${r.Status || 'Pending'}</i>`);
                     
                    bounds.push([lat, lng]);
                }
            }
        });

        if(bounds.length > 0) {
            map.fitBounds(bounds, {padding: [50, 50], maxZoom: 12});
        }
    })
    .catch(err => console.error("Home Map Fetch Error:", err));
}

function initAboutEditor() {
    // Only run if we are on a page with the about editor elements
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    if(editableElements.length === 0) return;

    // 1. Handle Text Edits (Names, Roles, Details)
    editableElements.forEach(el => {
        const key = 'drishtix_about_' + el.getAttribute('data-edit');
        
        // Load saved data
        if (localStorage.getItem(key)) {
            el.innerText = localStorage.getItem(key);
        }
        
        // Save on input or blur
        el.addEventListener('input', () => {
            localStorage.setItem(key, el.innerText);
        });
        
        // Prevent Enter key from making new lines, just blur
        el.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                el.blur();
            }
        });
    });

    // 2. Handle Image Upload via Local File Picker (FileReader to Base64)
    const imageElements = document.querySelectorAll('.member-img');
    
    // Create a single hidden file input attached to the body
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    let currentActiveImageElement = null;
    let currentActiveImageKey = null;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !currentActiveImageElement || !currentActiveImageKey) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Str = event.target.result;
            // Save to local storage
            try {
                localStorage.setItem(currentActiveImageKey, base64Str);
                currentActiveImageElement.innerHTML = `<img src="${base64Str}" alt="Member Image">`;
            } catch (err) {
                alert(window.i18n.t('img_too_large') || "Image is too large to save in browser storage.");
            }
        };
        reader.readAsDataURL(file);
        // Clear the input so selecting the same file again triggers change event
        fileInput.value = '';
    });

    imageElements.forEach((el, index) => {
        const imgKey = 'drishtix_about_' + el.getAttribute('data-edit');
        const defaultIcon = index >= 4 ? (index === 4 ? "👨‍🏫" : "👩‍🏫") : "👤";

        // Load saved image
        if (localStorage.getItem(imgKey)) {
            el.innerHTML = `<img src="${localStorage.getItem(imgKey)}" alt="Member Image">`;
        }

        // Click to open file picker OR delete if already exists
        el.addEventListener('click', () => {
            if (localStorage.getItem(imgKey)) {
                const confirmDelete = confirm(window.i18n.t('img_change_confirm'));
                if (!confirmDelete) {
                    localStorage.removeItem(imgKey);
                    el.innerHTML = defaultIcon;
                    return;
                }
            }
            
            currentActiveImageElement = el;
            currentActiveImageKey = imgKey;
            fileInput.click();
        });
    });
}

function seedDemoReports() {
    const existing = localStorage.getItem('drishti_reports');
    if (existing && JSON.parse(existing).length > 3) return; 

    const demoData = [
        { id: 1, lat: 19.0760, lng: 72.8777, platform: "WhatsApp", headline: "Deepfake video of local politician circulated in Mumbai", status: "Verified Fake", name: "System Admin", date: "2026-03-20" },
        { id: 2, lat: 28.7041, lng: 77.1025, platform: "Twitter", headline: "Misleading pollution statistics shared during Delhi peak hours", status: "Pending", name: "Official Source", date: "2026-03-21" },
        { id: 3, lat: 12.9716, lng: 77.5946, platform: "Facebook", headline: "Scam link promising free water distribution in Bangalore", status: "Verified Fake", name: "System Admin", date: "2026-03-22" },
        { id: 4, lat: 18.5204, lng: 73.8567, platform: "WhatsApp", headline: "Rumors about PCCOER college closure due to festival", status: "Verified Fake", name: "Collector Office", date: "2026-03-23" },
        { id: 5, lat: 15.2993, lng: 74.1240, platform: "Instagram", headline: "Old beach cleaning photos shared as current Goa cleanup", status: "Verified True", name: "Govt Portal", date: "2026-03-24" }
    ];

    localStorage.setItem('drishti_reports', JSON.stringify(demoData));
}
