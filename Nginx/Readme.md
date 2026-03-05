# 🟢 Nginx Load Balancing Setup

Simple guide to setup **load balancing** using Nginx for backend servers.

---

## � Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 📌 Overview

Load balancing helps distribute traffic across multiple backend servers to improve performance and reliability.

**Example Stack:**
- Node.js backend
- Nginx as reverse proxy + load balancer

---

## 🔧 Prerequisites

- Nginx installed on your system
- Node.js (for the example backend)
- Basic knowledge of terminal/command line
- WSL/Linux environment (for symbolic links)

---

## ⚙️ Setup Instructions

### Step 1 — Create Backend Project

Create your backend project (e.g., a Node.js application).

---

### Step 2 — Run App on Multiple Ports

Run multiple instances of your app on different ports to simulate multiple servers.

**Example (Node.js):**

```bash
$env:PORT=3001; node index.js
$env:PORT=3002; node index.js
$env:PORT=3003; node index.js
```

> 💡 Each port represents a different server instance.

---

### Step 3 — Navigate to Nginx Config Directory

```bash
cd /etc/nginx/sites-available
```

---

### Step 4 — Create Nginx Config File

Create a new configuration file:

```bash
sudo nano test
```

> ❗ **Note:** No file extension required.

---

### Step 5 — Add Load Balancer Configuration

Add the following configuration to your file:

```nginx
upstream backend {
    server 172.25.176.1:3001;
    server 172.25.176.1:3002;
    server 172.25.176.1:3003;
}

server {
    listen 8080;

    location / {
        proxy_pass http://backend;
    }
}
```

**Configuration Notes:**
- `3001`, `3002`, `3003` → Backend server ports
- `172.25.176.1` → Your host machine IP (use `hostname -I` or `ipconfig` to find yours)
- `8080` → Nginx listening port

---

### Step 6 — Include Sites-Enabled in nginx.conf

Open the main Nginx configuration file:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add this line in the `http` block (if not already present):

```nginx
include /etc/nginx/sites-enabled/*;
```

---

### Step 7 — Enable Configuration

Create a symbolic link to enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/test /etc/nginx/sites-enabled/
```

---

### Step 8 — Test Configuration

Check for syntax errors:

```bash
sudo nginx -t
```

You should see:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

### Step 9 — Restart Nginx

Apply the changes:

```bash
sudo systemctl restart nginx
```

---

## 🧪 Testing

### Step 10 — Access Your Application

Open your browser and navigate to:

```
http://localhost:8080
```

---

### Step 11 — Verify Load Balancing

Refresh the page multiple times. You should see requests being handled by different backend servers (check server logs or add unique identifiers in your response to track which server handles each request).

---

## 🛠️ Troubleshooting

### Common Issues

**1. Connection refused**
- Check if all backend servers are running
- Verify the IP address and ports in your Nginx config

**2. Nginx fails to start**
- Run `sudo nginx -t` to check for syntax errors
- Check logs: `sudo tail -f /var/log/nginx/error.log`

**3. Symbolic link not working**
- Ensure the path in sites-available and sites-enabled are correct
- Verify permissions: `ls -la /etc/nginx/sites-enabled/`

**4. Finding your host IP**
- **Linux/WSL:** `hostname -I` or `ip addr show`
- **Windows:** `ipconfig` (look for IPv4 Address)
- **WSL users:** Use the IP of your WSL instance, not Windows host

---

## 📚 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Nginx Load Balancing Guide](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)

---

## 📝 License

MIT License - Feel free to use and modify as needed.

---

**Happy Load Balancing! 🚀**