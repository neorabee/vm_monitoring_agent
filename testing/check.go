package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Metrics struct {
	Uptime        string  `json:"uptime"`
	CPUUsage      float64 `json:"cpu_usage"`
	RAMAvailable  float64 `json:"ram_available"`
	RAMTotal      float64 `json:"ram_total"`
	RAMUsed       float64 `json:"ram_used"`
	RAMUsage      float64 `json:"ram_usage"`
	LoadAvg1min   float64 `json:"loadavg_1min"`
	LoadAvg5min   float64 `json:"loadavg_5min"`
	LoadAvg15min  float64 `json:"loadavg_15min"`
	DiskAvailable float64 `json:"disk_available"`
	DiskTotal     float64 `json:"disk_total"`
	DiskUsed      float64 `json:"disk_used"`
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
	metrics := Metrics{
		Uptime:   "Total Uptime: %dd %dh %dm %ds\n",
		CPUUsage: 0.99,
		RAMUsage: 24.52,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}
func home(w http.ResponseWriter, r *http.Request) {

	fmt.Fprintf(w, "Hello from the monitoring agent")
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/metrics", metricsHandler)
	http.ListenAndServe(":8080", nil)

	fmt.Println("Listening on :8080")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
