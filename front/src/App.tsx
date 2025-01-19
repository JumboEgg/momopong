interface Props {
  title?: string; // optional prop으로 설정
}

function App({ title = 'Default Title' }: Props): JSX.Element {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}

export default App;
