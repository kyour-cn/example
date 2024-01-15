package ws

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Handle(w http.ResponseWriter, r *http.Request) {
	// 升级HTTP连接为WebSocket连接
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	// 处理WebSocket连接
	for {
		// 读取消息
		msgType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Received message:", string(p), msgType)

		ParseMsg(p, conn, msgType)

		// 发送消息
		//err = conn.WriteMessage(msgType, []byte("Hello, world!"))
		//if err != nil {
		//	log.Println(err)
		//	return
		//}
	}
}

type Message struct {
	// 指令
	Cmd string `json:"cmd"`
}

func ParseMsg(msgB []byte, conn *websocket.Conn, msgType int) {

	msg := Message{}
	_ = json.Unmarshal(msgB, &msg)

	switch msg.Cmd {
	case "ping":

		pongMsg := "{\"cmd\":\"pong\"}"
		_ = conn.WriteMessage(msgType, []byte(pongMsg))
	default:
		log.Println("Received unknown message: ", msg.Cmd)
	}
}
