import Image from 'next/image';

export default function Imagebox({ src, alt, caption }) {
  return (
    <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full text-center">
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      {caption && (
        <p className="mt-4 text-sm sm:text-lg text-gray-300 leading-relaxed">
          {caption}
        </p>
      )}
    </div>
  );
}