import { executeQuery } from '@lib/postgres';
import useMutation from '@lib/use-mutation';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function MyPageSetting(props) {
  const u = useMemo(() => (props && props.result ? props.result[0] : {}), [props]);
  const { mutation: mu, data: r } = useMutation('/api/mypage/setting');
  const [m, s_m] = useState('');
  const { register, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      USER_ID: u.USER_ID,
      USER_NICKNAME: u.USER_NICKNAME,
      USER_WALLET: u.USER_WALLET,
      USER_EMAIL: u.USER_EMAIL,
    },
  });
  const e = watch('USER_EMAIL');

  useEffect(() => {
    if (r) {
      if (r.ok) {
        s_m(r.message);
      } else {
        s_m(r.message);
      }
    }
  }, [r]);

  async function onValid(form) {
    s_m('');
    mu(form);
  }

  async function onInValid(errors) {
    const [error] = Object.values(errors);
    if (error) {
      s_m(error.message);
      if (error.ref && error.ref.focus) {
        error.ref.focus();
      }
    }
  }

  if (!props || !props.result) {
    return <div>loading...</div>;
  }
  return (
    <div className="">
      <div>
        <h1 className="text-xl font-bold">회원정보 수정</h1>
      </div>
      <div>
        <form className="flex justify-center" onSubmit={handleSubmit(onValid, onInValid)}>
          <div>
            <p className="flex items-center gap-2 p-1">
              <span>이메일</span>
              <span className="rounded-md border border-black bg-gray-300 px-1 py-[2px]">{e}</span>
            </p>
            <div className="flex items-center gap-2 p-1">
              <label htmlFor="nickname">닉네임</label>
              <input id="nickname" className="rounded-md border border-black px-1 py-[2px]" type="text" {...register('USER_NICKNAME')} />
            </div>
            <div className="flex items-center gap-2 p-1">
              <label htmlFor="wallet">지갑주소</label>
              <input id="wallet" className="rounded-md border border-black px-1 py-[2px]" type="text" {...register('USER_WALLET')} />
            </div>
            {m !== '' && <p className="w-full text-center font-bold text-blue-500">{m}</p>}
            <div className="flex justify-end gap-4">
              <button className="rounded-lg bg-gray-100 px-2 py-1" type="button" onClick={() => reset()}>
                취소
              </button>
              <button className="rounded-lg bg-blue-200 px-2 py-1" type="submit">
                수정
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(req) {
  const { user_id } = req.query;
  const result = await executeQuery(`SELECT * FROM "USER" WHERE "USER_ID" = '${user_id}'`);
  return {
    props: {
      result,
    },
  };
}
