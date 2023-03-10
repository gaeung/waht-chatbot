# WAHT Discord Chatbot
The WAHT Discord Chatbot is a project that was developed through an internship at METABON. <br>[Metabon](https://waht.app/) ([VANILLA VOID](https://vanillavoid.com/)) 인턴십을 통해 진행된 프로젝트입니다. 


## About
This is a WAHT Discord chatbot project developed by Metabon. The chatbot is designed to allow users to check and RSVP for events using Discord, even if they do not use the waht.app application.
This is built using Node.js, Express.js, Discord.js, etc. To use this Chatbot, both the [API module](https://github.com/vinoverse/waht-chatbot-api-v2) and the [Chatbot module](https://github.com/vinoverse/waht-chatbot-v2) are required.

The chatbot provides the following key features(slash commands):

- `/waht check`: Checks if the user has used this Discord chatbot before, and if not, retrieves the user's NFT record using a QR code.
- `/waht refresh`: If there has been any change in the user's NFT record, this command can be used to update the user's NFT record.
- `/waht events`: Based on the user's NFT, this command shows a list of events that the user can attend. Users can also check the detailed information of each event.
- `/waht rsvp`: Users can RSVP for events, and a QR code is generated accordingly. Users can also cancel their event reservations.

## Getting Started
These are the instructions for setting up the chatbot project locally. To run the chatbot on your local machine, follow these simple steps:

### Prerequisites
1. To create a bot, go to [Discord Developer Portal](https://discord.com/developers/applications) and click on [New Application] on the top right corner. <img width="1426" alt="스크린샷 2023-03-02 오후 12 16 33" src="https://user-images.githubusercontent.com/112741645/222322013-fc5849e5-20a3-4015-b492-a444ea19fc21.png">
2. Enter the name for the application you want to create and click on [Create].
3. After the application is created, click on 'Bot' on the left-hand side menu, and then click on [Add Bot]. <img width="1422" alt="스크린샷 2023-03-02 오후 12 18 09" src="https://user-images.githubusercontent.com/112741645/222322381-33726162-a572-43f9-9ed9-7d3161ca53fd.png">
4. Click on [Yes, do it!] to confirm adding the bot.
5. Make sure to enable all three options (PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGE CONTENT INTENT) in the Privileged Gateway Intents section.<img width="1426" alt="스크린샷 2023-03-03 오후 12 56 32" src="https://user-images.githubusercontent.com/112741645/222627741-909d6f36-df85-4a9f-920e-186fcd9181d1.png">
6. Copy and save the token of the created bot. This token will be managed in the environment variables of the code later on. <img width="1419" alt="스크린샷 2023-03-02 오후 12 21 15" src="https://user-images.githubusercontent.com/112741645/222323088-e2b560d7-a2d4-4c6a-a6b3-13fd8cf14ca5.png">
7. Click on OAuth2 on the left-hand side menu, and then copy and save the Client ID. This ID will also be managed in the environment variables of the code later on.<img width="1416" alt="스크린샷 2023-03-02 오후 12 29 02" src="https://user-images.githubusercontent.com/112741645/222323996-bfc93728-4d46-4de7-a45d-0d8dbbd2e479.png">

### Connecting the Chatbot to a Discord Server
1. On the left-hand menu, go to OAuth2 > General and set it up as follows: <img width="1412" alt="스크린샷 2023-03-02 오후 12 39 36" src="https://user-images.githubusercontent.com/112741645/222325214-dea95dcd-51cb-4cca-a873-e278f5b467b4.png">
2. On OAuth2 > URL Generator, set it up as follows: <img width="1421" alt="스크린샷 2023-03-02 오후 12 35 49" src="https://user-images.githubusercontent.com/112741645/222324826-3a03b637-f5ca-4939-ab95-f78f3791e030.png">
3. Copy the generated URL at the bottom, and paste it into your browser. This will open an authorization window to connect the chatbot to a server. 
4. After permission is granted you can see that the bot account is listed as offline in the user list within your Discord application.

### Configuration
#### API module
1. Create a .env file in the root directory of the project.
2. Copy the following variables to the .env file and replace the placeholder values with your own:
```
TYPEORM_TYPE=YOUR_DATABASE_CONNECTION
TYPEORM_HOST=YOUR_HOST_NUMBER
TYPEORM_USERNAME=YOUR_USERNAME
TYPEORM_PASSWORD=YOUR_PASSWORD
TYPEORM_DATABASE=YOUR_DB
TYPEORM_TIMEZONE=TIMEZONE
TYPEORM_DATESTRINGS=TRUE
TYPEORM_LOGGING=LOGGING

PORT=YOUR_PORT_NUMBER

ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
```
3. Save the .env file.

#### Chatbot module
1. Create a .env file in the root directory of the project.
2. Copy the following variables to the .env file and replace the placeholder values with your own:
```
CLIENT_ID=YOUR_DISCORD_CLIENT_ID
TOKEN=YOUR_DISCORD_TOKEN
ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
SERVER_URL=YOUR_SERVER_URL
WAHT_IMAGE=IMAGE_URL
```
3. Save the .env file.

**Note: Make sure to keep the .env file private and not share it with anyone, as it contains sensitive information.**


### Installation Guide
**Node.js 16.9.0 or latest version is required.**
Use the package manager npm to install.
```
npm install
```

### Usage Guide
1. Before starting the chatbot, register slash commands in discord channel by running `node deploy-commands.js`. (This process only needs 1 time.) (If you want to erase all the registered commands, run `node delete-all-commands.js`)
3. Start both the chatbot and API by running `npm start`.
4. Once both are running, check that the chatbot is online in your Discord server.
5. Type a slash command in the chat, such as `/ping`, to activate the bot and trigger the command.
6. The following slash commands can be used in this chatbot:
<img width="209" alt="image" src="https://user-images.githubusercontent.com/78012131/222347718-95582c28-e4c2-47cc-8117-87bdf550f009.png">

