import {
  atom,
  injectAtomInstance,
  injectStore,
  useAtomState,
  useAtomValue,
} from "@zedux/react";

const parentAtom = atom("parent", ({ groupId }: { groupId: string }) => {
  const store = injectStore(`parent-value-for-group-${groupId}`);

  return store;
});

const childAtom = atom("child", ({ groupId }: { groupId: string }) => {
  const parent = injectAtomInstance(parentAtom, [{ groupId }]);

  const store = injectStore<{ childId: string; parentValue?: string }>({
    childId: "some-id",
  });

  // @ts-expect-error how to type store composition...?
  store.use({ parentValue: parent.store });

  return store;
});

const showChildAtom = atom("show-child", false);

export default function App() {
  const [showChild, setShowChild] = useAtomState(showChildAtom);

  return (
    <div className="App">
      <div>
        <button onClick={() => setShowChild(!showChild)}>Toggle child</button>
      </div>

      <br />

      {showChild && <Child groupId="some-group-id" />}
    </div>
  );
}

const Child = ({ groupId }: { groupId: string }) => {
  const child = useAtomValue(childAtom, [{ groupId }]);

  return (
    <div>
      <div>Parent value: {child.parentValue ?? "NO VALUE!!"}</div>
      <div>Child value: {child.childId ?? "NO VALUE!!"}</div>
    </div>
  );
};
