import clsx from 'clsx';

export default function AdminDialog({ t, bg_t, className, children }) {
  return (
    <dialog open={t} className="fixed left-0 top-0 z-[9999] h-full w-full bg-transparent backdrop-blur-[3px]">
      <div className="flex h-full w-full items-center justify-center">
        <div className="absolute z-0 h-full w-full bg-black/70 opacity-50" onClick={bg_t} />
        <div className={clsx('z-10 h-fit max-h-[80%] w-fit max-w-[90%] overflow-hidden rounded-xl bg-white p-[2%]', className)}>{children}</div>
      </div>
    </dialog>
  );
}
