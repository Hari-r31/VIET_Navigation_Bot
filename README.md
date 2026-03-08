# Frontend Architecture Documentation

## Project Overview

The **VIET Campus Kiosk** is an interactive, multilingual touch-screen application designed for the Visakha Institute of Engineering & Technology. It serves as a digital concierge for students and visitors, providing:

*   **Campus Navigation:** Step-by-step directions to departments, labs, and amenities.
*   **Fee Information:** Detailed fee structures for various courses and branches.
*   **AI Assistant:** A voice-enabled smart assistant powered by Google Gemini to answer queries.
*   **Multilingual Support:** Full interface and voice support in English, Telugu, and Hindi.
*   **Mobile Handoff:** QR code generation to transfer navigation directions to a user's smartphone.

## Tech Stack

*   **Core:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM (HashRouter for kiosk compatibility)
*   **State Management:** React Context API
*   **AI & Logic:** Google GenAI SDK (`@google/genai`), Fuse.js (Fuzzy Search)
*   **Voice:** Web Speech API (Speech Recognition & Synthesis)
*   **UI Components:** Lucide React (Icons), React Hot Toast (Notifications), QRCode.react

---

## Folder Structure

```
src/
├── components/      # Reusable UI components and modals
├── contexts/        # Global state providers (Language, Voice)
├── data/            # Static data, translations, and mock content
├── services/        # Business logic, API calls, and helper functions
├── views/           # Main page screens (Routes)
├── App.tsx          # Main application component and routing configuration
├── index.tsx        # Entry point
└── types.ts         # TypeScript definitions and interfaces
```

---

## Detailed File-by-File Explanation

### 1. Root Configuration

#### `src/App.tsx`
*   **Purpose:** The root component that defines the application's routing structure.
*   **Responsibility:** Sets up the `HashRouter`, `LanguageProvider`, and defines the `KioskLayout`. It handles routing between the Welcome screen, Home, Directions, Fees, and Mobile views.
*   **Code Role:** Configuration / Layout
*   **Key Logic:** Uses `Outlet` for nested routing and conditionally renders the global `Assistant` component on non-home pages.

#### `src/index.tsx`
*   **Purpose:** The entry point of the React application.
*   **Responsibility:** Mounts the `App` component into the DOM root.
*   **Code Role:** Configuration

#### `src/types.ts`
*   **Purpose:** Centralized type definitions.
*   **Responsibility:** Defines interfaces for `LocationData`, `FeeStructure`, `ChatMessage`, and `NavStep` to ensure type safety across the app.
*   **Code Role:** Utility/Helper

### 2. Components (`src/components/`)

#### `Assistant.tsx`
*   **Purpose:** The floating AI assistant interface.
*   **Responsibility:** Handles user chat interactions, voice input, and displays AI responses. It integrates with `agentService` to process queries.
*   **How It Works:** Maintains a chat history state. Uses `sendMessageToGemini` to get responses. Supports "Tool Calling" to navigate users to specific pages (e.g., "Show me fees").
*   **Dependencies:** `agentService`, `LanguageContext`.
*   **Code Role:** UI Component / Smart Component

#### `Header.tsx`
*   **Purpose:** The top navigation bar.
*   **Responsibility:** Displays the college logo, name, and the global voice mute/unmute toggle.
*   **Code Role:** UI Component

#### `VoiceHelpModal.tsx`
*   **Purpose:** Help dialog for troubleshooting voice features.
*   **Responsibility:** Shows instructions on how to install language packs (Telugu/Hindi) on Windows, macOS, and Android.
*   **Code Role:** UI Component

#### `VoiceSearchModal.tsx`
*   **Purpose:** A full-screen modal for voice input.
*   **Responsibility:** Visualizes the listening state (listening, processing) and captures voice input for search fields.
*   **Dependencies:** `speechService`.
*   **Code Role:** UI Component

### 3. Contexts (`src/contexts/`)

#### `LanguageContext.tsx`
*   **Purpose:** Global state for language and voice settings.
*   **Responsibility:** 
    *   Manages the current language (`en`, `te`, `hi`).
    *   Provides the `t` object for translations.
    *   Exposes `speak`, `stopSpeaking`, and `toggleVoice` functions.
*   **How It Works:** Uses React Context to wrap the app. It initializes the speech synthesis engine and updates the voice based on the selected language.
*   **Code Role:** State Management

### 4. Data (`src/data/`)

#### `translations.ts`
*   **Purpose:** Localization strings.
*   **Responsibility:** Contains a dictionary of all UI text in English, Telugu, and Hindi.
*   **Code Role:** Configuration / Data

#### `mockData.ts`
*   **Purpose:** Static database for the application.
*   **Responsibility:** Stores `LOCATIONS` (campus map data) and `FEES` (fee structures).
*   **Code Role:** Data Source

#### `faqData.ts`
*   **Purpose:** Knowledge base for the AI.
*   **Responsibility:** Contains structured FAQs that are fed into the AI's system prompt to ensure accurate answers.
*   **Code Role:** Data Source

### 5. Services (`src/services/`)

#### `agentService.ts`
*   **Purpose:** Interface for Google Gemini AI.
*   **Responsibility:** Sends user prompts to the Gemini API and handles the response.
*   **How It Works:** 
    *   Constructs a system prompt containing campus data (`LOCATIONS`, `FEES`, `FAQS`).
    *   Manages the chat session.
    *   Handles "Function Calling" (e.g., if the AI decides to navigate the user, it returns a function call object instead of text).
*   **Dependencies:** `@google/genai`.
*   **Code Role:** API Service

#### `searchService.ts`
*   **Purpose:** Fuzzy search logic.
*   **Responsibility:** Searches through `LOCATIONS` based on user queries.
*   **How It Works:** Uses `Fuse.js` to perform approximate string matching on location names, aliases, and departments.
*   **Code Role:** Utility/Helper

#### `speechService.ts`
*   **Purpose:** Wrapper for Web Speech API.
*   **Responsibility:** Handles Text-to-Speech (TTS) and Speech-to-Text (STT).
*   **How It Works:** 
    *   `speak()`: Selects the appropriate voice (e.g., "Google Hindi") and speaks the text.
    *   `startListening()`: Activates the microphone and returns transcribed text.
    *   `startWakeWordListener()`: Continuously listens for "Hey Campus" to wake the assistant.
*   **Code Role:** Utility/Helper

### 6. Views (`src/views/`)

#### `Welcome.tsx`
*   **Purpose:** The landing screen / screensaver.
*   **Responsibility:** Allows the user to select their preferred language to enter the kiosk mode.
*   **Code Role:** Page

#### `Home.tsx`
*   **Purpose:** The main dashboard.
*   **Responsibility:** Displays the 3D interactive campus map (image) and quick access buttons to Directions, Fees, and AI Help.
*   **Code Role:** Page

#### `Directions.tsx`
*   **Purpose:** The navigation hub.
*   **Responsibility:** Allows users to find locations via:
    *   **Search:** Text or voice search.
    *   **Browse:** Hierarchical menu (Block -> Department -> Room).
*   **How It Works:** Manages complex state (`navState`) to drill down from "Main Block" to specific departments. Displays the route map and step-by-step instructions.
*   **Code Role:** Page

#### `Fees.tsx`
*   **Purpose:** Fee structure display.
*   **Responsibility:** Allows users to select a Course and Branch to view tuition, seat capacity, and other fees.
*   **Code Role:** Page

#### `MobileDirections.tsx`
*   **Purpose:** Mobile-optimized view.
*   **Responsibility:** This page is accessed via QR code on the user's phone. It shows the route details without the heavy kiosk UI.
*   **Code Role:** Page

---

## Application Rendering Flow

1.  **Initialization:**
    *   `index.tsx` mounts `App`.
    *   `LanguageProvider` initializes, checking for available voices.
    *   `HashRouter` loads the default route (`/`).

2.  **Welcome Screen:**
    *   User sees `Welcome.tsx`.
    *   Selecting a language updates `LanguageContext` and navigates to `/home`.

3.  **Kiosk Layout:**
    *   `App.tsx` renders `KioskLayout`.
    *   `Header` is displayed.
    *   `Assistant` is mounted (hidden by default, listening for wake word).

4.  **User Interaction (e.g., Directions):**
    *   User clicks "Directions" -> `Directions.tsx` loads.
    *   User searches for "CSE Lab".
    *   `searchService` finds the location.
    *   `Directions.tsx` updates state to show the route map and steps.
    *   `speechService` announces "Navigating to CSE Lab".

5.  **AI Interaction:**
    *   User says "Hey Campus" or clicks the Assistant icon.
    *   `Assistant` opens.
    *   User asks "What is the fee for CSE?".
    *   `agentService` sends query to Gemini.
    *   Gemini returns a tool call `showFees({ course: 'B.Tech', branch: 'CSE' })`.
    *   `Assistant` executes the tool, navigating the router to `/fees` with state.

---

## Setup Instructions

1.  **Prerequisites:** Node.js (v18+) and npm.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173` (or port 3000 if configured).

---

## Development Guidelines

*   **Mobile-First vs. Kiosk-First:** While Tailwind is mobile-first, this app is designed primarily for large touch screens (1920x1080). Use `md:` and `lg:` breakpoints to optimize for the kiosk display.
*   **Accessibility:** Ensure all buttons are large enough for touch interaction (min 44px).
*   **State:** Use `LanguageContext` for anything that needs to persist across pages (like voice settings). Use local state for page-specific logic.
*   **Translations:** All text **MUST** use the `t` object from `useLanguage`. Do not hardcode English strings in components.
*   **Error Handling:** Always wrap API calls (GenAI) in try-catch blocks and provide user feedback via `react-hot-toast`.
