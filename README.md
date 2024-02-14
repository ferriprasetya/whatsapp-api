# Whatsapp API

WhatsApp Chatbot with Node.js and Whatsapp.js

[REFERENCE](https://apriliantocecep.medium.com/tutorial-membuat-whatsapp-api-dengan-nodejs-tanpa-scraping-6faacd26f3b0)


## Installation
Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:8000`:

Or you can edit this line of code to change port

```js
// initial instance
const PORT = process.env.PORT || 8000;
```
## How it works?

1. After installation, run the app with

```bash
# npm
npm run start

# pnpm
pnpm run start

# yarn
yarn start
```

2. Wait until QR code shown at `http://localhost:8000` and scan with your phone to login whatsapp
3. To send message, use this `CURL`. Modify `phone` for target phone number and `message` for message you want to send


```bash
curl --location 'http://localhost:8000/send' \
--header 'Content-Type: application/json' \
--data-raw '{
    "phone": "628888888888@c.us",
    "message": "Test Send Message"
}'
```
