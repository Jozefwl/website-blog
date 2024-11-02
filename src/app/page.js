import Image from 'next/image';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
<Image
  src="/images/title.png"
  alt="Placeholder Image"
  width={300}
  height={200}
  style={{ display: 'block', margin: '0 auto'}}
/>
<h1 className="typewriter">Welcome to waldhauser.sk</h1>

      <p style={{ maxWidth: '600px', margin: '20px auto' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </p>



      <p style={{ maxWidth: '600px', margin: '20px auto' }}>
       placeholdeeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeeeeer text
      </p>
    </div>
  );
}
