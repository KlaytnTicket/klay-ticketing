import AdminDialog from '@components/admin-dialog';
import InputDropZone from '@components/input-dropzone';
import useMutation from '@lib/use-mutation';
import { dateToString2, fileToDataUrl, localeDateToKR } from '@lib/utils';
import NoImage from '@public/no-image.png';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

export default function AdminsEventPage(props) {
  const { data: d, mutate: mt } = useSWR(props.a, { refreshInterval: 0 });
  const evs = useMemo(() => (d && d.r ? d.r : []), [d]);
  const { mutation: mu, data: res, isLoading: il, clear: c } = useMutation(props.a);
  const [pl, spl] = useState(false);
  const [pim, spim] = useState('');
  const [im, sim] = useState('');
  const [t, st] = useState(false);
  const [it, sit] = useState(false);
  const [to, sto] = useState({});
  const [toa, stoa] = useState(false);
  const [met, smet] = useState('post');
  const { register: rg, handleSubmit: hs, setValue: sv, getValues: gv, reset: r } = useForm();
  function ts(m, o) {
    sto({ m, o });
    stoa(false);
    setTimeout(() => stoa(true), 10);
  }
  async function invl(form) {
    const f = form;
    f.im = im;
    if (met === 'post') {
      if (!im || im === '') {
        ts('티켓(NFT) 이미지가 필요합니다.', false);
        return;
      }
      await mu(f);
      mt();
    }
    if (met === 'put') {
      const i = gv('i');
      if (i && typeof i === 'number') {
        await mu(f, props.a, 'PUT');
        mt();
      }
    }
  }
  async function oniv(errors) {
    const [error] = Object.values(errors);
    if (error) {
      if (error.ref && error.ref.focus) {
        error.ref.focus();
        ts(error.message, false);
      }
    }
  }
  function onci(e) {
    const f = e.currentTarget.files?.item(0);
    if (!f) {
      return;
    }
    if (f.size > 4194304) {
      ts('파일 크기는 최대 4MB를 넘을 수 없습니다.', false);
      return;
    }
    const fu = URL.createObjectURL(f);
    spim(fu);
    fileToDataUrl(f, (i) => sim(i));
  }
  async function onco(e, i) {
    await mu({ i, o: e.target.checked }, props.a, 'PATCH');
    mt();
  }
  useEffect(() => {
    spl(true);
  }, []);
  useEffect(() => {
    if (!t) {
      r();
      sim('');
      spim('');
    }
  }, [r, t]);
  useEffect(() => {
    if (res) {
      if (res.message) {
        ts(res.message, res.o);
      }
      if (res.o === true) {
        st(false);
      }
      c();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c, res]);
  function hiv() {
    sit(!it);
    spim('');
  }
  function hbtn_t() {
    st(!t);
    r();
    sim('');
    spim('');
    smet('post');
  }
  function hubtn_t(i) {
    const e_st = localeDateToKR(new Date(evs[Number(i)].EVENT_START)).toISOString();
    const e_en = localeDateToKR(new Date(evs[Number(i)].EVENT_END)).toISOString();
    const t_st = localeDateToKR(new Date(evs[Number(i)].TICKETING_START)).toISOString();
    const t_en = localeDateToKR(new Date(evs[Number(i)].TICKETING_END)).toISOString();
    st(true);
    sv('i', evs[Number(i)].ID);
    sv('nn', evs[Number(i)].NFT_NAME);
    sv('ns', evs[Number(i)].NFT_SYMBOL);
    sv('nd', evs[Number(i)].NFT_DESCRIPTION);
    sv('n', evs[Number(i)].NAME);
    sv('s', evs[Number(i)].SITE);
    sv('t', evs[Number(i)].TAG);
    sv('e_st', e_st.substring(0, e_st.length - 5));
    sv('e_en', e_en.substring(0, e_en.length - 5));
    sv('t_st', t_st.substring(0, t_st.length - 5));
    sv('t_en', t_en.substring(0, t_en.length - 5));
    sv('t_li', evs[Number(i)].TICKETING_LIMIT);
    spim(evs[Number(i)].TICKET_IMAGE);
    smet('put');
  }
  async function hdbtn_t() {
    if (window.confirm('해당 이벤트를 삭제하시겠습니까?')) {
      const fd = gv('fd');
      await mu({ i: gv('i'), fd }, props.a, 'DELETE');
      mt();
    }
  }
  if (!d || !pl) {
    return (
      <div className="flex h-[45vh] w-full items-center justify-center">
        <div className="h-20 w-20">
          <div className="aspect-square h-full w-full animate-spin rounded-full border-[5px] border-transparent border-r-sky-300 border-t-sky-300" />
        </div>
      </div>
    );
  }
  return (
    <div className="m-auto max-w-[85%] overflow-auto">
      <table className="my-4 w-full">
        <thead className="whitespace-nowrap">
          <tr className="h-16 bg-slate-200">
            <th className="p-2">No.</th>
            <th className="p-2 underline">이벤트 이름</th>
            <th className="p-2">NFT 정보</th>
            <th className="p-2">이벤트 장소</th>
            <th className="p-2">이벤트 종류</th>
            <th className="p-2">이벤트 시작</th>
            <th className="p-2">이벤트 종료</th>
            <th className="p-2">티켓팅 시작</th>
            <th className="p-2">티켓팅 종료</th>
            <th className="p-2">티켓 이미지</th>
            <th className="p-2">티켓 발행량</th>
            <th className="p-2">컨트랙트 주소</th>
            <th className="p-2">티켓팅 ON/OFF</th>
          </tr>
        </thead>
        <tbody>
          {evs.length > 0 ? (
            evs.map((ev, idx) => (
              <tr key={idx} className="border-b border-gray-300 text-center hover:bg-emerald-50">
                <td className="p-2">{idx + 1}</td>
                <td className="cursor-pointer p-2 hover:underline" onClick={() => hubtn_t(idx)}>
                  {ev.NAME}
                </td>
                <td>
                  <div title={ev.NFT_DESCRIPTION}>
                    <p>{ev.NFT_NAME}</p>
                    <p className="text-sm text-gray-500">[{ev.NFT_SYMBOL}]</p>
                  </div>
                </td>
                <td className="p-2">{ev.SITE}</td>
                <td className="p-2">{ev.TAG}</td>
                <td className="whitespace-nowrap p-2">
                  <p>{dateToString2(ev.EVENT_START).split(',')[0]}</p>
                  <p>{dateToString2(ev.EVENT_START).split(',')[1]}</p>
                </td>
                <td className="whitespace-nowrap p-2">
                  <p>{dateToString2(ev.EVENT_END).split(',')[0]}</p>
                  <p>{dateToString2(ev.EVENT_END).split(',')[1]}</p>
                </td>
                <td className="whitespace-nowrap p-2">
                  <p>{dateToString2(ev.TICKETING_START).split(',')[0]}</p>
                  <p>{dateToString2(ev.TICKETING_START).split(',')[1]}</p>
                </td>
                <td className="whitespace-nowrap p-2">
                  <p>{dateToString2(ev.TICKETING_END).split(',')[0]}</p>
                  <p>{dateToString2(ev.TICKETING_END).split(',')[1]}</p>
                </td>
                <td className="p-2">
                  <button
                    className="flex aspect-square w-32 items-center justify-center"
                    onClick={() => {
                      sit(true);
                      spim(ev.TICKET_IMAGE);
                    }}
                  >
                    <Image src={ev.TICKET_IMAGE || NoImage} alt="티켓이미지" width={50} height={50} className="h-auto w-auto" />
                  </button>
                </td>
                <td>
                  {ev.HAS_TICKET} / {ev.TICKETING_LIMIT}
                </td>
                <td>
                  <div className="flex justify-center">
                    <p className="w-40 overflow-hidden text-ellipsis" title={ev.CONTRACT_ADDRESS}>
                      {ev.CONTRACT_ADDRESS}
                    </p>
                  </div>
                  <button
                    className="rounded-lg border border-gray-300 p-1 text-xs duration-200 hover:border-gray-400"
                    onClick={() => {
                      if (ev.CONTRACT_ADDRESS) {
                        navigator.clipboard.writeText(ev.CONTRACT_ADDRESS);
                        ts('클립보드에 복사되었습니다.', true);
                      }
                    }}
                  >
                    복사하기
                  </button>
                </td>
                <td>
                  {ev.TICKETING_IS_OPEN}
                  <input type="checkbox" className="aspect-square w-10" checked={ev.TICKETING_IS_OPEN} onChange={(e) => onco(e, ev.ID)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={13} className="h-24 text-center">
                등록된 이벤트가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="rounded-lg bg-slate-300 px-3 py-2 duration-200 active:scale-[.97]" onClick={hbtn_t}>
        새 이벤트 등록
      </button>
      <AdminDialog t={t} bg_t={hbtn_t}>
        <h1 className="mb-4 text-xl font-bold">이벤트 {met === 'post' ? '등록' : '수정'}</h1>
        <form className="flex w-[27rem] flex-col gap-2 whitespace-nowrap" onSubmit={hs(invl, oniv)}>
          <div className="flex justify-between">
            <label htmlFor="nn" title="❗한 번 설정하면 바꿀 수 없습니다.">
              NFT 이름(코인/토큰명)
            </label>
            <input
              type="text"
              id="nn"
              className="w-56 rounded-md border border-gray-400 p-[0.1rem] disabled:bg-gray-200"
              placeholder="토큰명 (예: Kaia(KLAY))"
              title={met === 'post' ? '❗한 번 설정하면 바꿀 수 없습니다.' : '읽기 전용입니다.'}
              {...rg('nn', { required: 'NFT 이름을 입력해주세요.' })}
              disabled={met === 'put'}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="ns" title="❗한 번 설정하면 바꿀 수 없습니다.">
              NFT 심볼
            </label>
            <input
              type="text"
              id="ns"
              className="w-56 rounded-md border border-gray-400 p-[0.1rem] disabled:bg-gray-200"
              placeholder="심볼 (예: KLAY)"
              title={met === 'post' ? '❗한 번 설정하면 바꿀 수 없습니다.' : '읽기 전용입니다.'}
              {...rg('ns', { required: '이벤트 심볼을 입력해주세요.', maxLength: { value: 10, message: 'NFT 심볼은 최대 10글자입니다.' } })}
              disabled={met === 'put'}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="nd">NFT 설명</label>
            <input type="text" id="nd" className="w-72 rounded-md border border-gray-400 p-[0.1rem]" {...rg('nd', { required: 'NFT 설명을 입력해주세요.' })} />
          </div>
          <hr />
          <div className="flex justify-between">
            <label htmlFor="n">이벤트 이름</label>
            <input type="text" id="n" className="w-72 rounded-md border border-gray-400 p-[0.1rem]" {...rg('n', { required: '이벤트 이름을 입력해주세요.' })} />
          </div>
          <div className="flex justify-between">
            <label htmlFor="s">이벤트 장소</label>
            <input type="text" id="s" className="w-72 rounded-md border border-gray-400 p-[0.1rem]" {...rg('s', { required: '이벤트 장소을 입력해주세요.' })} />
          </div>
          <div className="flex justify-between">
            <label htmlFor="t">이벤트 종류</label>
            <input type="text" id="t" className="w-72 rounded-md border border-gray-400 p-[0.1rem]" {...rg('t', { required: '이벤트 종류을 입력해주세요.' })} />
          </div>
          <div className="flex justify-between">
            <label htmlFor="e_st">이벤트(공연) 시작</label>
            <input
              type="datetime-local"
              id="e_st"
              className="w-56 rounded-md border border-gray-400 p-[0.1rem]"
              {...rg('e_st', { required: '이벤트(공연) 시작 날짜를 지정해주세요.' })}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="e_en">이벤트(공연) 종료</label>
            <input
              type="datetime-local"
              id="e_en"
              className="w-56 rounded-md border border-gray-400 p-[0.1rem]"
              {...rg('e_en', { required: '이벤트(공연) 종료 날짜를 지정해주세요.' })}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="t_st">티켓팅 시작</label>
            <input
              type="datetime-local"
              id="t_st"
              className="w-56 rounded-md border border-gray-400 p-[0.1rem]"
              {...rg('t_st', { required: '티켓팅 시작 날짜를 지정해주세요.' })}
            />
          </div>
          <div className="flex justify-between">
            <label htmlFor="t_en">티켓팅 종료</label>
            <input
              type="datetime-local"
              id="t_en"
              className="w-56 rounded-md border border-gray-400 p-[0.1rem]"
              {...rg('t_en', { required: '티켓팅 종료 날짜를 지정해주세요.' })}
            />
          </div>
          <div className="my-2 flex items-center justify-between">
            <p>티켓(NFT) 이미지</p>
            <InputDropZone s={pim} a="ticket-image" className="aspect-square w-[12rem]" o={onci} />
          </div>
          <div className="flex justify-between">
            <label htmlFor="t_li">티켓 최대 발행량 제한</label>
            <div>
              <input type="number" id="t_li" className="w-24 rounded-md border border-gray-400 p-[0.1rem]" {...rg('t_li', { required: '티켓 발행량을 입력해주세요.' })} />
              <span className="ml-2">장</span>
            </div>
          </div>
          <div className={clsx('mt-4 flex', met === 'post' ? 'justify-end' : 'justify-between')}>
            {met === 'put' && (
              <div className="flex gap-1">
                <button type="button" className="rounded-lg bg-red-500 px-3 py-2 text-white duration-200 active:scale-[.97]" onClick={hdbtn_t}>
                  이벤트 삭제
                </button>
                <div className="flex items-center">
                  <input id="fd" type="checkbox" {...rg('fd')} defaultChecked={false} />
                  <label htmlFor="fd" className="text-xs" title="❗해당 이벤트에서 발행된 모든 티켓이 무효 처리됩니다.(※주의※)">
                    이벤트 강제 삭제
                  </label>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button type="button" className="rounded-lg border border-black px-3 py-2 duration-200 active:scale-[.97]" onClick={hbtn_t}>
                취소
              </button>
              <button
                type="submit"
                className={clsx(
                  'flex gap-2 rounded-lg bg-green-300 px-3 py-2 duration-200 active:scale-[.97]',
                  'disabled:bg-gray-300 disabled:text-white disabled:active:scale-100',
                )}
                disabled={il}
              >
                <p>이벤트 {met === 'post' ? '등록' : '수정'}</p>
                {il && <p className="aspect-square h-full w-full animate-spin rounded-full border-[3px] border-transparent border-r-sky-300 border-t-sky-300" />}
              </button>
            </div>
          </div>
        </form>
      </AdminDialog>
      <AdminDialog t={it} bg_t={hiv} className="min-w-[15%]">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-lg font-bold">티켓 이미지</p>
          <button className="text-2xl" onClick={hiv}>
            ✕
          </button>
        </div>
        <div className="flex justify-center overflow-y-auto">
          <div className="max-h-[40rem]">
            {pim !== '' ? (
              <a href={pim} target="_blank">
                <Image src={pim || NoImage} alt="티켓이미지" width={400} height={400} className="h-auto w-auto" />
              </a>
            ) : (
              <Image src={NoImage} alt="티켓이미지" width={400} height={400} className="h-auto w-auto" />
            )}
            {!pim && <p>이미지 없음</p>}
          </div>
        </div>
      </AdminDialog>
      <div
        className={clsx(
          'fixed bottom-0 right-0 z-[9999] flex h-28 w-72 items-center justify-center border-[4px] bg-white px-3 opacity-0',
          to.o ? 'border-t-fuchsia-500' : 'border-t-red-500',
          toa && 'animate-toast-message-bottom-right',
        )}
      >
        <p className="line-clamp-3 text-sm">{to.m}</p>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      a: '/api/admins/event',
    },
  };
}
