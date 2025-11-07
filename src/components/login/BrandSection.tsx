export default function BrandSection() {
  return (
    <div className="hidden lg:flex items-center justify-center bg-[#2e1074] from-primary to-primary-light">
      <div className="text-center text-white">
        <img
          src="/brand.png"
          alt="Privideo 홍보 이미지"
          className="max-w-[80%] h-auto mx-auto"
        />
      </div>
    </div>
  );
}