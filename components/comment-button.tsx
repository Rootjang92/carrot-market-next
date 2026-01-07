'use client';
import { useFormStatus } from 'react-dom';

export default function CommentButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} name="comment-btn" className="bg-orange-400">
      {pending ? '등록중' : '등록'}
    </button>
  );
}
