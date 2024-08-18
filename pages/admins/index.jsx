import InputDropZone from '@components/input-dropzone';
import { executeQuery } from '@lib/postgres';
import useMutation from '@lib/use-mutation';
import { fileToDataUrl } from '@lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AdminsPage(props) {
  const r = useMemo(() => (props && props.r ? props.r[0] : {}), [props]);
  const { mutation: mu, data } = useMutation('/api/admins/event');
  const [s, ss] = useState();
  const [pim, s_pim] = useState('');
  const [im, s_im] = useState();

  const { register: rg, getValues, handleSubmit: hs } = useForm();

  async function invl(form) {
    const f = form;
    f.i = props.r[0].ID;
    f.im = im;
    // mutation(form);
    if (props.r[0].ID && im !== '') {
      mu(f);
    }
  }

  async function oniv(errors) {
    const [error] = Object.values(errors);
    if (error) {
      if (error.ref && error.ref.focus) {
        error.ref.focus();
      }
    }
  }

  function onc(e) {
    const f = e.currentTarget.files?.item(0);
    if (!f) {
      return;
    }
    const fu = URL.createObjectURL(f);
    s_pim(fu);
    fileToDataUrl(f, (rr) => s_im(rr));
  }

  useEffect(() => {
    if (props.r[0].ID) {
      s_pim(`https://dsqosoeyathhjxgyduin.supabase.co/storage/v1/object/public/klaytnticketing-bucket/${props.r[0].ID}`);
    }
  }, [props, r]);

  return (
    <div>
      <form onSubmit={hs(invl, oniv)}>
        <InputDropZone s={pim} a="asd" c="aspect-square w-[30%]" o={onc} />
        <button type="submit">DD</button>
      </form>
    </div>
  );
}

export async function getServerSideProps() {
  const r = await executeQuery('SELECT * FROM "EVENT"');
  return {
    props: {
      r: JSON.parse(JSON.stringify(r)),
    },
  };
}
