<h1 align="center">📑 Goodmarks</h1>
<p align="center">✨ A self-hostable, semantically searchable bookmarks extension for Chrome and Firefox using Vector Databases ✨</p>

<p align="center">
    <img src="https://github.com/shaun-mathew/Goodmarks/assets/16690478/6e5c6226-c3f3-4d2f-9bd0-3e7f62601db0" width="400">
    <img src="https://github.com/shaun-mathew/Goodmarks/assets/16690478/bc8be8d7-72a6-4d66-94e7-d6424053d032" width="400">
    <img src="https://github.com/shaun-mathew/Goodmarks/assets/16690478/66db2871-9c1e-454c-b818-748bc1c21735" width="400">

## ✨ Features
- Fire and forget bookmarks. Simply save them by clicking on the extension.
- Automatic title and description extraction.
- Tag bookmarks into categories you choose.
- Goodmarks indexes the content of website you are saving.
- Search for bookmarks based on content using natural language.
- Filter your searches by domain, tags and dates.
- Multiple accounts with user management.

## ⚙️ Installation
### Client Installation
1. Clone the repository
   ```sh
   git clone https://github.com/shaun-mathew/Goodmarks.git
   cd goodmarks-client
   npm install
   npm run build
   ```
2. Load the unpacked extension into your browser (Note: Developer mode must be enabled). Select the goodmarks-client/dist folder.
   `Menu -> Extensions -> Load unpacked`
   
### Server Installation

```sh
git clone https://github.com/shaun-mathew/Goodmarks.git
cd goodmarks-server
docker compose up -d
npm install
npm run start
```

## 📄 TODO
- [ ] Create a singular docker image for easier installation
- [ ] Precompile extension for easy client-side installation
- [ ] Add boolean search capabilities
- [ ] Add hybrid text search
- [ ] Add dark mode
