import { ROMAN_VALUES, VINCULUM_MULTIPLIERS } from "../utils/romanUtils.ts";
import { useState } from "react";

export default function ConversionModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <footer className="mt-8 text-center text-white text-sm">
                <a
                    onClick={() => setIsModalOpen(true)}
                    style={{ color: "white", textDecoration: "underline", cursor: "pointer" }}
                >
                    Voir le tableau de conversion
                </a>
            </footer>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: "rgba(0, 0, 0, 0.6)" }}>
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Tableau de conversion</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                                style={{ background: "none", border: "none", fontSize: "24px", padding: "0" }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-2">
                            {/* Map through the Roman values and display them */}
                            {Object.entries(ROMAN_VALUES).map(([roman, arabic]) => (
                                <div key={roman} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <span className="text-black font-bold text-lg">{roman}</span>
                                    <span className="text-gray-600">{arabic.toLocaleString()}</span>
                                </div>
                            ))}

                            <div className="pt-2 mt-3">
                                <p className="text-sm text-gray-500 mb-2 font-medium">Multiplicateurs :</p>
                            </div>

                            {/* Map through the Vinculum multipliers and display them */}
                            {Object.entries(VINCULUM_MULTIPLIERS).map(([symbol, multiplier]) => (
                                <div key={symbol} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                    <span className="text-black font-bold text-lg">{symbol}</span>
                                    <span className="text-gray-600">×{multiplier.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}