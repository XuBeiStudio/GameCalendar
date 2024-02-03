import { evaluate } from '@mdx-js/mdx';
import { MDXProvider, useMDXComponents } from '@mdx-js/react';
import react, { ReactNode, useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
// @ts-ignore
import { Props } from '@mdx-js/react/lib';

const InnerComponent: react.FC<{
  markdown: string;
}> = (props) => {
  const [comp, setComp] = useState<ReactNode>();
  const components = useMDXComponents();

  useEffect(() => {
    evaluate(props.markdown, {
      Fragment: react.Fragment,
      ...runtime,
      useMDXComponents: () => components,
    }).then((code) => {
      setComp(code.default({}));
    });
  }, [props]);

  return comp ?? null;
};

const Component: react.FC<{
  markdown: string;
  components?: Props['components'];
}> = (props) => {
  return (
    <MDXProvider components={props.components}>
      <InnerComponent markdown={props.markdown} />
    </MDXProvider>
  );
};

export default Component;
