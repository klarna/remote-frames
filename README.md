# unicorn-dialogs

1. Remote render a component (react-entanglement)
2. Stack another component on top, and when closed / go back it removes it from the stack and renders the previous component
3. Do the same, but in an iframe ("remote" setup)

## Notes

- Back button could potentially be controlled by this component, since it is the one that knows what and if there are views in the stack (?). It could also offer the option to force back button to _not_ appear.
- It could make sense to have the component that creates the iframe, but we don’t always need an iframe, so this solution should be generic.
- If we are targeting an iframe: loading the requires JavaScript libraries / components in the FSO could be done by sending raw code via postMessage: the idea is that we don’t need a separate bundle for the FSO, and we can render arbitrary components into it, even if they were not prepared.
