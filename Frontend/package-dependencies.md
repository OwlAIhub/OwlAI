# Enhanced Markdown Rendering Dependencies

To support the enhanced markdown parsing and rendering features, you'll need to install these additional packages:

## Required Dependencies

```bash
npm install react-syntax-highlighter remark-math rehype-katex katex
```

## Package Details

### Core Markdown Processing

- `react-syntax-highlighter` - Advanced syntax highlighting for code blocks
- `remark-math` - Math equation parsing support
- `rehype-katex` - Math equation rendering with KaTeX
- `katex` - Math typesetting library

### Type Definitions

```bash
npm install --save-dev @types/react-syntax-highlighter
```

## Features Enabled

✅ **Enhanced Code Block Syntax Highlighting**

- Support for 30+ programming languages
- Line numbers for longer code blocks
- Copy and download functionality
- Language detection and display

✅ **Math Equation Support**

- LaTeX math rendering
- Inline and block math equations
- Professional mathematical typesetting

✅ **Advanced Markdown Features**

- GitHub Flavored Markdown (GFM)
- Task lists with checkboxes
- Enhanced tables with styling
- Better link handling with external indicators

✅ **Your Website Theme Integration**

- Green color scheme (`#52B788`) throughout
- Dark mode support
- Consistent styling with your landing page
- Professional typography and spacing

## Usage Example

```typescript
import { EnhancedMarkdownRenderer } from "@/core/chat";

// In your component:
<EnhancedMarkdownRenderer
  content={markdownContent}
  darkMode={darkMode}
  onCopy={(text) => console.log("Copied:", text)}
/>
```

## Code Block Examples

The enhanced renderer supports various code languages:

```javascript
// JavaScript with syntax highlighting
const example = "Hello World";
```

```python
# Python with syntax highlighting
def hello_world():
    print("Hello World")
```

```sql
-- SQL with syntax highlighting
SELECT * FROM users WHERE active = true;
```

## Math Equation Examples

Inline math: $E = mc^2$

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Installation Steps

1. Install the dependencies:

```bash
npm install react-syntax-highlighter remark-math rehype-katex katex
npm install --save-dev @types/react-syntax-highlighter
```

2. Import the CSS for KaTeX (already included in the component):

```typescript
import "katex/dist/katex.min.css";
```

3. Use the enhanced components in your chat interface

The enhanced markdown renderer is now ready to provide professional-grade content formatting with your website's design theme!
