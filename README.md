![Meridian](./src/assets/favicon.svg)

# Meridite
Just the server or matchmaker for the P2P file sharing app called Meridian.



## The Philosophy
It is only a matchmaker and gets discarded when the connection establishes between two peers




## Technical Stack
* **Frontend:** [SolidJS](https://www.solidjs.com/) (For reactive, blazingly fast UI updates) -> Meridian
* **Backend:** [Node.js](https://nodejs.org/) with [Socket.io](https://socket.io/) (Signaling & Room Management) 
* **Protocol:** [WebRTC](https://webrtc.org/) (DataChannel for P2P streaming)


## How it Works
- **The Handshake:** The Sender creates a room. The Client generates a unique 8-digit session code.
-   **The Discovery:** The Receiver enters the code. The Server introduces the two peers.
-  **The Tunnel:** Using WebRTC, the devices negotiate a direct path (STUN/ICE).
-  **The Transfer:** The file is sliced into chunks and sent directly across the "Meridian."


## Privacy & Security
Meridite is built on the principle of **Ephemeral Connectivity**. 
* No database.
* No tracking cookies.
* Room codes expire immediately after a successful connection or disconnection.
* But with great power comes great responsibilities, Meridite allow seamless integration and flawless speed between peers but it is unable to check the **file security which  compromises the speed**.

<br/>
<br/>
<br/>

> **Built by [CoderSilicon](https://github.com/CoderSilicon)** > *It is always better to differ from others.*
