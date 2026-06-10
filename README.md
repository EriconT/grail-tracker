# Grail Tracker 🧭⌚

A premium, glassmorphic single-page web application designed for watch enthusiasts to keep track of, admire, and daydream about their future acquisitions.

The application runs entirely in your web browser, caching your watches in local storage, and synchronizing them across devices (mobile, tablet, desktop) using a private **GitHub Gist**. 

## Features
- **Stunning UI/UX**: Clean glassmorphism cards, responsive layouts, watch gold accents, and fluid micro-animations.
- **Smart Autocomplete**: Search inputs query a local catalog of iconic watches or Wikipedia's database to automatically populate brand, model, size, movement, notes, and high-quality images.
- **Dynamic Stats Board**: Instant summary counters of your wishlist (Total value, total count, next highest-priority purchase target).
- **Auto Dark/Light Theme**: Adapts to your device system settings automatically, with manual overrides.
- **Data Portability**: Full JSON backup export and import.
- **Real-Time Synchronization**: Built-in sync notifications for cloud updates.

---

## 🚀 Free Hosting on GitHub Pages

You can host this app on GitHub for free in less than 2 minutes:

1. **Create a GitHub Repository**:
   - Go to your GitHub account and click **New Repository**.
   - Name it (e.g., `grail-tracker`). You can make it **Public** or **Private**.
   
2. **Upload the Code Files**:
   - Upload the three main files in this directory to your repository:
     - [index.html](file:///index.html)
     - [style.css](file:///style.css)
     - [app.js](file:///app.js)
   - Commit the changes to your `main` branch.

3. **Enable GitHub Pages**:
   - In your repository, go to **Settings** (tab at the top) -> **Pages** (in the sidebar).
   - Under **Build and deployment**:
     - **Source**: Select *Deploy from a branch*.
     - **Branch**: Select `main` and `/ (root)`.
     - Click **Save**.
   - Wait about 30 seconds. GitHub will display a message at the top of the Pages section: *"Your site is live at `https://<your-username>.github.io/grail-tracker/`"*.

---

## 🔄 How to Setup Cross-Device Syncing

To access your wishlist on your phone, tablet, and computer and keep them in sync, we use a private GitHub Gist as a secure cloud database. Follow these steps to configure it:

### Step 1: Create a Personal Access Token (PAT)
1. Go to your GitHub account and click on your profile picture in the top-right, then select **Settings**.
2. Scroll to the bottom of the left sidebar and click **Developer settings**.
3. Under **Personal Access Tokens**, click **Tokens (classic)**.
4. Click **Generate new token** -> **Generate new token (classic)**.
5. Give the token a name (e.g., `Grail Tracker Sync`).
6. Under scopes, select the checkbox next to **gist** (this is the only permission the token needs).
7. Scroll to the bottom and click **Generate token**.
8. **Copy the token** (e.g., `ghp_xxxxxxxxxxxx`). *Keep it safe, as GitHub won't show it to you again.*

### Step 2: Configure the App
1. Open your hosted Grail Tracker site.
2. Click the **Settings** gear icon in the top right.
3. Paste your generated token into the **GitHub Personal Access Token (PAT)** field.
4. Click **Create Private Gist for Me**. The app will automatically connect to GitHub, create a secure, hidden Gist, upload your current watch list, and generate a Gist ID for you.
5. Click **Save Settings**.
6. **You're done!** The status bar will turn green showing *"Cloud Sync Connected"*.

### Step 3: Connect Other Devices
To load your watches on a new device (like your phone):
1. Open the Grail Tracker link on your phone.
2. Go to **Settings**.
3. Paste the **same PAT** and **same Gist ID** that you generated.
4. Click **Save Settings** – your watch collection will instantly load! Any changes you make on one device will automatically sync to the other.

---

## 🔍 How to Setup Google Autocomplete Search (Optional)

By default, the app uses a rich, full-text **Wikipedia search** to fetch watch details and photos keylessly. If you want the search to query Google (pulling real web images and average retail prices), you can enable Google Custom Search in settings:

### Step 1: Get a Google Custom Search API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a free project (no billing is required for low-volume personal usage).
3. Search for and enable the **Custom Search API**.
4. Go to **APIs & Services** -> **Credentials**, click **Create Credentials**, and choose **API Key**. Copy your generated key.

### Step 2: Get a Search Engine ID (CX)
1. Go to the [Google Programmable Search Engine Console](https://programmable-searchjs.google.com/about/).
2. Click **Add** to create a new search engine.
3. Under *Sites to search*, select **Search the entire web**.
4. Give it a name (e.g. `Watch Search`) and click **Create**.
5. Go to your search engine settings, find the **Search Engine ID** (or CX ID), and copy it.

### Step 3: Paste Keys into settings
- Open the settings gear in your app, paste the API Key and CX ID into their respective fields, and click **Save Settings**. 
- Now, when you add a watch, typing in the search bar queries Google, fetching actual retail prices and live product image previews!

---

## Technical Details & Local Development
- Built with standard **HTML5**, **Vanilla CSS**, and **ES6 JavaScript**.
- Icons powered by **Lucide Icons**.
- Fonts loaded via **Google Fonts** (Inter and Outfit).
- Offline capabilities using standard browser `LocalStorage`.
- Wikipedia queries use official cross-origin resource sharing (`origin=*`) APIs.
- Google Search calls use the official `customsearch/v1` API directly from the client.

