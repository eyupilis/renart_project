export function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-amber-50/30 to-neutral-100">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <img
            src="https://cdn.prod.website-files.com/68234acd8fb1ab421a72b174/6835bd10469b1259f48af473_Renart_Logo_White.svg"
            alt="Renart Logo"
            className="h-16 md:h-20 lg:h-24 w-auto object-contain mx-auto mb-4"
            style={{ filter: 'brightness(0) saturate(100%) invert(25%) sepia(68%) saturate(1456%) hue-rotate(18deg) brightness(91%) contrast(95%)' }}
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-serif text-neutral-900 mb-6 tracking-tight">
          Timeless Elegance,
          <br />
          <span className="text-renart-brown">Crafted Forever</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover our exquisite collection of handcrafted engagement rings, where every piece
          tells a unique story of love and commitment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#products"
            className="px-8 py-4 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-800 transition-colors"
          >
            EXPLORE COLLECTION
          </a>
          <a
            href="#bespoke"
            className="px-8 py-4 border-2 border-neutral-900 text-neutral-900 text-sm tracking-wide hover:bg-neutral-900 hover:text-white transition-colors"
          >
            CREATE BESPOKE
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
