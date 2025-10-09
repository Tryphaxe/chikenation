'use client';

import { useState, useRef } from 'react';
import ExcelUploader from '@/components/ExcelUploader';
import Cards from '@/components/Cards'; // Le nouveau composant modifié avec surnom
import { Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/context/ProtectedRoute';

const Index = () => {
    const [cardsData, setCardsData] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRefs = useRef([]);

    const handleDataLoaded = (data) => {
        setCardsData(data);
        cardRefs.current = [];
    };

    const handleDownloadAll = async () => {
        if (cardRefs.current.length === 0 || cardRefs.current.some(ref => !ref)) {
            toast("Les cartes ne sont pas encore prête. Veuillez patienter SVP !!!", { icon: '✋' })
            return;
        }
        const toastId = toast.loading("Téléchargement en cours...");

        setIsDownloading(true);
        const zip = new JSZip();

        try {
            for (let i = 0; i < cardRefs.current.length; i++) {
                const cardRef = cardRefs.current[i];
                if (!cardRef) continue;

                const dataUrl = await toPng(cardRef, { cacheBust: true, pixelRatio: 2 });
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const cleanName = cardsData[i].nom_et_prenoms
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/ç/g, 'c')
                    .replace(/[^a-zA-Z0-9_\- ]/g, '')
                    .replace(/\s+/g, '_')
                    .toLowerCase();

                const fileName = `carte-de-la-nation-${cleanName}.png`;
                zip.file(fileName, blob);
            }

            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, `cartes-de-la-nation-${formattedDate}.zip`);

            toast.success(`${cardsData.length} carte(s) téléchargée(s) avec succès.`, { id: toastId });
        } catch (error) {
            toast.error("Une erreur est survenue lors du téléchargement des cartes.", { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <header className="">
                    <div className="container mx-auto px-4 py-6 border-b border-gray-300">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Générateur de Cartes
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Importez un fichier Excel pour générer des cartes personnalisées
                        </p>
                    </div>
                </header>

                {/* <img
              src="https://lh3.googleusercontent.com/d/13aOMIRiY4X0SNJnKhna7rtwrX9qWQ0_O"
              alt="{nom_et_prenoms}"
              className="w-24 h-24 object-cover"
              // onError={(e) => {
              //   e.currentTarget.onerror = null;
              //   e.currentTarget.src = 'https://images.unsplash.com/photo-1750535135451-7c20e24b60c1?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
              // }}
            /> */}

                <main className="container mx-auto px-4 py-12">
                    {cardsData.length === 0 ? (
                        <div className="max-w-2xl mx-auto">
                            <ExcelUploader onDataLoaded={handleDataLoaded} />

                            <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-dashed border-orange-200">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Instructions
                                </h2>
                                <ul className="space-y-2 text-gray-600">
                                    <li>1. Le fichier Excel doit contenir : <code className="bg-gray-100 px-2 py-1 rounded text-sm">code</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">nom_et_prenoms</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">surnom</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">photo(url photo)</code></li>
                                    <li>2. Cliquez pour importer, puis téléchargez les cartes</li>
                                    <li>3. Vous pouvez télécharger tous les fichiers ou télécharger les cartes individuellement...</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Cartes générées
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {cardsData.length} carte{cardsData.length > 1 ? 's' : ''} générée{cardsData.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDownloadAll}
                                        disabled={isDownloading}
                                        className="cursor-pointer gap-2 flex items-center text-white bg-orange-500 rounded-md px-5 py-2"
                                    >
                                        {isDownloading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Téléchargement...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                Télécharger toutes les cartes
                                            </>
                                        )}
                                    </button>
                                    <button onClick={() => setCardsData([])} className="cursor-pointer gap-2 flex items-center text-white bg-orange-500 rounded-md px-5 py-2">
                                        Nouveau fichier
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-12">
                                {cardsData.map((card, index) => (
                                    <Cards
                                        key={index}
                                        ref={(el) => (cardRefs.current[index] = el)}
                                        code={card.code}
                                        nom_et_prenoms={card.nom_et_prenoms}
                                        surnom={card.surnom}
                                        photo={card.photo}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default Index;
