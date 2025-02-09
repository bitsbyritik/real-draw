import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { TokenPayload } from "@repo/backend-common/interface";
import { getName } from "./utils/getName";
import { storeMessage } from "./utils/storeMessage";

const wss = new WebSocketServer({ port: 8080 });

const rooms: Record<number, Map<WebSocket, string>> = {};

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (decoded && decoded.id) {
      return decoded.id;
    }

    return null;
  } catch (e) {
    return null;
  }
}

wss.on("connection", async(ws, request) => {
  const url = request.url;

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  let roomId: number;
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  const name = await getName(userId);
  console.log({name, userId});

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === "join_room") {
      roomId = parsedData.roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = new Map();
      }
      rooms[roomId]?.set(ws, userId);

      rooms[roomId]?.forEach((id, client) => {
        if(client.readyState === ws.OPEN){
          client.send(
            JSON.stringify({
              type: "notification",
              roomSize: rooms[roomId]?.size
            })
          )
        } 
      })
    }

    else if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      // use queue -> better approach
      storeMessage({roomId, message, userId});

      if(roomId && rooms[roomId]){
        wss.clients.forEach((client) => {
          if(client !== ws && client.readyState === ws.OPEN){
            client.send(
              JSON.stringify({
              type: "message",
              text: message,
              sender: name,
            }));
          }
        })        
      }


      // users.forEach((user) => {
      //   if (user.rooms.includes(roomId)) {
      //     user.ws.send(
      //       JSON.stringify({
      //         type: "chat",
      //         message: message,
      //         roomId,
      //       }),
      //     );
      //   }
      // });
      else if (parsedData.type === "leave_room") {
        rooms[roomId]?.delete(ws);

        rooms[roomId]?.forEach((id, client) => {
          if (client.readyState === ws.OPEN)
            client.send(
              JSON.stringify({
                type: "notification",
                size: rooms[roomId]?.size,
              }),
            );
        });
      }
    }
  });
});
