[English](./README.md) | [中文](./README_zh.md)

![Persona Studio](./og.png)

# Persona Studio

Persona Studio is a powerful and intuitive web application designed for creating and managing digital personas and generating stunning AI-powered images. It leverages the capabilities of Google's Gemini API to provide a seamless and creative experience for artists, designers, and storytellers.

## Key Features

- **Advanced Character Creation**: 
  - **Multi-modal Inspiration**: Generate detailed character cards from a simple text idea, a reference image, or a combination of both.
  - **AI-Powered Idea Expansion**: Let the AI expand your brief character concepts into rich, detailed descriptions.
  - **Structured Editor**: Fine-tune every aspect of your character through a comprehensive, structured editor, from basic info and appearance to clothing and mood.
  - **Direct Upload**: You can also create characters by simply uploading an image and giving them a name.

- **Versatile Environment Creation**: Build immersive scenes and environments by providing text descriptions or uploading your own images.

- **Dynamic Photoshoot Studio**: 
  - **Scene Composition**: Combine your created characters and environments in a dedicated workspace to craft the perfect scene.
  - **Rich Artistic Styles**: Choose from a curated list of **14 distinct art styles**, including Cinematic, High Fashion, Cyberpunk, Vintage Film, and more, to define the look and feel of your image.
  - **"Inspire Me" for Scenes**: Generate creative photoshoot prompts based on your selected assets and chosen art style, sparking new ideas.

- **AI-Powered Image Generation & Finetuning**: 
  - **High-Quality Generation**: Generate high-resolution images based on your detailed compositions.
  - **Iterative Finetuning**: Easily refine and edit your generated images. A dedicated modal allows you to make precise adjustments using new prompts and even reference images for composition and style.
  - **Full Version History**: Never lose a good shot. The application maintains a complete history for each photo, allowing you to revisit, compare, and build upon previous versions.

- **Project & Global Controls**:
  - **Project Management**: Easily import and export your entire studio project (including all assets and photos) as a single `.zip` file for backup or migration.
  - **Generation Settings**: Globally control image generation parameters like aspect ratio and resolution.
  - **UI Customization**: Switch between light and dark themes and multiple languages (English and Chinese) to suit your preference.
  - **Reset Functionality**: Start fresh at any time by resetting the entire project workspace.

## How It Works

Persona Studio is built on a modern tech stack, including Next.js, React, and Tailwind CSS. The core functionality is powered by the Google Gemini API.

Here's a brief overview of the workflow:

1.  **Create Your Assets**:
    - **Characters**: Use the `Character Creator`. You can start with a simple idea or a reference image to have the AI generate a detailed **Character Card**. Then, use the structured editor to refine every detail before generating the final character portrait.
    - **Environments**: Use the `Environment Creator` to define your scenes via text prompts or by uploading an image.
2.  **Set the Scene in the Photoshoot Studio**:
    - Select one or more characters and an environment to place them in.
    - Choose from the list of available art styles.
    - Write a prompt describing the scene, or use the "Inspire Me" button to get a creative suggestion.
3.  **Generate and Refine**:
    - Click "Generate" to create your image. The app intelligently constructs a detailed prompt for the Gemini API based on all your inputs.
    - The generated image appears in the viewer. If you want to make changes, open the **Finetune Modal**. Here, you can tweak the prompt or add a reference image to guide the AI for the next iteration.
4.  **Manage Your Creations**:
    - All generated versions of a photo are saved in its **history timeline**. You can easily switch between versions, download your favorites, or delete them.
    - Use the header controls to export your entire project for safekeeping.

## Screenshots

### Asset Creation

![Asset Creation](screenshot/asset_create.png)

*Create unique characters and environments with detailed descriptions or by uploading your own images.*

### Asset Selection

![Asset Selection](screenshot/asset_selection.png)

*Easily manage and select your created assets for use in the Photoshoot Studio.*

### Photoshoot Studio

![Photoshoot Studio](screenshot/photo_shoot.png)

*The heart of the application, where you can combine assets, craft prompts, and generate stunning AI-powered images.*

## Getting Started

To get started with Persona Studio, you'll need to set up your environment and install the necessary dependencies.

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or your preferred package manager)
- A Google Gemini API key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/persona-studio.git
    cd persona-studio
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Google Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application will now be running at `http://localhost:3000`.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.