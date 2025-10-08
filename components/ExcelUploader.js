"use client"

import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload } from 'lucide-react'

export default function ExcelUploader({ onDataLoaded }) {

    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                onDataLoaded(jsonData);
            } catch (error) {
                alert('Erreur lors de la lecture du fichier. Vérifiez que le format est correct.');
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="flex mt-2 flex-col items-center gap-4 p-8 bg-gray-100 rounded-lg border-dashed border border-gray-300">
            <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            />
            <Upload className="w-12 h-12 text-gray-500" />
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Importer un fichier Excel
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Le fichier doit contenir les colonnes : code, nom_et_prenoms, surnom, photo(url photo)
                </p>
            </div>
            <button onClick={handleButtonClick} className="cursor-pointer gap-2 flex items-center text-white bg-orange-500 rounded-md px-5 py-2">
                <Upload className="w-4 h-4" />
                Choisir un fichier
            </button>
        </div>
    )
}
