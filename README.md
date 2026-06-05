```markdown
# VM Monitoring Agent

A full-stack Linux monitoring dashboard built with Go and Next.js that visualizes real-time system metrics collected directly from the Linux kernel.
```

# What it does

This is a Go-based System Monitoring Web Application.

It reads a virtual machine's vital `/proc` data directly from the Linux kernel and sends it as a set of metrics to a frontend dashboard for real-time monitoring.

Currently, it monitors:

* CPU usage
* Memory usage and availability
* Disk usage
* Load averages (1, 5, and 15 minutes)
* Network throughput
* System uptime
* Running processes sorted by memory consumption

---

# Architecture

```text
Linux VM
    │
    ▼
Go Monitoring Agent
    │
    ▼
HTTP API (/metrics)
    │
    ▼
Next.js Frontend
    │
    ▼
Browser Dashboard
```

The backend periodically reads system information from Linux virtual files such as:

```text
/proc/stat
/proc/meminfo
/proc/loadavg
/proc/uptime
/proc/net/dev
/proc/[pid]
```

and exposes the data through a JSON API consumed by the frontend.

---

# Screenshots

<img width="2129" height="1212" alt="Screenshot 2026-06-03 085104" src="https://github.com/user-attachments/assets/e69824de-22b6-4cef-90ca-b9837bd876bd" />

<img width="2089" height="1044" alt="Screenshot 2026-06-03 085113" src="https://github.com/user-attachments/assets/094b937e-f50e-4914-b189-a61b24e12c35" />

---

# How to Run

### Prerequisites

* Go 1.24+
* Node.js 20+
* Linux VM (or Linux host)

### Clone the repository

```bash
git clone https://github.com/neorabee/vm_monitoring_agent.git
cd vm_monitoring_agent
```

### Start the Go monitoring agent

```bash
go run .
```

The API will be available at:

```text
http://localhost:3000/metrics
```

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at:

```text
http://localhost:3000
```

---

# Tech Stack

### Backend

* Go
* net/http
* encoding/json
* Linux `/proc` filesystem

### Frontend

* Next.js
* React
* Chart.js
* CSS

### Infrastructure

* Ubuntu/Xubuntu Virtual Machine
* SSH
* Git & GitHub

---

# Key Concepts Learned

* Linux process and system monitoring
* Reading kernel metrics through `/proc`
* HTTP API development in Go
* JSON serialization
* Frontend-backend communication
* React state management
* Real-time dashboard updates
* Virtual machine networking and SSH

---

# Future Improvements

* Historical metric storage
* Per-core CPU monitoring
* Process CPU usage tracking
* Alerting system
* Multiple-agent support
* Authentication
* WebSocket-based real-time updates
* Docker deployment
