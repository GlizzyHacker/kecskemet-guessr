export default function CreatePlayer({ onCreatePlayer }: { onCreatePlayer: (name: string) => void }) {
  function handleForm(formData: FormData) {
    onCreatePlayer(formData.get('name')!.toString());
  }

  return (
    <div className='flex flex-row min-h-screen justify-center items-center'>
      <form action={handleForm} className='bg-secondary p-10 rounded-xl '>
        <label htmlFor='name'>Name:</label>
        <input id='name' name='name' type='text' placeholder='Prób András' className='bg-primary flex rounded-xl p-2' />
        <br />
        <button type='submit' className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2'>
          Create player
        </button>
      </form>
    </div>
  );
}
