'use client';

import { useRef, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import FileConversion from './FileConversion';

const Cards = forwardRef(({ code, nom_et_prenoms, surnom, photo }, ref) => {
  const internalRef = useRef(null);
  const photoUrl = FileConversion(photo);

  const handleDownload = async () => {
    const cardElement = ref?.current || internalRef.current;
    if (!cardElement) return;

    try {
      const dataUrl = await toPng(cardElement, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const fileName = nom_et_prenoms
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');

      saveAs(dataUrl, `carte-${fileName}.png`);
    } catch (err) {
      console.error("Erreur lors de la génération de l'image:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={(el) => {
          internalRef.current = el;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className="relative w-[600px] h-[390px] overflow-hidden shadow-2xl"
        style={{
          backgroundImage: 'url(/carte.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* code */}
        <div className="absolute top-[115px] right-[80px]">
          <p className="text-sm font-bold italic text-white tracking-wider text-right">
            {code}
          </p>
        </div>

        {/* Nom et prénoms */}
        <div className="absolute left-12 top-[165px]">
          <h2 className="text-xl font-bold uppercase text-gray-800 text-left">
            {nom_et_prenoms}
          </h2>
        </div>

        {/* Surnom */}
        <div className="absolute left-12 top-[200px] flex text-left">
          <h2 className="text-xl uppercase text-gray-800">Dit&nbsp;</h2>
          <h2 className="text-xl font-bold uppercase text-gray-800">
            {surnom}
          </h2>
        </div>

        {/* Photo */}
        <div className="absolute top-[250px] right-[56px] -translate-y-1/2">
          <div className="w-40 h-47 overflow-hidden border-4 border-orange-500 shadow-xl bg-white">
            <img
              src={photoUrl}
              alt={nom_et_prenoms}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1750535135451-7c20e24b60c1?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="gap-2 cursor-pointer flex items-center text-white bg-orange-500 rounded-md px-5 py-2"
      >
        <Download className="w-4 h-4" />
        Télécharger
      </button>
    </div>
  );
});

Cards.displayName = 'Cards';

export default Cards;