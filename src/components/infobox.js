export default function Infobox({ title, content }) {
    return (
      <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-semibold text-blue-300">{title}</h2>
        {content.map((paragraph, index) => (
          <p key={index} className="mt-4 text-base sm:text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }
  