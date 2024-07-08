import Link from 'next/link';

export default function NotFound() {
  return (
    <section>
      <div className="flex h-[100vh] w-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl">404: Not Found</h1>
        <Link href="/" className="rounded-xl border-2 border-gray-500 p-2 text-xl hover:bg-gray-200">
          Go Index Page
        </Link>
      </div>
    </section>
  );
}
