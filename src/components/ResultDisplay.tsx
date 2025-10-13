import type { ConversionResult } from "../utils/romanUtils.ts";
import {AlertCircle, CircleCheckBig} from "lucide-react";

interface ResultDisplayProperties {
    result: ConversionResult | null
}

export default function ResultDisplay({ result }: ResultDisplayProperties) {
    if (!result) return null;

    if (result.error) {
        return (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium">Une erreur est survenue</p>
                    <p className="text-sm mt-1">{result.error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
                <CircleCheckBig size={20} className="text-green-600"/>
                <p className="font-medium">Votre résultat</p>
            </div>
            <div className="text-center mt-3">
                <p className="text-3xl font-bold text-green-900">{result.value}</p>
            </div>
        </div>
    );
}