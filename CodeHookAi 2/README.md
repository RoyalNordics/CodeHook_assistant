# AI Code Assistant with LangChain Integration

An intelligent authentication and chat interface system designed to provide seamless user experiences with advanced interaction capabilities.

## Features

- TypeScript full-stack architecture
- Reactive UI components
- Advanced error handling and user guidance
- Modular application design
- Claude AI Integration
- LangChain Integration for code analysis and improvement suggestions

## Prerequisites

- Node.js 18+
- A valid Claude API key
- A valid LangChain API key (for code analysis features)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key

# LangChain Configuration
LANGCHAIN_API_KEY=your_langchain_api_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=your_langchain_endpoint

# Server Configuration
PORT=5000
```

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/              # Backend Express server
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage interface
│   └── langchain.ts    # LangChain integration
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema definitions
```

## LangChain Integration

The project uses LangChain for advanced code analysis and improvement suggestions. Features include:

- Code quality analysis
- Performance optimization suggestions
- Best practices recommendations
- Security vulnerability detection
- Code refactoring suggestions

To enable LangChain features:

1. Obtain a LangChain API key from [LangChain's website]
2. Add the API key to your `.env` file
3. Enable tracing if needed for debugging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.