import Link from 'next/link';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/16/solid';

// TODO: github logo 추가
export default function SocialLogin() {
  return (
    <>
      <div className="w-full h-px bg-neutral-500" />
      <div className="flex flex-col gap-3">
        <Link className="primary-btn flex h-10 items-center justify-center gap-3 text-white" href="/sms">
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          </span>
          <span>Continue with SMS</span>
        </Link>
        <Link className="primary-btn flex h-10 items-center justify-center gap-3 text-white" href="/github/start">
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          </span>
          <span>Continue with Github</span>
        </Link>
      </div>
    </>
  );
}
