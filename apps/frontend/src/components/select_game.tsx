export default function SelectGame({ onCreate, onJoin }: { onCreate: () => void; onJoin: (id: number) => void }) {
  function handleForm(formData: FormData) {
    onJoin(Number(formData.get('gameId')!));
  }

  return (
    <div className='flex flex-row min-h-screen justify-center items-center'>
      <div className='bg-secondary p-10 rounded-xl '>
        <button onClick={onCreate} className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2'>
          Create game
        </button>
        <br />
        <form action={handleForm} className='mt-4'>
          <label htmlFor='gameId'>Game id:</label>
          <input name='gameId' type='number' className='bg-primary flex rounded-xl p-2' />
          <button type='submit' className='bg-primary outline-tertiary items-center mx-auto flex rounded-xl p-2 mt-2'>
            Join game
          </button>
        </form>
      </div>
    </div>
  );
}
