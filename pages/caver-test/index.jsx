import useMutation from '@lib/use-mutation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonA from '@pages/components/ButtonA';
import SwiperTest from '@pages/components/Swiper';
import ImageButtonA from '@pages/components/ImageButton';
import LOGO5 from '../images/logo5.png';

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
    <>
      <SwiperTest />
      <div className="my-3 mb-7 border"></div>
      <div className="mb-11 flex h-auto justify-evenly">
        <ImageButtonA img={LOGO5} />
        <ImageButtonA img={LOGO5} />
        <ImageButtonA img={LOGO5} />
      </div>
      <div className="flex h-auto justify-evenly">
        <ImageButtonA img={LOGO5} />
        <ImageButtonA img={LOGO5} />
        <ImageButtonA img={LOGO5} />
      </div>
    </>
  );
}
