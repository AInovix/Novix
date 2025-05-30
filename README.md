---
icon: galaxy
---

# Novix: Next-Gen AI Automation Platform

[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge)](https://python.org)[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)](https://docker.com)[![X](https://img.shields.io/badge/X-000000?style=for-the-badge\&logo=x\&logoColor=white)](https://x.com/ainovix)

[![Novix-banner.png](https://i.postimg.cc/hG8kKqpX/Novix-banner.png)](https://postimg.cc/SXsTGH04)

***

## 🚀 Introducing Novix

**Novix** revolutionizes AI task management and decision-making by unifying diverse AI providers into a single, adaptive platform. Designed for developers and enterprises, it combines:

* **Adaptive Memory**: Context-aware workflows with long/short-term memory optimization
* **Multi-Provider Integration**: OpenAI, DeepSeek, Hugging Face, Google Gemini, and more
* **Smart Interaction Tools**: Task automation, conversational continuity, and real-time execution

🔮 **Vision**: Pave the way toward AGI with dynamic systems that learn, adapt, and evolve alongside users.

***

## ✨ Key Features

| **Category**          | **Capabilities**                                                              |
| --------------------- | ----------------------------------------------------------------------------- |
| **Core Intelligence** | Smart Instruct, Chain Management, Context/Token Optimization                  |
| **Interaction**       | Smart Chat (web-aware), Voice I/O (ElevenLabs, Hugging Face), Custom Prompts  |
| **Execution**         | AI-Driven Task Agents, Web Browsing, Command Execution, RESTful API (FastAPI) |
| **Infrastructure**    | Docker Deployment, Multi-OS Support, Extensible Plugin System                 |
| **Ecosystem**         | GitHub/Twitter/DALL-E Integrations, Code Evaluation, OAuth Authentication     |

***

## 🛠️ Installation

### Prerequisites

* **OS**: Windows/macOS/Linux
* **Python 3.10+**
* **Docker** (recommended)
* **Git**

### Quick Start

```bash
# Clone repository
git clone https://github.com/AInovix/novix.git && cd novix

# Set up environment (Linux/Mac)
python3 -m venv .venv && source .venv/bin/activate

# Windows
python -m venv .venv && .\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (edit .env)
cp .env.example .env  # Add your API keys (including DeepSeek)

# Launch with Docker (recommended)
docker-compose up --build

# Or run natively
python start.py
```

## Access Interfaces

* 🔗 \[Web UI] (TBA)
* 📊 [Management Dashboard](project-dashboard.md)
* 📚 [API Docs](https://github.com/AInovix/Novix)

## 🔒 Security

| Feature            | Implementation                                           |
| ------------------ | -------------------------------------------------------- |
| API Key Management | Env-based storage with encryption                        |
| Authentication     | OAuth (Google/GitHub/Microsoft)                          |
| Data Protection    | End-to-end encryption for I/O, minimal sensitive storage |

## 🌐 Architecture

```mermaid
graph TD
    A[User Interface] --> B[Smart Instruct Engine]
    B --> C{AI Providers}
    C --> D[OpenAI]
    C --> E[Hugging Face]
    C --> F[Google Gemini]
    C --> G[DeepSeek]
    C --> L[Anthropic Claude]
    C --> M[xAI Grok]
    B --> H[Plugin System]
    H --> I[Web Browsing]
    H --> J[Voice I/O]
    H --> K[Service Integrations]

    %% Styling for better visuals
    classDef aiProviders fill:#E6E6FA,stroke:#000,stroke-width:2px;
    class D,E,F,G,L,M aiProviders;
    classDef pluginSystem fill:#CCE5FF,stroke:#000,stroke-width:2px;
    class H,I,J,K pluginSystem;
    class A,B aiProviders;


```

## 🤝 Contribute

We welcome contributors! Follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open a Pull Request

**Community Guidelines:**

* Report bugs via GitHub Issues
* Join our Discord Server
* Review CONTRIBUTING.md for coding standards
* Special focus welcome on DeepSeek integration improvements!

## 📜 License

MIT License - See LICENSE for details.

Novix is not affiliated with any third-party AI providers.
