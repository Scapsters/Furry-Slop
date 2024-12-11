### This is the server and client for furryslop.com

## You can host your own furry slop!

#### Download Twitter Likes

1. Get https://www.wfdownloader.xyz/download 
2. Under Tasks, select Import Browser Cookies
3. Using some cookie editor (I used https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm?hl=en) get your `auth_token` by pressing "Save" and pasting it in WFDownloader
4. Edit your config with the following. All other can be left at default
   1. Media_Mode_Options: All
   2. Video_Thumbnail_Options: Exclude video thumbnails
   3. Naming_Scheme: Rename files via owner, date, tweet id
   4. Task_Size: Select Accordingly
5. Follow the other instructions in WFDownloader
6. Click buttons to make it start collecting links
7. After links are collected, you will have to click something else to download them


#### Run server

1. Clone this repo
2. run npm install in the root of the directory AND in /client
3. in the root of the directory, run npm start
4. in \client, run npm run serve