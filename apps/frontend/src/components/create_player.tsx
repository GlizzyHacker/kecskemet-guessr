export default function CreatePlayer({ onCreatePlayer }: { onCreatePlayer: (name: string) => void }) {
  function handleForm(formData: FormData) {
    onCreatePlayer(formData.get('name')!.toString());
  }

  return (
    <form action={handleForm}>
      <input name='name' type='text' color='green' />
      <button type='submit'>Create player</button>
    </form>
  );
}
