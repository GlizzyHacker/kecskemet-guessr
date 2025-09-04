import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
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
  const [open, setOpen] = useState(false);

  function handleForm(form: FormData) {
    onSend(String(form.get('content')));
  }

  return (
    <div className={`${className} bg-secondary rounded-xl p-2`}>
      <div className='m-2 flex'>
        <h2 className='flex-1 text-center'>{t('chat')}</h2>
        <button className='md:hidden' onClick={() => setOpen(!open)}>
          <FaChevronUp className={`transition-all duration-300 ${open ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <div
        className={`${open ? 'max-md:max-h-[300]' : 'max-md:max-h-0'} md:max-h-[300] overflow-hidden transition-all duration-300 flex flex-col space-y-2`}
      >
        <div
          className='bg-primary flex-1 space-y-4 overflow-y-scroll min-h-[80] max-h-[300] rounded-[8] p-2'
          style={{ overflowAnchor: 'none' }}
        >
          {messages.map((message, i) => (
            <div
              key={message.author + message.id}
              className='flex flex-col space-x-2'
              style={i + 1 == messages.length ? { overflowAnchor: 'auto' } : {}}
            >
              <div className='flex flex-row space-x-2'>
                <h3 className='flex-1'>{message.author}</h3>
                <p className='flex text-end tabular-nums'>{`${message.date.getHours() < 10 ? '0' : ''}${message.date.getHours()}:${message.date.getMinutes() < 10 ? '0' : ''}${message.date.getMinutes()}`}</p>
              </div>
              <p className='mx-2'>{message.content}</p>
            </div>
          ))}
          <div />
        </div>
        <form action={handleForm} className='flex gap-2'>
          <input
            id='content'
            name='content'
            type='text'
            autoComplete='off'
            className='bg-primary rounded-xl p-2 flex-1'
            size={1}
          />
          <Button type='submit'>{t('send')}</Button>
        </form>
      </div>
    </div>
  );
}
