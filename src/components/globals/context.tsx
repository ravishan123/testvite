/* 
The CustomContextProvider component is a generic component that takes in a type parameter T and a children prop, as well as any additional props of type T. It creates a context using the createContext function from the React library, and sets the initial value of the context to null. The component then returns a CustomContext.Provider component with the value set to an object containing all of the additional props passed to the component. This allows the child components of the CustomContextProvider to access the context value using the useCustomContext hook.

The useCustomContext hook is a generic hook that takes in a type parameter T and returns the context value of type CustomContextType<T>. It uses the useContext hook from the React library to access the context value, and throws an error if the hook is used outside of a CustomContextProvider component.
 */

import { ReactNode, createContext, useContext } from 'react';

type CustomContextType<T> = {
  [key in keyof T]: T[key];
};

type CustomContextProviderProps<T> = CustomContextType<T> & {
  children: ReactNode | ReactNode[];
};

const CustomContext = createContext<CustomContextType<unknown> | null>(null);

/**
 * CustomContextProvider component that provides a custom context to its children.
 * @template T - The type of the context value.
 * @param {CustomContextProviderProps<T>} props - The props for the component.
 * @returns {JSX.Element} - The JSX element for the component.
 */
export default function CustomContextProvider<T>({ children, ...props }: CustomContextProviderProps<T>): JSX.Element {
  return <CustomContext.Provider value={{ ...props }}>{children}</CustomContext.Provider>;
}

/**
 * Hook that returns the custom context value.
 * @template T - The type of the context value.
 * @returns {CustomContextType<T>} - The custom context value.
 * @throws {Error} - If used outside of a CustomContextProvider.
 */
function useCustomContext<T>(): CustomContextType<T> {
  const context = useContext<CustomContextType<T>>(CustomContext as unknown as React.Context<CustomContextType<T>>);

  if (!context) {
    throw new Error('useCustomContext must be used within a CustomContextProvider');
  }

  return context;
}

export { CustomContextProvider, useCustomContext };
