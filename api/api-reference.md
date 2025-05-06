# API Reference

Novix offers RESTful API endpoints for blockchain operations and AI-driven analysis. Below are key endpoints for Solana integration.

## Blockchain Endpoints

### GET /v1/blockchain/solana/trades
Retrieve recent trades from a Solana DEX.

- **Parameters**:
  - `dex` (string, required): DEX name (e.g., "Raydium").
  - `pair` (string, required): Trading pair (e.g., "SOL/USDC").
  - `limit` (integer, optional): Number of trades (default: 100).

- **Example Request**:
  ```bash
  curl -H "Authorization: Bearer your_api_key" \
       -G "https://api.novix.com/v1/blockchain/solana/trades" \
       -d "dex=Raydium" \
       -d "pair=SOL/USDC" \
       -d "limit=50"

Response:
```json
[
  {
    "timestamp": "2025-04-29T15:30:00Z",
    "price": 150.25,
    "amount": 10.5,
    "side": "buy"
  },
  // Additional trades...
]
```
### POST /v1/ai/blockchain/analyze
Analyze blockchain data using Novix’s AI.
Parameters:
data (object, required): Data to analyze (e.g., trade list).

model (string, required): AI model (e.g., "gpt-4").

prompt (string, required): Analysis task (e.g., "Predict price trends").

Example Request:
```bash

curl -X POST -H "Authorization: Bearer your_api_key" \
     -H "Content-Type: application/json" \
     -d '{
       "data": {"trades": [{"timestamp": "2025-04-29T15:30:00Z", "price": 150.25, "amount": 10.5, "side": "buy"}]},
       "model": "gpt-4",
       "prompt": "Predict price trends"
     }' \
     "https://api.novix.com/v1/ai/blockchain/analyze"
```
Response:
```json

{
  "status": "success",
  "analysis": "Price trend suggests an upward movement in the next hour."
}

For additional endpoints, see the Full API Reference (#full-api-reference).

```
