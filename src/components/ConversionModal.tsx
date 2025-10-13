import {ROMAN_VALUES} from "../utils/romanUtils.ts";

interface ConversionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConversionModal({ isOpen, onClose }: ConversionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: "rgba(0, 0, 0, 0.6)" }}>
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Tableau de conversion</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        style={{ background: "none", border: "none", fontSize: "24px", padding: "0" }}
                    >
                        ×
                    </button>
                </div>
                <div className="space-y-2">
                    {Object.entries(ROMAN_VALUES).map(([roman, arabic]) => (
                        <div key={roman} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                            <span className="text-black font-bold text-lg">{roman}</span>
                            <span className="text-gray-600">{arabic}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
