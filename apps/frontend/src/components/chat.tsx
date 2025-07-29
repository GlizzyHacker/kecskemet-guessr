import { useTranslations } from 'next-intl';
import Button from './button';

export default function Chat({
  messages,
  onSend,
  className,
}: {
  messages: { id: number; content: string; author: string; date: Date }[];
  onSend: (msg: string) => void;
  className?: string;
}) {
  const t = useTranslations('Chat');

  function handleForm(form: FormData) {
    onSend(String(form.get('content')));
  }

  return (
    <div className={`${className} bg-secondary rounded-xl p-2 space-y-2 h-[300] flex flex-col`}>
      <div className='bg-primary flex-1 space-y-4 overflow-y-scroll rounded-[8] p-2'>
        {messages.map((message) => (
          <div key={message.author + message.id} className='flex flex-col space-x-2'>
            <div className='flex flex-row space-x-2'>
              <h3 className='flex-1'>{message.author}</h3>
              <p className='flex text-end tabular-nums'>{`${message.date.getHours() < 10 ? '0' : ''}${message.date.getHours()}:${message.date.getMinutes() < 10 ? '0' : ''}${message.date.getMinutes()}`}</p>
            </div>
            <p className='mx-2'>{message.content}</p>
          </div>
        ))}
      </div>
      <form action={handleForm} className='flex space-x-2'>
        <input
          id='content'
          name='content'
          type='text'
          autoComplete='off'
          className='bg-primary flex rounded-xl p-2 flex-1'
        />
        <Button type='submit'>{t('send')}</Button>
      </form>
    </div>
  );
}
