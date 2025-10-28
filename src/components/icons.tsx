import type { SVGProps } from 'react';

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M21.35 11.1h-9.2v2.7h5.3c-.2 1.5-1.2 2.8-2.8 3.6v2.3h3c1.7-1.6 2.7-4 2.7-6.6 0-.6-.1-1.2-.2-1.8z"
      ></path>
      <path
        fill="#34A853"
        d="M12.15 22c2.4 0 4.5-.8 6-2.2l-3-2.3c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.8H3.95v2.4C5.45 19.8 8.55 22 12.15 22z"
      ></path>
      <path
        fill="#FBBC05"
        d="M7.15 14.7c-.2-.6-.2-1.2-.2-1.8s0-1.2.2-1.8V8.8H3.95c-.7 1.4-1.1 3-1.1 4.7s.4 3.3 1.1 4.7l3.2-2.5z"
      ></path>
      <path
        fill="#EA4335"
        d="M12.15 7.3c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.65 4.6 14.55 3.5 12.15 3.5c-3.6 0-6.7 2.2-8.2 5.3l3.2 2.5c.7-2.2 2.7-3.8 5-3.8z"
      ></path>
    </svg>
  );
}
