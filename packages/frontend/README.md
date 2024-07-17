# Project Layout Documentation

#### Root Level

- **README.md**: This file provides an overview of the project structure and guidelines.
- **package.json**: Lists project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **next.config.mjs**: Configuration for Next.js.
- **knip.json**: Configuration file for the Knip dependency analyzer.

#### Public

- **images/**: Contains general images used in the project.

#### src

- **app/**: Contains the core application files.
  <!-- - **api/**: Contains API route handlers.
    - **auth/**: Handles authentication routes using NextAuth. -->
  - **[ Cpanel | Job | Event | ...]/**: Contains the content reflecting page.
  - **layout.tsx**: Defines the main layout of the application.
  - **page.tsx**: The main landing page of the application.

- **components/**: Contains React components.
  - **atoms/**: Basic building blocks of the UI.
    - **Button**
    - **TextInput**
    - **Tooltip**
    - ...
  - **molecules/**: More complex UI elements built from atoms.
    - **JobCard**: Component for the authentication card.
    - **CreateEventModal**: Component for the modal to create a todo.
  - **pages/**: Components specific to pages.
    - **Cpanel**: Components for the control panel page.
    - **Job**: Components for the Job page.
    - **Event**: Components for the Event page.

<!-- - **constants/**: Contains constants used throughout the project.
  - **AuthProviders.ts**: Constants related to authentication providers.
  - **TechStackInfo.ts**: Constants related to the tech stack. -->

- **layouts/**: Contains layout components.
  - **MainLayout.tsx**: The main layout component for the application.

- **middleware.ts**: Middleware configuration file.

<!-- - **models/**: Contains data models.
  - **todo.ts**: Data model for todo items.
  - **user.ts**: Data model for users. -->

- **providers/**: Contains context providers.
  - **AuthSessionProvider.tsx**: Authentication session provider.

- **services/**: Contains service files.
  - **UserService.ts**: Service for interacting with the user API.
  - **JobService.ts**: Service for interacting with the job API.
  - **EventService.ts**: Service for interacting with the event API.

- **styles/**: Contains global and variable styles.
  - **globals.sass**: Global styles.
  - **variables.module.sass**: SASS variables.

- **types/**: Contains TypeScript type definitions.
  - **global.d.ts**: Global type definitions.

- **utils/**: Contains utility functions.
  - **validation.ts**: Utility functions for validation operations.

- **tests/**: Contains tests for various parts of the application.
  - **mocks/**: Contains API mockups
  - **components/**: Contains tests for components.
    - **atoms/**: Tests for atomic components.
      - **Button.test.tsx**: Tests for the Button component.
    - **molecules/**: Tests for molecule components.
      - **JobCard.test.tsx**: Tests for the JobCard component.
  - **utils/**: Contains tests for utility functions.
    - **validation.test.ts**: Tests for the validation utility functions.
  - **services/**: Contains tests for services.
    - **UserService.test.ts**

```ts
// User Service example
const createUser = async (username: string, email: string) => {
  return await fetch(URL + "/api/user", {
    method: "POST",
    body: JSON.stringify({ username, email }),
  });

};

const getAllUsers = async () => {
  return await fetch(URL + "/api/user", {
    method: "GET",
  });
};

const deleteUser = async (userId: string) => {
  return await fetch(URL + `/api/user?userId=${userId}`, {
    method: "DELETE",
  });
};

const updateUserStatus = async (userId: string, isComplete: boolean) => {
  return await fetch(URL + `/api/user?userId=${userId}&isComplete=${isComplete}`, {
    method: "PUT",
  });
};

const UserService = {
  createUser,
  getAllUsers,
  deleteUser,
  updateUserStatus,
};

export default UserService;
```

```ts
//AuthSessionProvider
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const AuthSessionProvider = ({ children, session }: Props) => (
  <SessionProvider session={session}>
    {children}
  </SessionProvider>
)

type Props = {
  children: React.ReactNode,
  session: Session | null
}

export default AuthSessionProvider;
```

```ts
// /src/app/Job/page.tsx
import Job from "@components/pages/Job";
export default Job;
```

```ts
// /src/components/pages/Job/index.tsx
export default function Job() {
  return (
    <main>
      <div>...</div>
    </main>
  );
}
```
