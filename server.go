package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"io/ioutil"
	"os"
)

type Request struct {
	Action string `json:"action"`
	Key    string `json:"key"`
	Value  string `json:"value"`
}

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func writeToFile(key, value string) error {
	fileName := key + ".txt"
	file, err := os.Create("db/" + fileName)
	if err != nil {
		return fmt.Errorf("ошибка при создании файла: %v", err)
	}
	defer file.Close()

	_, err = file.WriteString(value)
	if err != nil {
		return fmt.Errorf("ошибка при записи в файл: %v", err)
	}

	fmt.Printf("Значение успешно записано в файл %s\n", fileName)
	return nil
}

func readFromFile(key string) (string, error) {
	fileName := key + ".txt"
	content, err := ioutil.ReadFile("db/" + fileName)
	if err != nil {
		if os.IsNotExist(err) {
			return "", nil
		}
		return "", fmt.Errorf("ошибка при чтении файла: %v", err)
	}

	return string(content), nil
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	fmt.Println("Accepted connection from", conn.RemoteAddr())

	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		data := scanner.Bytes()

		var req Request
		if err := json.Unmarshal(data, &req); err != nil {
			sendErrorResponse(conn, "Invalid JSON format")
			continue
		}

		var resp Response

		switch req.Action {
		case "write":
			if err := writeToFile(req.Key, req.Value); err != nil {
				sendErrorResponse(conn, err.Error())
				continue
			}
			resp = Response{Status: "success", Message: "Key written successfully"}
		case "read":
			value, err := readFromFile(req.Key)
			if err != nil {
				sendErrorResponse(conn, err.Error())
				continue
			}
			resp = Response{Status: "success", Message: value}
		default:
			sendErrorResponse(conn, "Invalid action")
			continue
		}

		sendJSONResponse(conn, resp)
	}
}

func sendJSONResponse(conn net.Conn, resp Response) {
	respJSON, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error encoding JSON response:", err)
		return
	}

	conn.Write(append(respJSON, '\n'))
}

func sendErrorResponse(conn net.Conn, message string) {
	resp := Response{Status: "error", Message: message}
	sendJSONResponse(conn, resp)
}

func main() {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Error starting server:", err)
		return
	}
	defer listener.Close()

	fmt.Println("Server listening on :8080")

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}

		go handleConnection(conn)
	}
}
