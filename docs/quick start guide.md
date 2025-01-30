# Novix - Quick Start Guide 🚀

![Novix Architecture](https://placehold.co/1200x400/0f172a/e2e8f0/png?text=Novix+AI+Automation+Platform&font=roboto)

## 📋 Prerequisites

### All Systems
- **Git** ([Download](https://git-scm.com/))  
- **Python 3.10+** ([Download](https://python.org))  
- **Docker** ([Desktop](https://docker.com/products/docker-desktop) for Win/Mac, [Engine](https://docs.docker.com/engine/install/) for Linux)  

### Linux Specific
- **Docker Compose** ([Install Guide](https://docs.docker.com/compose/install/))  
- **NVIDIA Container Toolkit** (Optional for GPU acceleration):  
  ```bash
  distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
    && curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add - \
    && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
  sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
  ```

## 🛠️ Installation

1. Clone Repository:
    ```bash
   git clone https://github.com/AInovix/Novix.git && cd Novix
    ```
2. Configure Environment:
   ```bash
   # Create virtual environment
   python3 -m venv .venv && source .venv/bin/activate  # Linux/Mac
   python -m venv .venv && .\.venv\Scripts\activate    # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   ```
3. Initialize Configuration:
   ```bash
   cp .env.example .env  # Update with your API keys
   ```
## 🚦 Launch Options
Basic Start
```bash
python start.py
```
With GPU Acceleration
```bash
python start.py --gpu-layers 24  # Adjust based on VRAM
```
Docker Deployment (Recommended)
```bash
docker-compose up --build -d
```
## 🔌 Key Interfaces

| Interface      | URL                          | Description                     |
|----------------|------------------------------|---------------------------------|
| **Management** | [http://localhost:8501]      | Agent/prompt configuration      |
| **Interactive** | [http://localhost:3437]      | Real-time AI interaction        |
| **API Docs**   | [http://localhost:7437]      | Swagger documentation           |

## ⚙️ Advanced Configuration

### Command-Line Flags

| Flag               | Description                              | Default     |
|--------------------|------------------------------------------|-------------|
| `--Novix-branch`   | Git branch (stable/dev)                  | `stable`    |
| `--theme-name`     | UI theme (default/christmas/halloween)   | `default`   |
| `--database-type`  | Database backend (sqlite/postgres)       | `sqlite`    |
| `--gpu-layers`     | GPU layers for local models              | `auto`      |

## ezLocalAI Integration

```bash
python start.py --with-ezlocalai \
  --default-model "QuantFactory/dolphin-2.9.2-qwen2-7b-GGUF" \
  --whisper-model large-v3
```
## 🔧 Troubleshooting
Common Issues
Docker Permissions (Linux)
```bash
sudo usermod -aG docker $USER && newgrp docker
```
Port Conflicts
```bash
# Find and kill process using port 8501
sudo lsof -i :8501 && kill -9 <PID>
```
Docker Logs
```bash
docker compose logs --tail=100 -f
```
## 🔒 Security Best Practices
API Key Management
Never commit .env to version control

Rotate keys using:

```bash
python start.py --Novix-api-key=<new_key>
```
Authentication
```bash
# Enable OAuth
python start.py \
  --auth-providers google,github \
  --client-id <your_id> \
  --client-secret <your_secret>
```
Network Security
```bash
# Restrict API access
python start.py --Novix-uri "http://127.0.0.1:7437"
```
## 📚 Resources
Full Documentation (Replace URL)

Community Forum

Issue Tracker

License
