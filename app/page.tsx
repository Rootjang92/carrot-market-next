import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <section className="my-auto *:font-medium flex flex-col items-center">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl">당근</h1>
        <h2 className="text-2xl">당근 마켓에 어서오세요!</h2>
      </section>
      <section>
        <Link href="/create-account">시작하기</Link>
        <div>
          <span>이미 계정이 있나요?</span>
          <Link href="/login">로그인</Link>
        </div>
      </section>
    </main>
  );
}
