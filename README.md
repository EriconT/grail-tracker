# Grail Tracker 🧭⌚

A premium, glassmorphic single-page web application designed for watch enthusiasts to keep track of, admire, and daydream about their future acquisitions.

The application runs entirely in your web browser, caching your watches in local storage, and synchronizing them across devices (mobile, tablet, desktop) using a private **GitHub Gist**.

---

## 🌟 Key Features

- **Read-Only Exhibition Gallery & Owner Admin Modes**:
  - **Exhibition Gallery Mode**: A pristine, read-only mode for visitors and friends to explore and admire your collection without risk of editing or deleting entries.
  - **Owner Admin Mode**: Enter your private GitHub Gist credentials in Settings to unlock full management controls (adding, editing, reordering, and deleting watches).
- **Refined Luxury Layout & Responsive Header**:
  - **Desktop Alignment**: Header action controls (Exhibition/Owner toggle pill, Add Watch button, Settings) are neatly aligned to the right underneath the summary stats pills (Total Value, Wishlist, Cloud Sync). Title and logo align seamlessly with the top pill row.
  - **Mobile Layout**: Optimized 2-row layout featuring a smooth, touch-friendly horizontal pill track for summary stats, guaranteeing all text and values stay perfectly contained without squishing or wrapping.
- **Smart Autocomplete & Wikipedia Integration**: Search inputs query iconic watch catalogs or Wikipedia's API to automatically populate brand, model, case size, movement, notes, and high-quality images.
- **Dynamic Stats Board**: Live summary indicators tracking Total Wishlist Estimated Value, Watch Count, and Cloud Sync status.
- **Real-Time Cloud Synchronization**: Cross-device sync powered by a private GitHub Gist with instant status notifications and manual refresh capability.
- **Data Portability & Porting**: Complete JSON backup export and import to preserve your data offline.

---

## 🚀 Free Hosting on GitHub Pages

You can host this app on GitHub for free in less than 2 minutes:

1. **Create a GitHub Repository**:
   - Go to your GitHub account and click **New Repository**.
   - Name it (e.g., `grail-tracker`). You can make it **Public** or **Private**.
   
2. **Upload the Code Files**:
   - Upload the project files to your repository:
     - `index.html`
     - `style.css`
     - `app.js`
     - `favicon.png`
     - `README.md`
   - Commit the changes to your `main` branch.

3. **Enable GitHub Pages**:
   - In your repository, go to **Settings** (tab at the top) -> **Pages** (in the sidebar).
   - Under **Build and deployment**:
     - **Source**: Select *Deploy from a branch*.
     - **Branch**: Select `main` and `/ (root)`.
     - Click **Save**.
   - Wait about 30 seconds. GitHub will display a message at the top of the Pages section: *"Your site is live at `https://<your-username>.github.io/grail-tracker/`"*.

---

## 🔄 How to Setup Cross-Device Syncing & Owner Mode

To sync your wishlist across your phone, tablet, and computer (and unlock Owner Admin Mode), use a private GitHub Gist as a secure cloud database:

### Step 1: Create a Personal Access Token (PAT)
1. Go to your GitHub account and click on your profile picture in the top-right, then select **Settings**.
2. Scroll to the bottom of the left sidebar and click **Developer settings**.
3. Under **Personal Access Tokens**, click **Tokens (classic)**.
4. Click **Generate new token** -> **Generate new token (classic)**.
5. Give the token a name (e.g., `Grail Tracker Sync`).
6. Under scopes, select the checkbox next to **gist** (this is the only permission the token needs).
7. Scroll to the bottom and click **Generate token**.
8. **Copy the token** (e.g., `ghp_xxxxxxxxxxxx`). *Keep it safe, as GitHub won't show it to you again.*

### Step 2: Configure Owner Admin Mode
1. Open your Grail Tracker site.
2. Click the **Settings** gear icon in the top right.
3. Paste your generated token into the **GitHub Personal Access Token (PAT)** field.
4. Click **Create Private Gist for Me**. The app will automatically connect to GitHub, create a secure Gist, upload your watch list, and generate a Gist ID.
5. Click **Save Settings**.
6. **You're done!** The mode pill in the header will switch to **Owner Admin Mode** with full editing rights, and the status bar will show *"Cloud Sync Connected"*.

### Step 3: Connect Other Devices / Share Read-Only Gallery
- **To manage on another device**: Paste the **same PAT** and **same Gist ID** in Settings to unlock Owner Admin Mode and sync live.
- **To share as Exhibition Gallery**: Share your live app URL without providing credentials. Visitors will experience a sleek, read-only exhibition view.

---

## 🛠️ Technical Details & Stack
- Built with standard **HTML5**, **Vanilla CSS**, and **ES6 JavaScript**.
- Icons powered by **Lucide Icons**.
- Typography featuring **Bodoni Moda**, **Cinzel**, and **Inter** loaded via **Google Fonts**.
- Offline capabilities using browser `LocalStorage`.
- Cross-origin Wikipedia requests via `origin=*` search APIs.
