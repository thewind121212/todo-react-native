
# React Native Todo App with Expo

This React Native Todo app is built using **Expo** and focuses heavily on **UI/UX** design and user interaction. The app includes **habit tasks** that reset every day and **non-habit tasks** that have specific deadlines. The app allows users to track and manage tasks in an engaging and visually appealing way.

# Tech Stack for To-Do App

## Libraries Used

### Core Libraries
- Expo
- React
- React Native

### Navigation
  - Bottom Tabs
  - Native Navigation

### State Management
- Zustand

### UI and Animations
- Moti
- Lottie
- React Native SVG

### Data Storage & Database
- Expo SQLite
- AsyncStorage

### UI Components
- React Native Calendars
- React Native Dropdown Picker
- React Native Gesture Handler
- React Native Reanimated
- React Native Safe Area Context
- React Native SVG Transformer
- React Native Screens

### Notifications
- Expo Notifications

### Device Integration
- Expo Device
- Expo Haptics

## Web Integration
- React Native Web
- React Native WebView

## Utility Libraries
- Use Debounce
- @Shopify Flash List

## DevTools & Testing
- Jest
- Jest-Expo


## Features

### 1. **Onboarding Experience**
   - The onboarding flow introduces users to the core features of the app.
   - Step-by-step guidance helps users understand how to use habit tasks, non-habit tasks, and how to manage them effectively.
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.42.40.png)

### 2. **Habit Tasks**
   - Reset daily.
   - Mark completed or incomplete for the day.
   - Visual progress tracker using a circle fill indicator.
   - Displays undone habit tasks and recent tasks added.

### 3. **Non-Habit Tasks**
   - Tasks with deadlines.
   - Can include main tasks with associated subtasks.
   - Display countdown timers showing time remaining until deadlines.

### 4. **Main Task Management**
   - Allows users to create tasks that hold both habit tasks and non-habit tasks.
   - Displays deadlines for each main task and manages all subtasks and tasks together.

## App Screens

### Screen 1: **Home Screen (Overview of Habit Task Progress)**
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.04.19.png)
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.04.29.png)
- **Purpose**: This screen gives users an overview of their habit tasks for the day, showing the progress and completion status of each habit.
- **Features**:
  - **Habit Task Progress**: A circular progress indicator shows the percentage of completion for each habit task. The circle fills up as the user completes the task.
  - **Undone Habit Tasks**: Habit tasks that haven't been completed yet are displayed at the top of the screen, providing a quick view of what still needs to be done today.
  - **Recent Tasks**: Displays recently added non-habit tasks that haven't been marked as completed yet. These tasks are shown with their deadlines or due dates.
  - **Interactive Elements**: Clicking on a task will take the user to the task detail page where they can interact with it further.



### Screen 2: **Habit Task Interaction Screen**

- **Purpose**: This screen is designed for users to manage and interact with their habit tasks directly.
- **Features**:
  - **Task Checklist**: Users can check or uncheck habit tasks, marking them as done or undone for the day.
  - **Add Tasks**: Users can add new habit tasks to their daily list.
  - **Reset**: At the end of the day, habit tasks will automatically reset (or users can manually reset them if needed).
  - **Progress Bar**: A visual indicator shows how many tasks have been completed today versus how many are pending.
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.04.59.png)
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.04.49.png)
### Screen 3: **Main Task with Subtasks and Deadline**

- **Purpose**: This screen allows users to manage both main tasks and their subtasks, providing details on deadlines for each.
- **Features**:
  - **Main Task**: Users can add or edit main tasks that hold multiple subtasks.
  - **Subtasks**: Each main task can have multiple subtasks that can be checked off once completed.
  - **Deadline**: Each main task has a deadline, and users can view the countdown to the deadline.
  - **Task Management**: Users can easily switch between main tasks and subtasks, check off completed items, and track deadlines.
  - **Progress Tracker**: For main tasks, a progress bar shows how many subtasks have been completed versus the total number of subtasks.
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.06.08.png)

### Screen 4: **Main Task Management Screen (Create & View Tasks)**

- **Purpose**: The main screen of the app, where users can create new tasks, add habits and non-habit tasks, and see deadlines.
- **Features**:
  - **Create Main Tasks**: Users can create new main tasks, which can hold both habit tasks and non-habit tasks.
  - **Add Habit and Non-Habit Tasks**: For each main task, users can add related habit tasks (reset daily) and non-habit tasks (with deadlines).
  - **View Deadlines**: Users can view the deadline for each main task and track how much time remains.
  - **Task Overview**: All main tasks are listed, with their deadlines and associated tasks. Completed tasks are marked, and the remaining time until the deadline is displayed.
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.08.12.png)
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.08.05.png)
## Task Models

### MainTask Model
Represents the main task, which can be either a habit or a non-habit task.

- `id`: A unique identifier for the main task.
- `title`: The title of the main task.
- `color`: The color associated with the task.
- `type`: The type of the task, either `'habit'` or `'task'`.
- `create_date`: The timestamp when the main task was created.
- `update_date`: The timestamp when the main task was last updated.
- `due_day`: The due date for the task (only applies if the task type is `'task'`).
- `completed`: Tracks whether the main task has been completed (0 for not completed, 1 for completed).
  
### Task Model
Represents the individual tasks related to a `MainTask`. This can include subtasks and other tasks associated with the main task.

- `id`: A unique identifier for the task.
- `title`: The title of the task.
- `completed`: A boolean (0 for not completed, 1 for completed) indicating whether the task has been completed.
- `priority`: The priority level of the task, where `0` is the lowest and `2` is the highest.
- `main_task_id`: The foreign key referencing the `id` of the related `main_tasks` entry.
- `create_date`: The timestamp when the task was created.
- `update_date`: The timestamp when the task was last updated..

## Data Management

As of now, data is stored locally using **DB disk** storage:
   - Habit tasks reset daily and are tracked locally.
   - Non-habit tasks are tracked with deadlines and stored on the device.

In Stage 2, this local storage will be replaced with a system that syncs data across devices and with the backend server.


## Stage 2 - Authentication and Data Synchronization

In **Stage 2**, the app will be enhanced with **authentication** features and **data synchronization** with an external website. Currently, the app uses **DB disk** for local storage. However, in Stage 2, the app will implement **user authentication** using either a **custom authentication service** or a **third-party authentication service** (e.g., Firebase, Auth0) to manage user data securely.

Once the user is authenticated, the app will synchronize the user's tasks and progress with a **website** or **backend service**. This enables users to access their data across multiple devices and ensures that their task list is always up-to-date, regardless of the platform.

### Features in Stage 2

#### 1. **Authentication**
   - **User Sign-In/Sign-Up**: Implement user authentication to securely store and manage user data.
   - **Third-Party or Custom Authentication**: Use either a custom backend or a third-party service (like Firebase, Auth0) for authentication.
   - **Session Management**: Manage user sessions to ensure that data is loaded and saved only when a user is authenticated.

#### 2. **Data Synchronization**
   - **Sync Local and Remote Data**: After user authentication, synchronize the tasks, habit progress, and deadlines with a backend server or website.
   - **Data Integrity**: Ensure that the data is accurately synced between the local DB (DB disk) and the backend.
   - **Cross-Platform Sync**: Allow the user to access their data from different devices by syncing with the website, ensuring all changes reflect across platforms.
   
#### 3. **User Data Storage and Security**
   - **Secure Data Handling**: Store user data securely and ensure that sensitive information, like passwords and authentication tokens, is encrypted.
   - **Data Backup**: Implement periodic data backup to ensure that the user's progress is not lost.

#### 4. **Backend Integration**
   - **API Integration**: Implement API calls to interact with the backend for data storage, retrieval, and synchronization.
   - **Real-Time Sync (Optional)**: If feasible, implement real-time synchronization (e.g., using WebSockets) to keep the user's tasks updated across devices without requiring manual refresh.

### Next Steps
In **Stage 2**, the following tasks will be completed:
1. Choose and implement an authentication method (custom or third-party).
2. Set up a backend service (e.g., Firebase or custom backend) for user data storage and synchronization.
3. Implement synchronization logic to ensure data consistency between local and remote storage.
4. Test cross-device synchronization to ensure a seamless user experience.
5. Securely handle authentication tokens and user data.


## Installation for Expo

To get started with this app using **Expo**, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/react-native-todo-app.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd react-native-todo-app
    ```

3. **Install Expo CLI** (if you don't have it already):
    ```bash
    npm install -g expo-cli
    ```

4. **Install dependencies**:
    ```bash
    npm install
    ```

5. **Start the app**:
    ```bash
    expo start
    ```

   This will open a development server and provide a QR code. Scan the QR code with the Expo Go app on your phone, or use the iOS/Android simulator.

## Screenshots (Future Implementation)

You can include wireframes, mockups, or screenshots of the app's UI here. These will help give visual context to the screens described above.
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.08.29.png)
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.08.47.png)![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.08.53.png)
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.09.01.png)
![enter image description here](https://admin.wliafdew.dev/api/media/file/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-03-20%20at%2012.09.26.png)
