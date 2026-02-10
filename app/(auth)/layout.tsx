import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#f3f3f3]">
      <div className="flex h-full">
        {/* Left side - Form content */}
        <div className="flex w-full flex-col justify-center overflow-y-auto px-16 py-12 lg:w-1/2">
          <div className="flex max-w-[421px] flex-col gap-16">
            {/* Logo and Title */}
            <div className="flex flex-col gap-4">
              <div className="relative h-12 w-[98px]">
                <Image
                  src="/ca02524960676ea485d89a4976f63978296ff29e.svg"
                  alt="Dolu Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
                Real Estate Management System PLUS
              </h1>
            </div>
            {/* Form content */}
            {children}
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
          <div className="absolute inset-4 overflow-hidden rounded-lg">
            <Image
              src="/01e24815920144bebf6ffd83a869ab10a58bfa29.png"
              alt="Auth background"
              fill
              className="object-cover"
              priority
            />
            <p className="absolute bottom-6 right-8 text-xs text-[#c8c8c8]">
              REMSPlus Powered by Nxtpro Systems ©️ 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
