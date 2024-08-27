# gudppl-web

## Libraries Integrated

### Development

- Vite
- Jotai
- Material UI

### Testing LIbraries

- vitest
- Cypress E2E

## Getting Started

We use Node v18.16.1 and pnpm.

### 1. Install Dependencies

```bash
pnpm i
```

### 2. Add Env Files

We are using Vite env capabilities hence we have 3 .env files

1. `.env.development`
2. `.env.next`
3. `.env.production`

#### Env Keys

`NODE_ENV`

### 3. Start App

```bash
pnpm start
```

## Development Guide

### API Endpoints

All API endpoints are located in `./src/api/endpoints.ts`. When you want to add new lambda api endpoint use:

```js
// update type with the new api endpoint name
type ApiName = ... | 'getUsers';

// add the endpoint
api.addEndPoint('getUsers', 'abc123', 'prod/users');
```

you can then access the endpoint as below:

```js
import { Api } from '@api/endpoints';

const path = Api.endpoints.getUsers;
```

#### API Endpoint Implementations

All API endpoint implementations shoul have it's own file and should place under `./src/api/`. These endpoint implementations are accessible through `@api/*`.

### State Management

We are using Jotai as our global state management tool. Jotai promote atomic entities to represent global state.

We have 2 types of states.

1. App State - Atoms that are using globally in the app
2. Server State - Atoms that are fetching data from api endpoints

#### Application State Atoms

Use/Add application atoms when you want to share states between different components. This doesn't mean you need to use atoms for every where. if you can survive with `useEffect`(component specific state) that's totally fine.

There is no hard and fast rule for the file name convention. But always try to group it by component name. But you have to add `.atom` as the postfix.

e.g.: `app.atom.ts`

**`app.atom.ts`** is responsible on holding atoms that can affect throughout the application.

#### Server State Atoms

We are using `https://jotai.org/docs/integrations/query` to handle api calls. This plugin uses react query underneath and has simplified the api signatures.

To define a server state atom,

1. Look proper category from existing folders. If there is none create a new one.
2. Each category folder should have a `queryKey.ts` file. Define unique keys for each Api call.
3. Create files with HTTPS method as prefix and `.atom` as postfix. As an example if the api you are going to use is a `get` method then the file name should be `getUsersAtom`.

All server state atoms can be access through `@serverAtoms/` path.

> Try to implement all business logics within the atoms. This will help us to test business logics separately and isolate business logics from the components. You can use function utils and hook utils as well.

## App Components

We highly recommend [composition components](https://legacy.reactjs.org/docs/composition-vs-inheritance.html) and always try to breakdown your components to atomic level. With this idea in mind we created 4 folders to force atomicity.

Mainly we have 4 kinds of components. You can go deeper level of breakdown as you prefer.

### 1. Layout Kind

These components mainly consist of elements related to the main layout and most of the time will not have business logic.

```jsx
<Container>
  <LeftColumn>{props.left}</LeftColumn>
  <RightComponent>{props.right}</RightComponent>
</Container>
```

You can access components inside this folder using `@layouts/`

### 2. Pages Kind

This way can to categories main functionalities in the app and represent pages in the UI design.

```jsx
<AppLayout
  left={(
    <LeftNavigation />
  )}
  right={(
    <InnerPageRouteOne>
    <InnerPageRouteTwo>
    <InnerPageRouteThree>
  )}
>
```

You can access components inside this folder using `@pages/`

### 3. Global Kind

This folder contains all the shareable components.

```jsx
<SignUpForm />
<ProductDetailsCard />
```

You can access components inside this folder using `@globals/`

## Third Party Components

All third party components should export from `./src/components/ui` even though there are no custom implementations or overrides. Main reason is to future proof third party component we are using.

these components are accessible through `@ui/` path.

### Material Components

#### Theming

First identify the style override you want to do is global. If it's a global style it's always better to apply it through material uis' theme provider.

Refer: [https://mui.com/material-ui/customization/theme-components/](https://mui.com/material-ui/customization/theme-components/)

You can use theme playground to tryout your style changes using below app:

[https://zenoo.github.io/mui-theme-creator/](https://zenoo.github.io/mui-theme-creator/)

> This approach going to solve lot's of css cascading and override issues as well as reduce our code.

## Utils

### Configs

You can use this folder to store configurations related files. Create separate file for each configuration.

you can access configs folder using `@utils/configs` path

### constants

You can use this folder to place all your constants. Categorize files properly.

you can access constants folder using `@utils/constants` path

### functions

You can use this folder to keep utility functions.

you can access functions folder using `@utils/functions` path

### hooks

You can use this folder to keep React Hook functions.

you can access hooks folder using `@utils/hooks` path

### Redux ToolKit (RTK)

We decide to move from jotai to RTK (And RTK Query so we do not need React Query as RTK has their own implementation for data fetching and caching). RTK is a complete solution for state management. It has it's own api to handle api calls and it's own api to handle global state management. Our reson to move to RTK is to reduce the complexity of the code base and to have a single solution for state management.

#### Global State Management

The app state lives in `src/store`. The `store.ts` file contains the configuration for the store. The `slices` folder contains all the slices. Each slice is a module that contains the state, reducers, actions and selectors for a specific part of the app. The `index.ts` file in the `slices` folder exports all the slices.

The `hooks.ts` file contains the custom hooks to access the state, dispatch actions and selectors.

Note: This is somewhat different from the RTK recommended folder structure. We have decided to group all the slices in a single folder as we can gradually migrate to RTK from Jotai. Furthermore we do no need to couple the slices with the components. You can read more about the recommended file structure [here](https://redux.js.org/tutorials/essentials/part-2-app-structure#application-contents).

Eventually the `appState` and `serverState` will be merged into a single store and the state will be handled by RTK Query.

#### API Calls

We use RTK Query to handle API calls. The `api` folder contains all the API calls. Each API call is a separate file. The `index.ts` file in the `api` folder exports all the API calls.

#### Read More

1. [RTK TS Quick Start](https://redux-toolkit.js.org/tutorials/typescript)
2. [RTK Query TS Quick Start](https://redux-toolkit.js.org/tutorials/rtk-query)
3. [RTK Query TS Advanced](https://redux-toolkit.js.org/rtk-query/overview)
