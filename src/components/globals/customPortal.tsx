/* 
The code you provided is a TypeScript module that exports a CustomPortal component, which creates a portal to render content outside of its parent component.

The CustomPortal component takes in a children prop, which can be a single React node or an array of nodes. It creates a reference to the InnerPortal component using the useRef hook, and passes the portal and destroyPortal methods of the InnerPortal component to the CustomContextProvider component using the portal and destroyPortal props.

The InnerPortal component is a forwardRef component that takes in a ref prop and returns the content to be rendered in the portal. It uses the useState hook to manage the content of the portal, and defines two methods: portal, which sets the content of the portal to the specified value, and destroyPortal, which removes the content of the portal.

The useImperativeHandle hook is used to expose the portal and destroyPortal methods of the InnerPortal component to the parent component using the ref prop.
 */

import { CustomContextProvider } from '@globals/context';
import {
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export type CustomPortalContext = {
  portal: (content: ReactElement) => void;
  destroyPortal: () => void;
};

/**
 * A component that creates a portal to render content outside of its parent component.
 * @param ref - A reference to the component instance.
 * @returns The content to be rendered in the portal.
 */
const InnerPortal = forwardRef<CustomPortalContext, Record<string, unknown>>((_, ref) => {
  const [content, setContent] = useState<ReactElement | null>(null);

  /**
   * Creates a portal with the specified content.
   * @param _content - The content to be rendered in the portal.
   */
  const portal = useCallback((_content: ReactElement) => {
    setContent(_content);
  }, []);

  /**
   * Destroys the portal and removes its content.
   */
  const destroyPortal = () => {
    setContent(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      portal,
      destroyPortal,
    }),
    []
  );

  return <div>{content || ''}</div>;
});

/**
 * A reference to the inner portal, which contains methods to create and destroy a portal.
 * @typedef {Object} InnerPortalRef
 * @property {(content: ReactNode) => void} portal - A function that creates a portal with the given content.
 * @property {() => void} destroyPortal - A function that destroys the portal.
 */
export default function CustomPortal({ children }: { children: ReactNode | ReactNode[] }) {
  const innerPortalRef = useRef<CustomPortalContext | null>(null);
  const [current, setCurrent] = useState<CustomPortalContext | null>(null);

  useEffect(() => {
    if (innerPortalRef?.current) {
      setCurrent(innerPortalRef?.current);
    }
  }, []);

  return (
    <CustomContextProvider portal={current?.portal} destroyPortal={current?.destroyPortal}>
      <InnerPortal ref={innerPortalRef} />
      {children}
    </CustomContextProvider>
  );
}
