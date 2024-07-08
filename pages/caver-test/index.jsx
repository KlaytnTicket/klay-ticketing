import useMutation from '@lib/use-mutation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CaverTestPage() {
  const [message, setMessage] = useState('');
  const [res, setRes] = useState('');

  const { mutation, data: response, isLoading } = useMutation('/api/caver');
  const { register, handleSubmit } = useForm();

  async function onValid(form) {
    setMessage('');
    setRes('');
    mutation(form);
  }

  async function onInValid(errors) {
    const [error] = Object.values(errors);
    if (error) {
      setMessage(error.message);
      if (error.ref && error.ref.focus) {
        error.ref.focus();
      }
    }
  }

  useEffect(() => {
    if (response) {
      if (response.ok) {
        setRes(response.message);
        setMessage('');
      } else {
        setMessage(response.message);
        setRes('');
      }
    }
  }, [response]);

  return (
    <section className="m-auto flex h-full min-h-[100vh] items-center justify-center">
      <form className="flex min-w-[30vw] flex-col items-start justify-center gap-4 rounded-xl border-2 border-black p-4" onSubmit={handleSubmit(onValid, onInValid)}>
        <div className="flex w-full items-center justify-between">
          <label htmlFor="address" className="m-1 whitespace-nowrap bg-white">
            지갑 주소
          </label>
          <input
            type="text"
            {...register('walletAddress', { required: '지갑 주소가 필요합니다.', minLength: { value: 40, message: '지갑 주소의 길이는 최소 40글자입니다.' } })}
            id="address"
            className="h-8 w-full rounded-md border border-gray-500"
            maxLength={42}
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <label htmlFor="privateKey" className="m-1 whitespace-nowrap bg-white">
            개인키
          </label>
          <input
            type="text"
            {...register('privateKey', { required: '개인키가 필요합니다.', minLength: { value: 40, message: '개인키의 길이는 최소 64글자입니다.' } })}
            id="privateKey"
            className="h-8 w-full rounded-md border border-gray-500"
            maxLength={66}
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <label htmlFor="contractAddress" className="m-1 whitespace-nowrap bg-white">
            컨트랙트 주소
          </label>
          <input
            type="text"
            {...register('contractAddress', { required: '컨트랙트 주소가 필요합니다.', minLength: { value: 40, message: '컨트랙트 주소의 길이는 최소 40글자입니다.' } })}
            id="contractAddress"
            className="h-8 w-full rounded-md border border-gray-500"
            maxLength={42}
          />
        </div>
        {message !== '' && <p className="w-full text-center font-bold text-red-500">{message}</p>}
        {res !== '' && <p className="w-full text-center font-bold text-blue-500">{res}</p>}
        <div className="flex w-full justify-center">
          <button type="submit" className="rounded-xl bg-green-400 px-10 py-1 hover:bg-green-500 disabled:bg-gray-300" disabled={isLoading}>
            {isLoading ? '배포중...' : '배포'}
          </button>
        </div>
      </form>
    </section>
  );
}
