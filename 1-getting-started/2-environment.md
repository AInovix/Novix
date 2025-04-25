---
icon: gear
---

# Environment Variables Configuration Guide

## 📌 Core Environment Variables

| Variable               | Purpose                                     | Options                        | Default                 |
| ---------------------- | ------------------------------------------- | ------------------------------ | ----------------------- |
| `Novix_API_KEY`        | Authentication key for API access           | Any string                     | Auto-generated          |
| `Novix_URI`            | Base URI for API services                   | Valid URL                      | `http://localhost:7437` |
| `Novix_BRANCH`         | Version channel                             | `stable`, `dev`                | `stable`                |
| `Novix_AUTO_UPDATE`    | Automatic platform updates                  | `true`, `false`                | `true`                  |
| `Novix_RLHF`           | Enable reinforcement learning from feedback | `true`, `false`                | `true`                  |
| `Novix_SHOW_SELECTION` | UI dropdown visibility                      | Comma-separated list           | `conversation,agent`    |
| `AUTH_PROVIDER`        | User authentication method                  | `none`, `magicalauth`, `oauth` | `none`                  |
| `INTERACTIVE_MODE`     | UI interaction mode                         | Experimental modes             | `chat`                  |
| `THEME_NAME`           | Visual theme                                | `default`, `christmas`, etc.   | `default`               |
| `DATABASE_TYPE`        | Data storage backend                        | `sqlite`, `postgres`           | `sqlite`                |
| `UVICORN_WORKERS`      | API request handlers                        | Integer (1-100)                | `10`                    |

## 🤖 ezLocalAI Integration Variables

| Variable         | Purpose                   | Default Value                              | Notes                                                           |
| ---------------- | ------------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `EZLOCALAI_URI`  | Local AI service endpoint | `http://localhost:8091`                    | Required for local model execution                              |
| `DEFAULT_MODEL`  | Primary language model    | `QuantFactory/dolphin-2.9.2-qwen2-7b-GGUF` | Requires 9GB VRAM (adjust `LLM_MAX_TOKENS` for lower resources) |
| `VISION_MODEL`   | Image processing model    | `deepseek-ai/deepseek-vl-1.3b-chat`        | +3GB VRAM overhead                                              |
| `LLM_MAX_TOKENS` | Context window size       | `32768`                                    | Reduce for CPU/low VRAM environments                            |
| `WHISPER_MODEL`  | Speech-to-text model      | `base.en`                                  | Optimized for English                                           |
| `GPU_LAYERS`     | GPU utilization level     | `-1` (auto)                                | Manual override for layer allocation                            |
| `CUDA_DRIVER`    | NVIDIA GPU requirements   | Auto-detected                              | Falls back to CPU if unavailable                                |

## ⚙️ Configuration Methods

### 1. Command Line (Temporary)

```bash
export Novix_API_KEY="your-api-key"
export Novix_URI="http://localhost:7437"
```

### 2. Persistent .env File

```bash
# .env
Novix_API_KEY=your-secret-key
Novix_BRANCH=dev
```

### 3. Docker Deployment

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    image: novix:latest
    environment:
      - Novix_API_KEY=${NOVIX_KEY}
      - DATABASE_TYPE=postgres
```

## 🔍 Complete Variable List

To view all available variables and current values:

```bash
python -c "from start import get_default_env_vars; print(get_default_env_vars())"
```

## 📚 Resources

[Official Documentation](https://github.com/AInovix/Novix)

Community Support Forum (Discord TBA)

[GitHub Issues](https://github.com/ainovix/novix/issues)

[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
