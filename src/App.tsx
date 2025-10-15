import { useState } from "react";
import {type ConversionResult, convertArabicToRoman, convertRomanToArabic} from "./utils/romanUtils";
import ConversionPart from "./components/ConversionPart.tsx";
import ResultDisplay from "./components/ResultDisplay.tsx";
import ConversionModal from "./components/ConversionModal.tsx";

export default function App() {
    const [romanInput, setRomanInput] = useState("");
    const [result, setResult] = useState<ConversionResult | null>(null);

    const handleConvert = () => {
        if (!romanInput.trim()) return;

        let conversionResult;

        if (/\d/.test(romanInput)) {
            conversionResult = convertArabicToRoman(romanInput);
        } else {
            conversionResult = convertRomanToArabic(romanInput);
        }

        setResult(conversionResult);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br" style={{ background: "linear-gradient(to bottom right, #a73737, #7a2828)" }}>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Convertisseur Romain
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Transformez les chiffres romains en chiffres arabes !
                    </p>
                </div>

                <ConversionPart
                    value={romanInput}
                    onChange={setRomanInput}
                    onConvert={handleConvert}
                />

                <ResultDisplay result={result} />
            </div>

            <ConversionModal />
        </div>
    );
}
