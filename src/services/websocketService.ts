import { getToken } from '../utils/tokenStorage';
import {
  WebSocketMessage,
  CreateRoomMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  ToggleReadyMessage,
  KickPlayerMessage,
  StartGameMessage,
  SendMessage,
  SubmitAnswerMessage,
  PongMessage
} from '../types/types';

export type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketService {
  private reconnectTimeout: number | null = null;
  private messageHandler: MessageHandler | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  // Connection state
  public isConnected = false;
  public connectionError: string | null = null;
  public ws: WebSocket | null = null;

  // Send message to server
  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  // Set message handler
  setMessageHandler(handler: MessageHandler): void {
    this.messageHandler = handler;
  }

  // Connect to WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous connections
      if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
        console.log('WebSocket already connecting or connected');
        resolve();
        return;
      }

      const token = getToken();
      if (!token) {
        const error = 'No authentication token found';
        this.connectionError = error;
        reject(new Error(error));
        return;
      }

      try {
        const wsUrl = `ws://localhost:8080/ws?token=${token}`;
        console.log('Attempting to connect to WebSocket:', wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.connectionError = null;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('Received WebSocket message:', message);

            // Handle heartbeat
            if (message.type === 'PING') {
              this.sendPong(message.data.timestamp);
            }

            // Call message handler
            if (this.messageHandler) {
              this.messageHandler(message);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.ws = null;

          // Auto reconnect if not manually disconnected and not a normal closure
          if (event.code !== 1000 && event.code !== 1001 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connectionError = 'Failed to connect to server';
          reject(new Error('WebSocket connection failed'));
        };

      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.connectionError = 'Failed to create connection';
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  // Schedule reconnect
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, delay);
  }

  // Lobby Events
  createRoom(roomName: string): void {
    const message: CreateRoomMessage = {
      type: 'CREATE_ROOM',
      data: { room_name: roomName },
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }

  joinRoom(roomID: string): void {
    const message: JoinRoomMessage = {
      type: 'JOIN_ROOM',
      data: { room_id: roomID },
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }

  // Room Events
  leaveRoom(): void {
    const message: LeaveRoomMessage = {
      type: 'LEAVE_ROOM',
      data: {},
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }

  toggleReady(): void {
    const message: ToggleReadyMessage = {
      type: 'TOGGLE_READY',
      data: {},
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }

  kickPlayer(playerID: number): void {
    const message: KickPlayerMessage = {
      type: 'KICK_PLAYER',
      data: { playerID },
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }

  startGame(): void {
    const message: StartGameMessage = {
      type: 'START_GAME',
      data: {},
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }

  // Chat Events
  sendChatMessage(message: string): void {
    const chatMessage: SendMessage = {
      type: 'SEND_MESSAGE',
      data: { message },
      timestamp: new Date().toISOString()
    };
    this.send(chatMessage);
  }

  // Game Events
  submitAnswer(gameID: string, answer: string): void {
    const message: SubmitAnswerMessage = {
      type: 'SUBMIT_ANSWER',
      data: { gameID, answer },
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }


  private sendPong(timestamp: string): void {
    const message: PongMessage = {
      type: 'PONG',
      data: { timestamp },
      timestamp: new Date().toISOString()
    };
    this.send(message);
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
export default wsService;
