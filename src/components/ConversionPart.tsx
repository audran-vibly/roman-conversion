import * as React from "react";
import {VALIDATION_RULES} from "../utils/romanUtils.ts";
import {Info, Search} from "lucide-react";

interface ConversionInputProperties {
    value: string;
    onChange: (value: string) => void;
    onConvert: () => void;
}

export default function ConversionPart({value, onChange, onConvert}: ConversionInputProperties) {

    // input modification gestion -> sanitize input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    // input keydown gestion -> convert on enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && value.trim()) {
            onConvert();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <input
                    id="roman-input"
                    className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono uppercase transition-all text-black"
                    type="text"
                    placeholder="Ex: X·L·V·MMM"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    maxLength={VALIDATION_RULES.maxLength}
                    autoComplete="off"
                    autoFocus
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Info size={12} /> Symboles valides : I, V, X, L, C, D, M
                </p>
            </div>
            <button
                className="bg-blue-500 text-white px-4 py-3 focus:outline-0 rounded-lg w-full transition-colors font-medium shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onConvert}
                disabled={!value.trim()}
            >
                <Search size={20}/>
                Convertir
            </button>
        </div>
    );
}

