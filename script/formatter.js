class Formatter {
    // Array of standard short suffixes for large numbers
    static suffixes = [
        "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
        "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg",
        "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg", "Tg",
        "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg", "Qd",
        "UQd", "DQd", "TQd", "QaQd", "QiQd", "SxQd", "SpQd", "OcQd", "NoQd", "QiG",
        "SxG", "SpG", "OcG", "NoG", "Cent"
    ];

    /**
     * Formats a raw number into a readable string with text suffixes or exponential notation.
     * @param {number} value - The numerical value to format.
     * @param {string} unit - Measurement unit suffix (e.g., "m" for meters).
     * @returns {string} Formatted number string.
     */
    static format(value, unit = "") {
        if (value === null || value === undefined || isNaN(value)) return `0 ${unit}`.trim();
        if (value < 0) return "-" + this.format(-value, unit);

        // Render small values under 1,000 without suffixes
        if (value < 1000) {
            return `${Math.floor(value)} ${unit}`.trim();
        }

        // Calculate suffix tier index based on log10 (groups of 3 orders of magnitude)
        const tier = Math.floor(Math.log10(value) / 3);

        if (tier < this.suffixes.length) {
            const suffix = this.suffixes[tier];
            const scale = Math.pow(10, tier * 3);
            const scaled = value / scale;

            // Display with 2 decimal places precision
            return `${scaled.toFixed(2)} ${suffix}${unit ? ' ' + unit : ''}`.trim();
        }

        // Fallback to scientific notation for numbers exceeding array bounds
        return `${value.toExponential(2)} ${unit}`.trim();
    }
}