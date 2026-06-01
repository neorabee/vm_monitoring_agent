package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type LoadAvg struct {
	min1, min5, min15 float64
}
type MemStat struct {
	MemTotal, MemAvailable uint64
}

type CPUStat struct {
	User, Nice, System, Idle, Iowait, Irq, Softirq, Steal uint64
}

type Uptime struct {
	Days, Hours, Minutes, Seconds uint64
}

type DiskUsage struct {
	Total, Free, Used uint64
}

func readDiskUsage() (DiskUsage, error) {
	var stat syscall.Statfs_t
	err := syscall.Statfs("/", &stat)
	if err != nil {
		return DiskUsage{}, err
	}
	total := stat.Blocks * uint64(stat.Bsize)
	free := stat.Bavail * uint64(stat.Bsize)
	used := total - free
	return DiskUsage{
		Total: total,
		Free:  free,
		Used:  used,
	}, nil
}

func readLoadAvg() (LoadAvg, error) {
	data, err := os.ReadFile("/proc/loadavg")

	if err != nil {
		return LoadAvg{}, err
	}
	fields := strings.Fields(string(data))

	min1, err := strconv.ParseFloat(fields[0], 64)
	if err != nil {
		return LoadAvg{}, err
	}
	min5, err := strconv.ParseFloat(fields[1], 64)
	if err != nil {
		return LoadAvg{}, err
	}
	min15, err := strconv.ParseFloat(fields[2], 64)
	if err != nil {
		return LoadAvg{}, err
	}
	return LoadAvg{
		min1:  min1,
		min5:  min5,
		min15: min15,
	}, nil
}

func readUptime() (Uptime, error) {
	data, err := os.ReadFile("/proc/uptime")

	if err != nil {
		return Uptime{}, err
	}
	fields := strings.Fields(string(data))
	UptimeSeconds, err := strconv.ParseFloat(fields[0], 64)
	if err != nil {
		return Uptime{}, err
	}

	return Uptime{
		Days:    uint64(UptimeSeconds / 86400),
		Hours:   (uint64(UptimeSeconds) % 86400) / 3600,
		Minutes: (uint64(UptimeSeconds) % 3600) / 60,
		Seconds: uint64(UptimeSeconds) % 60,
	}, err
}

func readMemory() (MemStat, error) {
	data, err := os.ReadFile("/proc/meminfo")

	if err != nil {
		return MemStat{}, err
	}
	lines := strings.Split(string(data), "\n")
	var value uint64
	var value2 uint64

	for _, line := range lines {
		fields := strings.Fields(line)
		if strings.HasPrefix(line, "MemTotal") {
			value, err = strconv.ParseUint(fields[1], 10, 64)
			if err != nil {
				return MemStat{}, err
			}
		}
		if strings.HasPrefix(line, "MemAvailable") {
			value2, err = strconv.ParseUint(fields[1], 10, 64)
			if err != nil {
				return MemStat{}, err
			}

		}
	}
	return MemStat{
		MemTotal:     value,
		MemAvailable: value2,
	}, nil
}
func readCPUStat() (CPUStat, error) {
	data, err := os.ReadFile("/proc/stat")
	if err != nil {
		return CPUStat{}, err
	}

	lines := strings.Split(string(data), "\n")
	first := strings.Fields(lines[0])

	// first[0] is "cpu"
	if len(first) < 8 {
		return CPUStat{}, fmt.Errorf("unexpected /proc/stat format")
	}

	vals := make([]uint64, 0, 7)
	for i := 1; i <= 7; i++ {
		v, err := strconv.ParseUint(first[i], 10, 64)
		if err != nil {
			return CPUStat{}, err
		}
		vals = append(vals, v)
	}

	return CPUStat{
		User:    vals[0],
		Nice:    vals[1],
		System:  vals[2],
		Idle:    vals[3],
		Iowait:  vals[4],
		Irq:     vals[5],
		Softirq: vals[6],
	}, nil
}

func total(s CPUStat) uint64 {
	return s.User + s.Nice + s.System + s.Idle + s.Iowait + s.Irq + s.Softirq + s.Steal
}

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

func home(w http.ResponseWriter, r *http.Request) {

	fmt.Fprintf(w, "Hello from the monitoring agent")
}
func collectMetrics() (Metrics, error) {
	uptime, err := readUptime()
	if err != nil {
		return Metrics{}, err
	}
	memo, err := readMemory()
	if err != nil {
		return Metrics{}, err
	}
	totalGB := float64(memo.MemTotal) / 1024.00 / 1024.00
	AvailableGB := float64(memo.MemAvailable) / 1024.00 / 1024.00
	UsedGB := float64(memo.MemTotal-memo.MemAvailable) / 1024.00 / 1024.00
	MemUsage := 100.0 * float64(memo.MemTotal-memo.MemAvailable) / float64(memo.MemTotal)
	cpustat, err := readCPUStat()
	if err != nil {
		return Metrics{}, err
	}
	time.Sleep(1 * time.Second)
	b, err := readCPUStat()

	if err != nil {
		return Metrics{}, err
	}
	totalDelta := total(b) - total(cpustat)
	idleDelta := (b.Idle + b.Iowait) - (cpustat.Idle + cpustat.Iowait)
	usage := 0.0
	if totalDelta > 0 {
		usage = 100.0 * float64(totalDelta-idleDelta) / float64(totalDelta)
	}
	loadavg, err := readLoadAvg()
	if err != nil {
		return Metrics{}, err
	}
	diskusage, err := readDiskUsage()
	if err != nil {
		return Metrics{}, err
	}
	totalDiskGB := float64(diskusage.Total) / 1024 / 1024 / 1024
	UsedDiskGB := float64(diskusage.Used) / 1024 / 1024 / 1024
	FreeDiskGB := float64(diskusage.Free) / 1024 / 1024 / 1024
	metrics := Metrics{
		Uptime: fmt.Sprintf(
			"%dd %dh %dm %ds",
			uptime.Days,
			uptime.Hours,
			uptime.Minutes,
			uptime.Seconds,
		),

		CPUUsage: usage,

		RAMAvailable: AvailableGB,
		RAMTotal:     totalGB,
		RAMUsed:      UsedGB,
		RAMUsage:     MemUsage,

		LoadAvg1min:  loadavg.min1,
		LoadAvg5min:  loadavg.min5,
		LoadAvg15min: loadavg.min15,

		DiskAvailable: FreeDiskGB,
		DiskTotal:     totalDiskGB,
		DiskUsed:      UsedDiskGB,
	}
	return metrics, nil
}
func metricsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	metrics, err := collectMetrics()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}
func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/metrics", metricsHandler)

	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
