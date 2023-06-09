# Chat with GPT

This is a simple web application that allows you to chat with OpenAI's GPT models, including GPT-4 and GPT-3.5-turbo. 
It is designed to provide a convenient interface for interacting with the models, as well as additional features for 
managing prompts and rendering HTML code.

## Features

- Send messages to GPT-4 and GPT-3.5-turbo models
- Adjust model settings such as temperature and max tokens
- Save and load prompts for easy reuse
- Render HTML code generated by the models within the chat interface
- Spawn iframes with the generated HTML code for live previews
- Copy the generated HTML code to the clipboard for external use

## Setup

1. Save the provided HTML code to a file, e.g., `index.html`.
2. Open the `index.html` file in your preferred web browser.

## Initial Configuration

1. Enter your OpenAI API key in the designated input field.
2. The application will store your API key in the browser's local storage for future use.

## Usage

1. Type your message in the textarea.
2. Choose the desired GPT model from the dropdown menu (GPT-4, GPT-3.5-turbo, or both).
3. Adjust the temperature and max tokens settings if necessary.
4. Click the "Send" button to send your message and receive a response from the selected model(s).

## Saving and Loading Prompts

1. To save a prompt, click the "Save Prompt" button and enter a name for the prompt.
2. The saved prompt will be stored in the browser's local storage.
3. To load a previously saved prompt, select it from the dropdown menu, and click the "Load" button.

## Working with Generated HTML Code

1. If GPT generates an HTML code, a "Spawn" button will appear next to the code.
2. Click the "Spawn" button to create an iframe displaying the generated HTML code for a live preview.
3. Click the "Copy" button next to the HTML code to copy it to your clipboard for external use.

## Dependencies

- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Showdown](https://github.com/showdownjs/showdown) for converting Markdown to HTML

## Notes

- This project is designed to work with OpenAI's API. Make sure you have a valid API key.
- The application uses local storage to store API keys, configuration settings, and saved prompts. Clearing your 
browser's local storage will remove this data.
- Keep in mind that the generated HTML code might not always be perfect. Always review and adjust the code as needed 
before using it in your projects.
