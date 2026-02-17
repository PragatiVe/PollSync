import Image from "next/image";
import Link from "next/link";

export default function TopNav() {
  return (
    <div className="w-full flex items-center justify-between px-6 py-4">

      {/* LEFT — Logo + Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition pt-3 pl-6"
      >
        <Image
          src="/logo.png"
          alt="PollSync logo"
          width={150}
          height={40}
          priority
        />
      </Link>

      <div />
    </div>
  );
}
