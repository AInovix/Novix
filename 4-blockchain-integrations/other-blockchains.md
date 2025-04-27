---
icon: chart-candlestick
---

# Other Blockchains

Novix is designed to be extensible, allowing integration with other blockchains beyond Solana. Each blockchain has unique characteristics, and we encourage the community to contribute new integrations.

## General Guidelines for Integration

To integrate a new blockchain, follow these steps:

1. Identify the blockchain's SDK or API, such as web3.py for Ethereum or bscscan for Binance Smart Chain.
2. Install the necessary Python libraries and configure RPC endpoints.
3. Implement basic operations like checking balances and sending transactions.
4. Extend Novix's AI agents to interact with the blockchain, such as monitoring data or executing trades.

## Example: Ethereum Integration

Ethereum is known for its smart contract flexibility but has higher gas fees. To integrate, install web3.py:

```bash
pip install web3
```

Configure an RPC endpoint and manage wallet keys similarly to Solana. For details, refer to the [web3.py Documentation](https://web3py.readthedocs.io/en/stable/).

## Community Contributions

We welcome contributions for integrating other blockchains like Binance Smart Chain, Polygon, or Avalanche. Please see our Contribution Guide for how to get involved.

Blockchain Ecosystem
