/* ==========================================================================
   GRAIL TRACKER APPLICATION LOGIC
   ========================================================================== */

// Capture Console Logs for On-Device Debugging
const DEBUG_LOGS = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

function addDebugLog(type, ...args) {
  const msg = args.map(arg => {
    if (arg instanceof Error) return `${arg.message}\n${arg.stack}`;
    return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
  }).join(' ');
  DEBUG_LOGS.push(`[${type}] ${new Date().toLocaleTimeString()}: ${msg}`);
  if (DEBUG_LOGS.length > 50) DEBUG_LOGS.shift();
  
  const logViewer = document.getElementById("debug-log-viewer");
  if (logViewer) {
    logViewer.textContent = DEBUG_LOGS.join('\n');
  }
}

console.log = (...args) => {
  originalLog.apply(console, args);
  addDebugLog('INFO', ...args);
};
console.error = (...args) => {
  originalError.apply(console, args);
  addDebugLog('ERROR', ...args);
};
console.warn = (...args) => {
  originalWarn.apply(console, args);
  addDebugLog('WARN', ...args);
};

window.onerror = function(message, source, lineno, colno, error) {
  console.error(`Uncaught: ${message} at ${source}:${lineno}:${colno}`);
  return false;
};
window.onunhandledrejection = function(event) {
  console.error(`Promise Rejection: ${event.reason}`);
};


// 1. Curated Watch Catalog (Autopopulate Database)
const CURATED_CATALOG = [
  {
    brand: "Rolex",
    model: "Submariner Date",
    ref: "124060",
    price: 9100,
    dial: "41mm",
    lug: "47.6mm",
    movement: "Automatic (Caliber 3230)",
    strap: "Oyster Steel Bracelet",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80",
    notes: "The quintessential luxury dive watch. Created in 1953, it sets the standard for all divers. Timeless design, perfect dimensions, and unmatched versatility.",
    priority: 5,
    status: "wished"
  },
  {
    brand: "Omega",
    model: "Speedmaster Professional Moonwatch",
    ref: "310.30.42.50.01.002",
    price: 7600,
    dial: "42mm",
    lug: "47.2mm",
    movement: "Manual Wind (Caliber 3861 Co-Axial)",
    strap: "Nixon-style Steel Bracelet",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
    notes: "The legendary Moonwatch. Manual wind, Hesalite/Sapphire glass, and historical pedigree. It represents human adventure and precision engineering.",
    priority: 4,
    status: "wished"
  },
  {
    brand: "Tissot",
    model: "PRX Powermatic 80",
    ref: "T137.407.11.051.00",
    price: 675,
    dial: "40mm",
    lug: "44.6mm",
    movement: "Automatic (Powermatic 80)",
    strap: "Integrated Steel Bracelet",
    image: "https://images.unsplash.com/photo-1629581678313-36cf745a9af9?w=800&auto=format&fit=crop&q=80",
    notes: "Outstanding modern re-issue of a 1978 design. The integrated bracelet catch the light beautifully, and the waffle dial punches way above its price point.",
    priority: 2,
    status: "wished"
  },
  {
    brand: "Seiko",
    model: "Alpinist",
    ref: "SPB121",
    price: 725,
    dial: "39.5mm",
    lug: "46.4mm",
    movement: "Automatic (Caliber 6R35)",
    strap: "Brown Grained Leather Strap",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
    notes: "A beautiful adventure watch with an inner rotating compass ring, forest green dial, and gold hands. Rich character and excellent water resistance.",
    priority: 3,
    status: "wished"
  },
  {
    brand: "Tudor",
    model: "Black Bay 58",
    ref: "M79030N-0001",
    price: 3900,
    dial: "39mm",
    lug: "47.0mm",
    movement: "Automatic (Manufacture MT5402)",
    strap: "Rivet Steel Bracelet",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    notes: "A tribute to the brand's first divers' watches. Its proportions are a dream for smaller wrists. The gilt accents and matte dial give it a gorgeous vintage feel.",
    priority: 4,
    status: "wished"
  },
  {
    brand: "Casio",
    model: "G-Shock 'CasiOak'",
    ref: "GA-2100-1A",
    price: 99,
    dial: "45.4mm",
    lug: "48.5mm",
    movement: "Quartz (Module 5611)",
    strap: "Black Resin Strap",
    image: "https://images.unsplash.com/photo-1608962247090-7e824901e14f?w=800&auto=format&fit=crop&q=80",
    notes: "Indestructible structure meets luxury-styled octagonal bezel. Incredibly slim, lightweight, and perfect for hiking, chores, or sport activities.",
    priority: 1,
    status: "acquired"
  },
  {
    brand: "Cartier",
    model: "Tank Must Large",
    ref: "WSTA0041",
    price: 3100,
    dial: "33.7mm x 25.5mm",
    lug: "33.7mm",
    movement: "High Autonomy Quartz",
    strap: "Black Grained Calfskin Strap",
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80",
    notes: "The epitome of dress elegance since 1917. Worn by royalty and artists alike. A rectangular masterpiece that fits perfectly under any formal cuff.",
    priority: 3,
    status: "wished"
  },
  {
    brand: "Audemars Piguet",
    model: "Royal Oak 'Jumbo' Extra-Thin",
    ref: "16202ST.OO.1240ST.01",
    price: 33000,
    dial: "39mm",
    lug: "48.6mm",
    movement: "Automatic (Caliber 7121)",
    strap: "Integrated Steel Bracelet",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    notes: "Gérald Genta's 1972 chef-d'œuvre. The octagonal bezel with exposed hexagonal screws and Tapisserie dial defined the luxury sports watch category.",
    priority: 5,
    status: "wished"
  },
  {
    brand: "Hamilton",
    model: "Khaki Field Mechanical",
    ref: "H69439931",
    price: 575,
    dial: "38mm",
    lug: "47.0mm",
    movement: "Manual (Caliber H-50)",
    strap: "Green Canvas NATO Strap",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=800&auto=format&fit=crop&q=80",
    notes: "Classic military design that dates back to the mid-20th century. Rugged sandblasted steel case, clean numerals, and a robust 80-hour power reserve.",
    priority: 2,
    status: "wished"
  }
];

// 2. Application State
let STATE = {
  watches: [],
  lastUpdated: 0,
  settings: {
    githubPat: "",
    gistId: "",
    autoSync: true
  },
  theme: "auto", // 'auto', 'light', or 'dark'
  viewMode: "grid" // 'grid' or 'list'
};

// 3. UI Selectors
const DOM = {
  watchesContainer: document.getElementById("watches-container"),
  emptyState: document.getElementById("empty-state"),
  
  // Headers Stats
  statTotalValue: document.getElementById("stat-total-value"),
  statCount: document.getElementById("stat-count"),
  
  // Controls
  searchFilter: document.getElementById("search-filter"),
  sortBy: document.getElementById("sort-by"),
  viewGrid: document.getElementById("view-grid"),
  viewList: document.getElementById("view-list"),
  
  // Buttons
  btnAddWatch: document.getElementById("btn-add-watch"),
  btnEmptyAdd: document.getElementById("btn-empty-add"),
  btnLoadDemo: document.getElementById("btn-load-demo"),
  btnSettings: document.getElementById("btn-settings"),
  btnThemeToggle: document.getElementById("btn-theme-toggle"),
  btnSyncNow: document.getElementById("btn-sync-now"),
  btnCancelWatch: document.getElementById("btn-cancel-watch"),
  btnCloseWatchModal: document.getElementById("btn-close-watch-modal"),
  btnCloseSettingsModal: document.getElementById("btn-close-settings-modal"),
  btnCloseInspect: document.getElementById("btn-close-inspect"),
  
  // Modals & Forms
  modalWatch: document.getElementById("modal-watch"),
  modalWatchTitle: document.getElementById("modal-watch-title"),
  modalSettings: document.getElementById("modal-settings"),
  modalInspect: document.getElementById("modal-inspect"),
  
  watchForm: document.getElementById("watch-form"),
  autocompleteDropdown: document.getElementById("autocomplete-dropdown"),
  watchSearchInput: document.getElementById("watch-search-input"),
  searchSpinner: document.getElementById("search-spinner"),
  imagePreviewContainer: document.getElementById("image-preview-container"),
  imagePreview: document.getElementById("image-preview"),
  
  // Form fields
  watchId: document.getElementById("watch-id"),
  watchBrand: document.getElementById("watch-brand"),
  watchModel: document.getElementById("watch-model"),
  watchRef: document.getElementById("watch-ref"),
  watchPrice: document.getElementById("watch-price"),
  watchDial: document.getElementById("watch-dial"),
  watchLug: document.getElementById("watch-lug"),
  watchMovement: document.getElementById("watch-movement"),
  watchStrap: document.getElementById("watch-strap"),
  watchImage: document.getElementById("watch-image"),
  watchStatus: document.getElementById("watch-status"),
  watchNotes: document.getElementById("watch-notes"),
  
  // Settings fields
  settingsPat: document.getElementById("settings-pat"),
  settingsGistId: document.getElementById("settings-gist-id"),
  settingsAutoSync: document.getElementById("settings-auto-sync"),
  btnSaveSettings: document.getElementById("btn-save-settings"),
  btnCreateGist: document.getElementById("btn-create-gist"),
  btnExportJson: document.getElementById("btn-export-json"),
  importJsonFile: document.getElementById("import-json-file"),
  btnClearAll: document.getElementById("btn-clear-all"),
  
  // Inspect details
  inspectBrand: document.getElementById("inspect-brand"),
  inspectModel: document.getElementById("inspect-model"),
  inspectRef: document.getElementById("inspect-ref"),
  inspectImage: document.getElementById("inspect-image"),
  inspectPrice: document.getElementById("inspect-price"),
  inspectNotes: document.getElementById("inspect-notes"),
  
  inspectSpecBrand: document.getElementById("inspect-spec-brand"),
  inspectSpecModel: document.getElementById("inspect-spec-model"),
  inspectSpecRef: document.getElementById("inspect-spec-ref"),
  inspectSpecDial: document.getElementById("inspect-spec-dial"),
  inspectSpecLug: document.getElementById("inspect-spec-lug"),
  inspectSpecMovement: document.getElementById("inspect-spec-movement"),
  inspectSpecStrap: document.getElementById("inspect-spec-strap"),
  inspectSpecStatus: document.getElementById("inspect-spec-status"),
  
  btnInspectEdit: document.getElementById("btn-inspect-edit"),
  btnInspectDelete: document.getElementById("btn-inspect-delete"),
  
  // Indicators
  syncStatusBar: document.getElementById("sync-status-bar"),
  syncStatusText: document.getElementById("sync-status-text"),
  syncDot: document.getElementById("sync-dot"),
  footerSyncMsg: document.getElementById("footer-sync-msg"),
  toastContainer: document.getElementById("toast-container"),

  // Cloud Sync Diagnostics
  diagLocalCount: document.getElementById("diag-local-count"),
  diagLocalTime: document.getElementById("diag-local-time"),
  diagCloudCount: document.getElementById("diag-cloud-count"),
  diagCloudTime: document.getElementById("diag-cloud-time"),
  diagMsgBox: document.getElementById("diag-msg-box"),
  btnDiagPull: document.getElementById("btn-diag-pull"),
  btnDiagPush: document.getElementById("btn-diag-push"),
  btnDiagMerge: document.getElementById("btn-diag-merge"),
  btnToggleDebug: document.getElementById("btn-toggle-debug")
};

// State key variables
const STORAGE_KEY = "grail_tracker_state";

// 4. Initialize App
window.addEventListener("DOMContentLoaded", () => {
  loadLocalState();
  initTheme();
  renderWatches();
  setupEventListeners();
  
  // Trigger auto sync on load if Gist credentials exist
  if (STATE.settings.githubPat && STATE.settings.gistId && STATE.settings.autoSync) {
    syncWithGist();
  } else {
    updateSyncUIStatus("offline");
  }
  
  // Initialize Lucide Icons
  lucide.createIcons();
});

// 5. Theme Handlers
function initTheme() {
  const savedTheme = localStorage.getItem("grail_tracker_theme") || "auto";
  STATE.theme = savedTheme;
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  const root = document.documentElement;
  const themeIcon = document.getElementById("theme-icon");
  
  if (theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.setAttribute("data-theme", "dark");
    if (themeIcon) themeIcon.setAttribute("data-lucide", "sun");
  } else {
    document.body.removeAttribute("data-theme");
    if (themeIcon) themeIcon.setAttribute("data-lucide", "moon");
  }
  
  localStorage.setItem("grail_tracker_theme", theme);
  lucide.createIcons();
}

function toggleTheme() {
  let nextTheme = "light";
  if (STATE.theme === "auto") {
    nextTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
  } else if (STATE.theme === "light") {
    nextTheme = "dark";
  } else {
    nextTheme = "auto";
  }
  
  STATE.theme = nextTheme;
  applyTheme(nextTheme);
  
  // Inform user via toast
  const modeText = nextTheme === "auto" ? "Device System Mode" : `${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode`;
  showToast("Theme Updated", `Switched to ${modeText}`, "info");
}

// 6. Data Loaders & Caching
function loadLocalState() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      STATE.watches = parsed.watches || [];
      STATE.lastUpdated = parsed.lastUpdated || 0;
      const loadedSettings = parsed.settings || {};
      STATE.settings = {
        githubPat: loadedSettings.githubPat || "",
        gistId: loadedSettings.gistId || "",
        autoSync: loadedSettings.autoSync !== false
      };
      STATE.viewMode = parsed.viewMode || "grid";
    } catch (e) {
      console.error("Error parsing cache", e);
      showToast("Data Loading Error", "Local cache corrupt. Resetting database.", "error");
    }
  } else {
    STATE.watches = [];
    STATE.lastUpdated = 0;
  }
  
  // Apply View Mode
  if (STATE.viewMode === "list") {
    DOM.watchesContainer.classList.remove("grid-view");
    DOM.watchesContainer.classList.add("list-view");
    DOM.viewGrid.classList.remove("active");
    DOM.viewList.classList.add("active");
  }
}

function saveLocalState(updateTimestamp = false) {
  if (updateTimestamp) {
    STATE.lastUpdated = Date.now();
  }
  const serialized = JSON.stringify({
    watches: STATE.watches,
    lastUpdated: STATE.lastUpdated,
    settings: STATE.settings,
    viewMode: STATE.viewMode
  });
  localStorage.setItem(STORAGE_KEY, serialized);
  
  // Automatically trigger sync if autosync is active
  if (STATE.settings.githubPat && STATE.settings.gistId && STATE.settings.autoSync) {
    syncWithGist(true); // silent push update
  }
}

// 7. Watch Database Syncing Engine (GitHub Gist API)
async function syncWithGist(isSilentPush = false, forcePull = false) {
  const { githubPat, gistId } = STATE.settings;
  if (!githubPat || !gistId) {
    updateSyncUIStatus("offline");
    return;
  }

  let loaderToastId = null;
  if (!isSilentPush) {
    loaderToastId = showToast("Syncing Database", "Connecting to GitHub Gist...", "loading");
  }
  updateSyncUIStatus("syncing");

  try {
    // 1. Fetch remote content
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "GET",
      headers: {
        "Authorization": `token ${githubPat}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const gistData = await response.json();
    const fileName = "grail_tracker_watches.json";
    
    // Check if the file exists in the Gist
    if (gistData.files && gistData.files[fileName]) {
      const remoteData = JSON.parse(gistData.files[fileName].content);
      const remoteTimestamp = remoteData.lastUpdated || 0;
      const localTimestamp = STATE.lastUpdated || 0;

      if (forcePull || remoteTimestamp > localTimestamp) {
        // Remote is newer - Pull changes
        STATE.watches = remoteData.watches || [];
        STATE.lastUpdated = remoteTimestamp;
        
        // Save local copy without triggering recursive save-syncs
        const serialized = JSON.stringify({
          watches: STATE.watches,
          lastUpdated: STATE.lastUpdated,
          settings: STATE.settings,
          viewMode: STATE.viewMode
        });
        localStorage.setItem(STORAGE_KEY, serialized);
        
        renderWatches();
        if (loaderToastId) dismissToast(loaderToastId);
        showToast("Database Synced", "Successfully pulled newer data from GitHub.", "success");
      } 
      else if (localTimestamp > remoteTimestamp || !remoteTimestamp) {
        // Local is newer - Push changes
        await pushStateToGist(githubPat, gistId);
        if (loaderToastId) dismissToast(loaderToastId);
        if (!isSilentPush) showToast("Database Synced", "Successfully pushed local updates to cloud.", "success");
      } 
      else {
        // Equal - No actions needed
        if (loaderToastId) dismissToast(loaderToastId);
        if (!isSilentPush) showToast("Database Synced", "Cloud and local data are fully in sync.", "success");
      }
    } else {
      // File not present in Gist - Initialize file with local data
      await pushStateToGist(githubPat, gistId);
      if (loaderToastId) dismissToast(loaderToastId);
      showToast("Gist Initialized", "Created watch file in your Gist.", "success");
    }

    updateSyncUIStatus("online");
  } catch (error) {
    console.error("Gist Sync failed:", error);
    if (loaderToastId) dismissToast(loaderToastId);
    showToast("Sync Failed", error.message || "Failed to contact GitHub Gist", "error");
    updateSyncUIStatus("error");
  }
}

async function pushStateToGist(pat, gistId) {
  const payload = {
    watches: STATE.watches,
    lastUpdated: STATE.lastUpdated
  };

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `token ${pat}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      files: {
        "grail_tracker_watches.json": {
          content: JSON.stringify(payload, null, 2)
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to push to Gist: Status ${response.status}`);
  }
}

async function createNewPrivateGist(pat) {
  if (!pat) {
    showToast("Creation Failed", "Please provide a GitHub PAT first.", "error");
    return;
  }

  const loaderToastId = showToast("Creating Gist", "Generating new private Gist on GitHub...", "loading");

  try {
    const payload = {
      watches: STATE.watches,
      lastUpdated: STATE.lastUpdated
    };

    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Authorization": `token ${pat}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: "Grail Tracker Cloud Sync Database",
        public: false,
        files: {
          "grail_tracker_watches.json": {
            content: JSON.stringify(payload, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub returned status ${response.status}`);
    }

    const data = await response.json();
    dismissToast(loaderToastId);
    
    // Save to settings inputs
    DOM.settingsGistId.value = data.id;
    showToast("Gist Created!", `ID: ${data.id.substring(0, 8)}... saved. Click 'Save Settings' to apply.`, "success");
  } catch (error) {
    console.error("Gist creation error:", error);
    dismissToast(loaderToastId);
    showToast("Creation Failed", error.message || "Could not create Gist", "error");
  }
}

function updateSyncUIStatus(status) {
  if (status === "online") {
    DOM.syncStatusBar.style.display = "flex";
    DOM.syncStatusBar.style.backgroundColor = "hsla(142, 60%, 40%, 0.1)";
    DOM.syncStatusBar.style.borderColor = "hsla(142, 60%, 40%, 0.25)";
    DOM.syncStatusText.innerHTML = `<i data-lucide="cloud-lightning" style="color:var(--success);"></i> Cloud Sync Connected (Gist: ${STATE.settings.gistId.substring(0,8)}...)`;
    DOM.syncDot.className = "sync-indicator-dot online";
    DOM.footerSyncMsg.textContent = "Synced Cloud Database";
    DOM.btnSyncNow.style.display = "inline-flex";
  } else if (status === "syncing") {
    DOM.syncDot.className = "sync-indicator-dot syncing";
    DOM.footerSyncMsg.textContent = "Synchronizing...";
  } else if (status === "error") {
    DOM.syncStatusBar.style.display = "flex";
    DOM.syncStatusBar.style.backgroundColor = "hsla(350, 75%, 50%, 0.1)";
    DOM.syncStatusBar.style.borderColor = "hsla(350, 75%, 50%, 0.25)";
    DOM.syncStatusText.innerHTML = `<i data-lucide="alert-triangle" style="color:var(--danger);"></i> Cloud connection failed. Sync suspended. Check settings.`;
    DOM.syncDot.className = "sync-indicator-dot offline";
    DOM.footerSyncMsg.textContent = "Sync Connection Error";
    DOM.btnSyncNow.style.display = "inline-flex";
  } else {
    // Offline / unconfigured
    DOM.syncStatusBar.style.display = "flex";
    DOM.syncStatusBar.style.backgroundColor = "var(--bg-sync-bar)";
    DOM.syncStatusBar.style.borderColor = "var(--border-color)";
    DOM.syncStatusText.innerHTML = `<i data-lucide="cloud-off"></i> Local Cache Active. Configure settings to backup collection to cloud.`;
    DOM.syncDot.className = "sync-indicator-dot";
    DOM.footerSyncMsg.textContent = "Local Cache Mode";
    DOM.btnSyncNow.style.display = "none";
  }
  lucide.createIcons();
}



// 8. Search Autocomplete Logic (Wikipedia + Curated Catalog)
let autocompleteTimeout = null;

function handleWatchSearchInput(e) {
  const query = e.target.value.trim();
  
  if (autocompleteTimeout) clearTimeout(autocompleteTimeout);
  
  if (query.length < 2) {
    DOM.autocompleteDropdown.style.display = "none";
    DOM.searchSpinner.style.display = "none";
    return;
  }

  DOM.searchSpinner.style.display = "block";
  
  autocompleteTimeout = setTimeout(() => {
    performAutocompleteSearch(query);
  }, 400); // Debounce autocomplete
}

async function performAutocompleteSearch(query) {
  const matches = [];

  // 1. Check local Curated Catalog
  const lowerQuery = query.toLowerCase();
  CURATED_CATALOG.forEach(watch => {
    if (watch.brand.toLowerCase().includes(lowerQuery) || 
        watch.model.toLowerCase().includes(lowerQuery) ||
        (watch.ref && watch.ref.toLowerCase().includes(lowerQuery))) {
      matches.push({
        type: "catalog",
        title: `${watch.brand} ${watch.model}`,
        subtitle: watch.ref ? `Ref: ${watch.ref} (Curated)` : "Curated Watch Data",
        data: watch
      });
    }
  });

  // 2. Query Wikipedia API as a fallback/addition (using the generator for full-text and immediate properties)
  if (matches.length < 5) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(query)}&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=800&pilimit=5&exintro=1&explaintext=1&exlimit=5&formatversion=2`;
      const response = await fetch(wikiUrl);
      if (response.ok) {
        const data = await response.json();
        const pages = data.query?.pages || [];
        
        pages.forEach(page => {
          // Exclude duplicate titles
          const alreadyMatched = matches.some(m => m.title.toLowerCase() === page.title.toLowerCase());
          if (!alreadyMatched) {
            const brand = guessBrandFromTitle(page.title);
            const model = guessModelFromTitle(page.title, brand);
            const specs = parseWikiExtract(page.extract || "");
            const image = page.original?.source || page.thumbnail?.source || "";
            
            matches.push({
              type: "wiki",
              title: page.title,
              subtitle: page.extract ? page.extract.substring(0, 70) + "..." : "Wikipedia Article",
              data: {
                brand: brand,
                model: model,
                ref: "",
                price: "",
                dial: specs.dial,
                lug: specs.lug,
                movement: specs.movement,
                strap: specs.strap,
                image: image,
                notes: page.extract ? page.extract.substring(0, 300) + "... (Source: Wikipedia)" : "",
                status: "wished"
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("Wikipedia search failed:", error);
    }
  }

  DOM.searchSpinner.style.display = "none";
  displayAutocompleteResults(matches);
}

// Helper utilities for autocomplete matching & text scraping
function guessBrandFromTitle(title) {
  const brands = ["Rolex", "Omega", "Seiko", "Tudor", "Casio", "Cartier", "Audemars Piguet", "Hamilton", "Tissot", "Patek Philippe", "Citizen", "IWC", "Breitling", "Longines", "Panerai", "Oris", "Sinn", "Nomos", "Grand Seiko", "Bulova", "Timex", "Orient", "Zenith", "TAG Heuer"];
  const lowerTitle = title.toLowerCase();
  for (const brand of brands) {
    if (lowerTitle.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return title.split(" ")[0] || "";
}

function guessModelFromTitle(title, brand) {
  if (!brand) return title;
  const regex = new RegExp(`\\b${brand}\\b`, "gi");
  let model = title.replace(regex, "").trim();
  model = model.replace(/^\s*[-:|]\s*/, "").replace(/\s+/g, " ");
  // Truncate typical trailing seller details
  const cleanRegex = /\b(buy|price|specs|review|for sale|authorized dealer|shop)\b.*/i;
  model = model.replace(cleanRegex, "").trim();
  return model;
}

function extractPriceFromItem(item) {
  const pagemap = item.pagemap || {};
  if (pagemap.offer && pagemap.offer[0] && pagemap.offer[0].price) {
    const priceStr = pagemap.offer[0].price.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(priceStr);
    if (!isNaN(parsed) && parsed > 0) return Math.round(parsed);
  }
  if (pagemap.product && pagemap.product[0] && pagemap.product[0].price) {
    const priceStr = pagemap.product[0].price.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(priceStr);
    if (!isNaN(parsed) && parsed > 0) return Math.round(parsed);
  }
  const snippet = item.snippet || "";
  const priceRegex = /\$\s*([0-9,]+(?:\.[0-9]{2})?)\b/;
  const match = snippet.match(priceRegex);
  if (match) {
    const parsed = parseFloat(match[1].replace(/,/g, ""));
    if (!isNaN(parsed)) return Math.round(parsed);
  }
  return "";
}

function extractImageFromItem(item) {
  const pagemap = item.pagemap || {};
  if (pagemap.metatags && pagemap.metatags[0] && pagemap.metatags[0]["og:image"]) {
    return pagemap.metatags[0]["og:image"];
  }
  if (pagemap.cse_image && pagemap.cse_image[0] && pagemap.cse_image[0].src) {
    return pagemap.cse_image[0].src;
  }
  if (pagemap.metatags && pagemap.metatags[0] && pagemap.metatags[0]["twitter:image"]) {
    return pagemap.metatags[0]["twitter:image"];
  }
  return "";
}

function parseWikiExtract(extract) {
  const data = { dial: "", lug: "", movement: "", strap: "" };
  if (!extract) return data;
  
  const dialRegex = /\b(\d{2}(?:\.\d)?)\s*(?:mm|millimeter)/i;
  const dialMatch = extract.match(dialRegex);
  if (dialMatch) data.dial = `${dialMatch[1]}mm`;
  
  const lugRegex = /(?:lug-to-lug|lug width|distance between lugs|lugs)\s*(?:of\s*)?(\d{2}(?:\.\d)?)\s*(?:mm|millimeter)/i;
  const lugMatch = extract.match(lugRegex);
  if (lugMatch) data.lug = `${lugMatch[1]}mm`;
  
  if (/automatic|self-winding|co-axial/i.test(extract)) {
    data.movement = "Automatic";
  } else if (/quartz/i.test(extract)) {
    data.movement = "Quartz";
  } else if (/manual-wind|hand-wound|chronograph manual/i.test(extract)) {
    data.movement = "Manual Wind";
  }
  
  return data;
}

function displayAutocompleteResults(results) {
  if (results.length === 0) {
    DOM.autocompleteDropdown.innerHTML = `<div class="autocomplete-item"><div class="autocomplete-item-text"><span class="autocomplete-item-title">No matches found</span><span class="autocomplete-item-source">Manually enter your watch specs below</span></div></div>`;
    DOM.autocompleteDropdown.style.display = "block";
    return;
  }

  DOM.autocompleteDropdown.innerHTML = "";
  
  results.forEach(res => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    
    let imageHtml = "";
    if (res.data && res.data.image) {
      imageHtml = `<img src="${res.data.image}" class="autocomplete-item-img" alt="Watch icon" onerror="this.style.display='none'">`;
    } else {
      imageHtml = `<div class="autocomplete-item-img" style="display:flex;align-items:center;justify-content:center;background:var(--border-color)"><i data-lucide="search" style="width:16px;height:16px;color:var(--text-tertiary);"></i></div>`;
    }

    item.innerHTML = `
      ${imageHtml}
      <div class="autocomplete-item-text">
        <span class="autocomplete-item-title">${escapeHtml(res.title)}</span>
        <span class="autocomplete-item-source">${escapeHtml(res.subtitle)}</span>
      </div>
    `;
    
    item.addEventListener("click", () => selectAutocompleteItem(res));
    DOM.autocompleteDropdown.appendChild(item);
  });

  lucide.createIcons();
  DOM.autocompleteDropdown.style.display = "block";
}

async function selectAutocompleteItem(res) {
  DOM.autocompleteDropdown.style.display = "none";
  DOM.watchSearchInput.value = res.title;
  
  const w = res.data;
  DOM.watchBrand.value = w.brand || "";
  DOM.watchModel.value = w.model || "";
  DOM.watchRef.value = w.ref || "";
  DOM.watchPrice.value = w.price || "";
  DOM.watchDial.value = w.dial || "";
  DOM.watchLug.value = w.lug || "";
  DOM.watchMovement.value = w.movement || "";
  DOM.watchStrap.value = w.strap || "";
  DOM.watchImage.value = w.image || "";
  DOM.watchNotes.value = w.notes || "";
  
  updateImagePreview(w.image);
  showToast("Watch Auto-Filled", `Specs loaded for ${w.brand || res.title}.`, "success");
}

// 9. Watch Card Rendering Engine
function renderWatches() {
  const query = DOM.searchFilter.value.toLowerCase().trim();
  const sort = DOM.sortBy.value;
  
  // 1. Filter watches
  let filtered = STATE.watches.filter(w => {
    const brand = (w.brand || "").toLowerCase();
    const model = (w.model || "").toLowerCase();
    const ref = (w.ref || "").toLowerCase();
    const notes = (w.notes || "").toLowerCase();
    
    return brand.includes(query) || model.includes(query) || ref.includes(query) || notes.includes(query);
  });

  // 2. Sort watches
  filtered.sort((a, b) => {
    if (sort === "price-asc") {
      return parseFloat(a.price || 0) - parseFloat(b.price || 0);
    } else if (sort === "price-desc") {
      return parseFloat(b.price || 0) - parseFloat(a.price || 0);
    } else if (sort === "brand-asc") {
      return (a.brand || "").localeCompare(b.brand || "");
    } else if (sort === "date-added") {
      return (b.id || 0) - (a.id || 0); // numeric ID works as creation timestamp
    }
    return 0;
  });

  // 3. Clear container
  DOM.watchesContainer.innerHTML = "";
  
  if (filtered.length === 0) {
    DOM.emptyState.style.display = "flex";
    DOM.watchesContainer.style.display = "none";
    updateStatsBar();
    return;
  }
  
  DOM.emptyState.style.display = "none";
  DOM.watchesContainer.style.display = STATE.viewMode === "grid" ? "grid" : "block";

  // 4. Render cards
  filtered.forEach(watch => {
    const card = document.createElement("div");
    card.className = "watch-card";
    card.setAttribute("data-id", watch.id);
    
    // Clean default image or placeholder
    const imageSource = watch.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
    
    card.innerHTML = `
      <div class="card-img-wrapper">
        <span class="card-status-pill status-${watch.status || "wished"}">
          ${watch.status === "acquired" ? "Acquired" : "Wishlist"}
        </span>
        <img src="${imageSource}" alt="${watch.brand} ${watch.model}" loading="lazy">
      </div>
      
      <div class="card-content">
        <div class="card-header-info">
          <span class="card-brand">${escapeHtml(watch.brand)}</span>
          <h3 class="card-model">${escapeHtml(watch.model)}</h3>
          <span class="card-ref">${watch.ref ? "Ref. " + escapeHtml(watch.ref) : "&nbsp;"}</span>
        </div>
        
        <div class="card-specs-mini">
          <div class="spec-mini-item">
            <span class="spec-mini-label">Dial</span>
            <span class="spec-mini-val">${watch.dial ? escapeHtml(watch.dial) : "-"}</span>
          </div>
          <div class="spec-mini-item">
            <span class="spec-mini-label">Lug-to-Lug</span>
            <span class="spec-mini-val">${watch.lug ? escapeHtml(watch.lug) : "-"}</span>
          </div>
          <div class="spec-mini-item">
            <span class="spec-mini-label">Movement</span>
            <span class="spec-mini-val">${watch.movement ? escapeHtml(watch.movement) : "-"}</span>
          </div>
          <div class="spec-mini-item">
            <span class="spec-mini-label">Strap</span>
            <span class="spec-mini-val">${watch.strap ? escapeHtml(watch.strap) : "-"}</span>
          </div>
        </div>
        
        <div class="card-footer">
          <span class="card-price">$${formatCurrency(watch.price)}</span>
          <div class="card-actions">
            <button class="btn-icon btn-card-edit" title="Edit Specs" data-id="${watch.id}">
              <i data-lucide="edit-2" style="width:14px;height:14px;"></i>
            </button>
            <button class="btn-icon delete btn-card-delete" title="Remove" data-id="${watch.id}">
              <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Direct inspect binding on card background click, bypassing buttons
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".card-actions") && !e.target.closest("button")) {
        inspectWatch(watch.id);
      }
    });

    // Sub-buttons inside card
    card.querySelector(".btn-card-edit").addEventListener("click", (e) => {
      e.stopPropagation();
      openWatchModal(watch.id);
    });

    card.querySelector(".btn-card-delete").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteWatch(watch.id);
    });

    DOM.watchesContainer.appendChild(card);
  });

  // Init newly added Lucide icons
  lucide.createIcons();
  
  // Refresh header stats counters
  updateStatsBar();
}

function updateStatsBar() {
  // 1. Total Price
  const totalVal = STATE.watches.reduce((sum, w) => sum + parseFloat(w.price || 0), 0);
  DOM.statTotalValue.textContent = `$${formatCurrency(totalVal)}`;

  // 2. Count
  const wishCount = STATE.watches.filter(w => w.status === "wished").length;
  DOM.statCount.textContent = `${wishCount} Wishlisted`;

}

// 10. CRUD Operations
function openWatchModal(watchId = null) {
  DOM.watchForm.reset();
  DOM.watchId.value = "";
  DOM.watchSearchInput.value = "";
  DOM.autocompleteDropdown.style.display = "none";
  
  if (watchId) {
    // Edit Mode
    const watch = STATE.watches.find(w => w.id == watchId);
    if (!watch) {
      console.warn("openWatchModal: Watch not found with ID", watchId);
      return;
    }
    
    DOM.modalWatchTitle.textContent = "Edit Watch Specifications";
    DOM.watchId.value = watch.id;
    DOM.watchBrand.value = watch.brand || "";
    DOM.watchModel.value = watch.model || "";
    DOM.watchRef.value = watch.ref || "";
    DOM.watchPrice.value = watch.price || "";
    DOM.watchDial.value = watch.dial || "";
    DOM.watchLug.value = watch.lug || "";
    DOM.watchMovement.value = watch.movement || "";
    DOM.watchStrap.value = watch.strap || "";
    DOM.watchImage.value = watch.image || "";
    DOM.watchStatus.value = watch.status || "wished";
    DOM.watchNotes.value = watch.notes || "";
    
    updateImagePreview(watch.image);
  } else {
    // Create Mode
    DOM.modalWatchTitle.textContent = "Add Dream Watch";
    updateImagePreview("");
  }
  
  DOM.modalWatch.classList.add("active");
  DOM.watchSearchInput.focus();
}

function handleSaveWatch(e) {
  e.preventDefault();
  
  const idVal = DOM.watchId.value;
  const brand = DOM.watchBrand.value.trim();
  const model = DOM.watchModel.value.trim();
  const ref = DOM.watchRef.value.trim();
  const price = parseFloat(DOM.watchPrice.value) || 0;
  const dial = DOM.watchDial.value.trim();
  const lug = DOM.watchLug.value.trim();
  const movement = DOM.watchMovement.value.trim();
  const strap = DOM.watchStrap.value.trim();
  const image = DOM.watchImage.value.trim();
  const status = DOM.watchStatus.value;
  const notes = DOM.watchNotes.value.trim();

  if (!brand || !model) {
    showToast("Validation Error", "Brand and Model Name are required.", "error");
    return;
  }

  if (idVal) {
    // Update
    const idx = STATE.watches.findIndex(w => w.id === parseInt(idVal));
    if (idx !== -1) {
      STATE.watches[idx] = {
        ...STATE.watches[idx],
        brand, model, ref, price, dial, lug, movement, strap, image, status, notes
      };
      showToast("Watch Updated", `${brand} ${model} specifications saved.`, "success");
    }
  } else {
    // Create
    const newWatch = {
      id: Date.now(), // timestamp works as unique ID
      brand, model, ref, price, dial, lug, movement, strap, image, status, notes
    };
    STATE.watches.push(newWatch);
    showToast("Watch Added", `${brand} ${model} added to wishlist.`, "success");
  }
  
  saveLocalState(true);
  renderWatches();
  closeModal(DOM.modalWatch);
}

function deleteWatch(watchId) {
  const watch = STATE.watches.find(w => w.id == watchId);
  if (!watch) return;

  const confirmed = confirm(`Are you sure you want to remove the ${watch.brand} ${watch.model} from your list?`);
  if (!confirmed) return;

  STATE.watches = STATE.watches.filter(w => w.id != watchId);
  showToast("Watch Removed", "Item deleted from cache.", "info");
  
  saveLocalState(true);
  renderWatches();
  
  // If inspect modal was open for this watch, close it
  if (DOM.modalInspect.classList.contains("active")) {
    closeModal(DOM.modalInspect);
  }
}

function inspectWatch(watchId) {
  const watch = STATE.watches.find(w => w.id == watchId);
  if (!watch) {
    console.warn("inspectWatch: Watch not found with ID", watchId);
    return;
  }

  DOM.inspectBrand.textContent = watch.brand;
  DOM.inspectModel.textContent = watch.model;
  DOM.inspectRef.textContent = watch.ref ? `Ref. ${watch.ref}` : "No Reference Number";
  
  DOM.inspectImage.src = watch.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  DOM.inspectPrice.textContent = `$${formatCurrency(watch.price)}`;
  
  // Table specs
  DOM.inspectSpecBrand.textContent = watch.brand || "-";
  DOM.inspectSpecModel.textContent = watch.model || "-";
  DOM.inspectSpecRef.textContent = watch.ref || "-";
  DOM.inspectSpecDial.textContent = watch.dial || "-";
  DOM.inspectSpecLug.textContent = watch.lug || "-";
  DOM.inspectSpecMovement.textContent = watch.movement || "-";
  DOM.inspectSpecStrap.textContent = watch.strap || "-";
  DOM.inspectSpecStatus.textContent = watch.status === "acquired" ? "Acquired 🎉" : "Wishlist";

  DOM.inspectNotes.textContent = watch.notes || "No journal entries written for this dream watch yet. Click Edit to add notes, thoughts, and memories linked to this watch.";

  // Bind actions to buttons
  DOM.btnInspectEdit.onclick = () => {
    closeModal(DOM.modalInspect);
    openWatchModal(watch.id);
  };
  DOM.btnInspectDelete.onclick = () => {
    deleteWatch(watch.id);
  };

  DOM.modalInspect.classList.add("active");
}

function loadDemoCollection() {
  const confirmed = confirm("This will populate your watchlist with a collection of 9 iconic timepieces. Existing local data will be merged. Proceed?");
  if (!confirmed) return;

  STATE.watches = [...STATE.watches, ...JSON.parse(JSON.stringify(CURATED_CATALOG))];
  // Re-index dates to make them unique
  STATE.watches.forEach((w, index) => {
    if (!w.id) w.id = Date.now() + index;
  });

  saveLocalState(true);
  renderWatches();
  showToast("Demo Loaded", "Populated 9 iconic watches.", "success");
}

// 11. Modal Setup & Event Listeners
function setupEventListeners() {
  // Modal triggers
  DOM.btnAddWatch.onclick = () => openWatchModal();
  DOM.btnEmptyAdd.onclick = () => openWatchModal();
  DOM.btnLoadDemo.onclick = () => loadDemoCollection();
  DOM.btnSettings.onclick = openSettingsModal;
  DOM.btnThemeToggle.onclick = toggleTheme;
  DOM.btnSyncNow.onclick = () => syncWithGist();
  
  // Close Modals
  DOM.btnCancelWatch.onclick = () => closeModal(DOM.modalWatch);
  DOM.btnCloseWatchModal.onclick = () => closeModal(DOM.modalWatch);
  DOM.btnCloseSettingsModal.onclick = () => closeModal(DOM.modalSettings);
  DOM.btnCloseInspect.onclick = () => closeModal(DOM.modalInspect);
  
  // Backdrop click closes
  [DOM.modalWatch, DOM.modalSettings, DOM.modalInspect].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Watch Form save
  DOM.watchForm.onsubmit = handleSaveWatch;
  
  // Autocomplete Search keyups
  DOM.watchSearchInput.addEventListener("input", handleWatchSearchInput);
  DOM.watchSearchInput.addEventListener("focus", handleWatchSearchInput);
  
  // Auto update image preview when URL changes
  DOM.watchImage.addEventListener("input", (e) => {
    updateImagePreview(e.target.value.trim());
  });

  // Settings Modals Actions
  DOM.btnSaveSettings.onclick = handleSaveSettings;
  DOM.btnCreateGist.onclick = () => createNewPrivateGist(DOM.settingsPat.value.trim());
  DOM.btnDiagPull.onclick = forcePullFromCloud;
  DOM.btnDiagPush.onclick = forcePushToCloud;
  DOM.btnDiagMerge.onclick = mergeCloudAndLocal;
  DOM.btnToggleDebug.onclick = () => {
    const viewer = document.getElementById("debug-log-viewer");
    if (viewer) {
      const isHidden = viewer.style.display === "none";
      viewer.style.display = isHidden ? "block" : "none";
      DOM.btnToggleDebug.innerHTML = isHidden 
        ? `<i data-lucide="terminal"></i> Hide Debug Logs`
        : `<i data-lucide="terminal"></i> Show Debug Logs`;
      lucide.createIcons();
    }
  };
  DOM.btnExportJson.onclick = exportBackup;
  DOM.importJsonFile.onchange = importBackup;
  
  DOM.btnClearAll.onclick = () => {
    const confirmed = confirm("WARNING: This will permanently delete your local cache. If your Gist ID is set, you can pull it back, otherwise this is irreversible. Proceed?");
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      STATE.watches = [];
      STATE.lastUpdated = 0;
      renderWatches();
      showToast("Local Cache Cleared", "Wiped all cached watch data.", "info");
      closeModal(DOM.modalSettings);
    }
  };

  // Filtering / Sorting Inputs
  DOM.searchFilter.addEventListener("input", renderWatches);
  DOM.sortBy.onchange = renderWatches;
  
  DOM.viewGrid.onclick = () => {
    STATE.viewMode = "grid";
    DOM.watchesContainer.className = "watches-container grid-view";
    DOM.viewList.classList.remove("active");
    DOM.viewGrid.classList.add("active");
    saveLocalState();
    renderWatches();
  };
  
  DOM.viewList.onclick = () => {
    STATE.viewMode = "list";
    DOM.watchesContainer.className = "watches-container list-view";
    DOM.viewGrid.classList.remove("active");
    DOM.viewList.classList.add("active");
    saveLocalState();
    renderWatches();
  };
}

function openSettingsModal() {
  DOM.settingsPat.value = STATE.settings.githubPat || "";
  DOM.settingsGistId.value = STATE.settings.gistId || "";
  DOM.settingsAutoSync.checked = STATE.settings.autoSync;
  
  updateDiagnosticsUI();
  
  DOM.modalSettings.classList.add("active");
}

function handleSaveSettings() {
  const pat = DOM.settingsPat.value.trim();
  const gistId = DOM.settingsGistId.value.trim();
  const autoSync = DOM.settingsAutoSync.checked;
  
  STATE.settings = {
    githubPat: pat,
    gistId: gistId,
    autoSync: autoSync
  };
  saveLocalState();
  
  showToast("Settings Saved", "Preferences updated in local storage.", "success");
  closeModal(DOM.modalSettings);
  
  if (pat && gistId) {
    syncWithGist();
  } else {
    updateSyncUIStatus("offline");
  }
}

function closeModal(modalElement) {
  modalElement.classList.remove("active");
}

// 12. Helper Utilities
function updateImagePreview(url) {
  if (url) {
    DOM.imagePreview.src = url;
    DOM.imagePreview.style.display = "block";
    DOM.imagePreviewContainer.querySelector(".no-preview-placeholder").style.display = "none";
  } else {
    DOM.imagePreview.src = "";
    DOM.imagePreview.style.display = "none";
    DOM.imagePreviewContainer.querySelector(".no-preview-placeholder").style.display = "flex";
  }
}

function formatCurrency(num) {
  return parseFloat(num).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 13. File Backup Exports/Imports
function exportBackup() {
  const payload = {
    watches: STATE.watches,
    lastUpdated: STATE.lastUpdated,
    version: "1.0"
  };
  
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `grail_tracker_backup_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Backup Created", "Wishlist JSON downloaded.", "success");
}

function importBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (data.watches && Array.isArray(data.watches)) {
        STATE.watches = [...STATE.watches, ...data.watches];
        
        // De-duplicate items by ID
        const seen = new Set();
        STATE.watches = STATE.watches.filter(w => {
          if (!w.id) w.id = Date.now() + Math.random();
          const duplicate = seen.has(w.id);
          seen.add(w.id);
          return !duplicate;
        });

        STATE.lastUpdated = Date.now();
        saveLocalState();
        renderWatches();
        showToast("Backup Restored", `Successfully imported ${data.watches.length} watches.`, "success");
      } else {
        throw new Error("Missing watches array in backup file.");
      }
    } catch (err) {
      console.error(err);
      showToast("Import Failed", "Invalid JSON backup format.", "error");
    }
  };
  reader.readAsText(file);
  // Clear file input value to allow re-upload
  e.target.value = "";
}

// 14. Toast Notification UI Logic
function showToast(title, message, type = "info") {
  const id = "toast_" + Date.now() + Math.random().toString(36).substring(2, 7);
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.id = id;

  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  else if (type === "error") iconName = "alert-circle";
  else if (type === "loading") iconName = "loader";
  else if (type === "warning") iconName = "alert-triangle";

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <div class="toast-content">
      <span class="toast-title">${escapeHtml(title)}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    </div>
    ${type !== "loading" ? '<div class="toast-progress"></div>' : ""}
  `;

  DOM.toastContainer.appendChild(toast);
  lucide.createIcons();

  // Auto remove toast (except loading types which must be dismissed programmatically)
  if (type !== "loading") {
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  }

  return id;
}

function dismissToast(id) {
  const toast = document.getElementById(id);
  if (toast) {
    toast.classList.add("removing");
    toast.addEventListener("animationend", (e) => {
      if (e.animationName === "slide-out-toast") {
        toast.remove();
      }
    });
  }
}

// 15. Cloud Sync Diagnostics & Manual Controls Logic
async function updateDiagnosticsUI() {
  if (!DOM.diagLocalCount) return; // safety check
  
  // 1. Update Local Stats
  DOM.diagLocalCount.textContent = STATE.watches.length;
  DOM.diagLocalTime.textContent = STATE.lastUpdated ? new Date(STATE.lastUpdated).toLocaleString() : "Never updated";

  // Reset Cloud Stats
  DOM.diagCloudCount.textContent = "-";
  DOM.diagCloudTime.textContent = "Checking...";
  DOM.diagMsgBox.style.display = "none";
  DOM.diagMsgBox.className = "diag-msg-box";
  DOM.diagMsgBox.innerHTML = "";

  // Enable/Disable buttons based on settings
  const hasCredentials = !!(STATE.settings.githubPat && STATE.settings.gistId);
  DOM.btnDiagPull.disabled = !hasCredentials;
  DOM.btnDiagPush.disabled = !hasCredentials;
  DOM.btnDiagMerge.disabled = !hasCredentials;

  if (!hasCredentials) {
    DOM.diagCloudTime.textContent = "Not configured";
    DOM.diagMsgBox.innerHTML = "<strong>Sync not configured.</strong> Enter your GitHub PAT and Gist ID, click 'Save Settings' to enable cross-device syncing.";
    DOM.diagMsgBox.style.display = "block";
    return;
  }

  // 2. Fetch Gist Metadata asynchronously
  try {
    const response = await fetch(`https://api.github.com/gists/${STATE.settings.gistId}`, {
      method: "GET",
      headers: {
        "Authorization": `token ${STATE.settings.githubPat}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Gist not found. Check if Gist ID is correct.");
      } else if (response.status === 401) {
        throw new Error("Unauthorized PAT. Check if Personal Access Token is correct and has 'gists' scope.");
      } else {
        throw new Error(`GitHub API returned status ${response.status}`);
      }
    }

    const gistData = await response.json();
    const fileName = "grail_tracker_watches.json";

    if (gistData.files && gistData.files[fileName]) {
      const remoteData = JSON.parse(gistData.files[fileName].content);
      const remoteCount = remoteData.watches ? remoteData.watches.length : 0;
      const remoteTimestamp = remoteData.lastUpdated || 0;

      DOM.diagCloudCount.textContent = remoteCount;
      DOM.diagCloudTime.textContent = remoteTimestamp ? new Date(remoteTimestamp).toLocaleString() : "Never updated";

      // Compare local and remote to provide helpful suggestions
      const localTimestamp = STATE.lastUpdated || 0;
      
      // Give a tiny tolerance for timestamps (e.g. 1 second) to prevent float/rounding differences showing as mismatch
      const timeDiff = Math.abs(localTimestamp - remoteTimestamp);
      
      if (timeDiff > 1000) {
        if (remoteTimestamp > localTimestamp) {
          DOM.diagMsgBox.innerHTML = "<strong>Cloud database is newer.</strong> We recommend clicking <strong>Pull from Cloud</strong> to retrieve the latest version.";
          DOM.diagMsgBox.className = "diag-msg-box warning";
        } else {
          DOM.diagMsgBox.innerHTML = "<strong>Local database is newer.</strong> We recommend clicking <strong>Push to Cloud</strong> to save your current watches to the cloud.";
          DOM.diagMsgBox.className = "diag-msg-box warning";
        }
      } else {
        DOM.diagMsgBox.innerHTML = "<strong>Fully in sync.</strong> The local browser and GitHub Gist match perfectly.";
        DOM.diagMsgBox.className = "diag-msg-box success";
      }
      DOM.diagMsgBox.style.display = "block";
    } else {
      DOM.diagCloudCount.textContent = "0";
      DOM.diagCloudTime.textContent = "File not initialized";
      DOM.diagMsgBox.innerHTML = "<strong>Cloud database file not found in Gist.</strong> Click <strong>Push to Cloud</strong> to initialize it with your current local watches.";
      DOM.diagMsgBox.className = "diag-msg-box warning";
      DOM.diagMsgBox.style.display = "block";
    }
  } catch (error) {
    DOM.diagCloudTime.textContent = "Error";
    DOM.diagMsgBox.innerHTML = `<strong>Failed to check cloud state:</strong> ${escapeHtml(error.message)}`;
    DOM.diagMsgBox.className = "diag-msg-box error";
    DOM.diagMsgBox.style.display = "block";
  }
}

async function forcePullFromCloud() {
  const confirmed = confirm("Are you sure you want to overwrite your local wishlist with the data from the cloud? Any local changes not pushed will be permanently lost.");
  if (!confirmed) return;

  await syncWithGist(false, true);
  updateDiagnosticsUI();
}

async function forcePushToCloud() {
  const confirmed = confirm("Are you sure you want to overwrite the cloud database with your local wishlist? This will replace the Gist data on GitHub.");
  if (!confirmed) return;

  const { githubPat, gistId } = STATE.settings;
  if (!githubPat || !gistId) {
    showToast("Push Failed", "Credentials not configured.", "error");
    return;
  }

  const loaderToastId = showToast("Pushing Database", "Uploading local data to GitHub...", "loading");
  try {
    STATE.lastUpdated = Date.now();
    saveLocalState(false);

    await pushStateToGist(githubPat, gistId);
    dismissToast(loaderToastId);
    showToast("Push Successful", "Successfully pushed local updates to cloud.", "success");
    updateDiagnosticsUI();
    updateSyncUIStatus("online");
  } catch (error) {
    console.error("Force push failed:", error);
    dismissToast(loaderToastId);
    showToast("Push Failed", error.message || "Failed to push to Gist", "error");
  }
}

async function mergeCloudAndLocal() {
  const { githubPat, gistId } = STATE.settings;
  if (!githubPat || !gistId) {
    showToast("Merge Failed", "Credentials not configured.", "error");
    return;
  }

  const loaderToastId = showToast("Merging Databases", "Fetching and merging databases...", "loading");
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "GET",
      headers: {
        "Authorization": `token ${githubPat}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const gistData = await response.json();
    const fileName = "grail_tracker_watches.json";
    let remoteWatches = [];

    if (gistData.files && gistData.files[fileName]) {
      const remoteData = JSON.parse(gistData.files[fileName].content);
      remoteWatches = remoteData.watches || [];
    }

    const localWatches = STATE.watches || [];
    const mergedMap = new Map();

    const getWatchKey = (w) => {
      if (w.id) return String(w.id);
      return `${w.brand.toLowerCase()}_${w.model.toLowerCase()}_${(w.ref || "").toLowerCase()}`;
    };

    remoteWatches.forEach(w => {
      mergedMap.set(getWatchKey(w), w);
    });

    localWatches.forEach(w => {
      mergedMap.set(getWatchKey(w), w);
    });

    const mergedWatches = Array.from(mergedMap.values());

    STATE.watches = mergedWatches;
    STATE.lastUpdated = Date.now();
    
    const serialized = JSON.stringify({
      watches: STATE.watches,
      lastUpdated: STATE.lastUpdated,
      settings: STATE.settings,
      viewMode: STATE.viewMode
    });
    localStorage.setItem(STORAGE_KEY, serialized);

    await pushStateToGist(githubPat, gistId);
    
    dismissToast(loaderToastId);
    showToast("Merge Successful", `Merged databases. Total watches: ${mergedWatches.length}`, "success");
    renderWatches();
    updateDiagnosticsUI();
    updateSyncUIStatus("online");
  } catch (error) {
    console.error("Merge failed:", error);
    dismissToast(loaderToastId);
    showToast("Merge Failed", error.message || "Failed to merge databases", "error");
  }
}
