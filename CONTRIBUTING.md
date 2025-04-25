---
icon: star
---

# Contribution Guide&#x20;

We welcome contributions from developers of all skill levels! Whether you're fixing bugs, adding features, or improving documentation, your help makes this project better for everyone.

## Table of Contents

* [Ways to Contribute](CONTRIBUTING.md#ways-to-contribute)
* [Getting Started](CONTRIBUTING.md#getting-started)
* [Contribution Workflow](CONTRIBUTING.md#contribution-workflow)
* [Code Style & Quality](CONTRIBUTING.md#code-style--quality)
* [Testing Guidelines](CONTRIBUTING.md#testing-guidelines)
* [Documentation](CONTRIBUTING.md#documentation)
* [Community Guidelines](CONTRIBUTING.md#community-guidelines)
* [Recognition](CONTRIBUTING.md#recognition)

## Ways to Contribute 🛠️

* 🐛 Report and fix bugs
* 💡 Suggest new features
* 📚 Improve documentation
* 🧪 Add test cases
* 🎨 Enhance UI/UX
* 🔧 Optimize performance
* 🌐 Translate documentation

## Getting Started 🚀

### Prerequisites

* Python 3.10+
* Git
* Poetry (for dependency management)

### Setup Guide

1. **Fork** the repository
2.  Clone your fork:

    ```bash
    git clone https://github.com/AInovix/novix.git
    cd novix
    ```
3. Install dependencies:

```bash
poetry install
```

4. Configure environment:

```bash
cp .env.example .env
# Update with your DeepSeek API credentials
```

**DeepSeek Integration**

1. **Obtain API key from DeepSeek Console**
2. **Configure in .env:**

```env
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_MODEL=deepseek-coder-32k
```

## Contribution Workflow 🔄

1. **Create a Branch**\
   Use conventional branch naming:

```bash
git checkout -b feat/add-new-llm-support
git checkout -b fix/issue-123
```

2. **Make Changes**\
   Keep changes focused and atomic

Commit Messages\
Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```bash
git commit -m "feat: add Claude 3 model support"
git commit -m "docs: update provider integration guide"
```

4. **Push Changes**

```bash
git push origin your-branch-name
```

5. **Create Pull Request**

* Reference related issues
* Describe changes clearly
* Update documentation
* Ensure all tests pass

## Code Style & Quality 📐

**Python Guidelines**

* PEP 8 compliance
* Type hints for all functions
* Google-style docstrings
* 120 character line length
* Use black and flake8 for formatting

```bash
# Run linters
poetry run black .
poetry run flake8
```

**AI Provider Integration**

* Follow provider-specific patterns
* Implement standardized interfaces
* Add validation layers
* Include rate limiting

## Testing Guidelines 🧪

**Requirements**

* 100% test coverage for new code
* Meaningful test names
* Mock external API calls

**Running Tests**

```bash

poetry run pytest --cov=src --cov-report=term-missing
```

**Test Structure**

```python
def test_deepseek_provider_response_parsing():
    # Arrange
    test_input = {...}
    
    # Act 
    result = parse_response(test_input)
    
    # Assert
    assert result.valid == True
    assert "error" not in result.metadata
```

## Documentation 📖

**Updating Docs**

1. Modify Markdown files in /docs
2. Update docstrings
3. Rebuild documentation:

```bash
poetry run mkdocs build
```

**Writing Standards**

* Use GitHub Flavored Markdown
* Include Mermaid diagrams for complex flows
* Add code examples
* Keep language simple and direct

## Community Guidelines 🤝

**Code of Conduct**\
We adhere to the [Contributor Covenant](https://www.contributor-covenant.org/). Please:

* Be respectful and inclusive
* Assume positive intent
* Keep discussions constructive

**Communication**

* 💬 Join our Discord
* 📧 Email maintainers@novix.ai
* 🐞 Use GitHub Issues for technical discussions

## Recognition 🏆

All meaningful contributions will:

* Be listed in release notes
* Appear in our GitHub contributors graph
* Receive special mention in project documentation
* Qualify for our "Contributor of the Month" program

**Thank you for helping make Novix better! 🎉**

"_Alone we can do so little; together we can do so much_." - Helen Keller
