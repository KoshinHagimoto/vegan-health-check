function calculateDailyNutrientGoals(weight, sex, height, age) {
    let protein, vitaminD, vitaminB12, iron, dha, epa, calcium, zinc;

    // たんぱく質: 一般的に成人の場合、体重1kgあたり1.2gを目安とする
    protein = weight * 1.2;

    // ビタミンD, ビタミンB12, 鉄分, DHA, EPA, カルシウム, 亜鉛 は年齢や性別により異なる
    // ここでは簡略化のため、成人男性・女性の平均的な値を基準とする
    vitaminD = 8.5;     // μg
    vitaminB12 = 2.4;  // μg

    if (sex === 'male') {
        calcium = 800;
        iron = 8;      // mg
        dha = 11;    // g
        epa = 2;    // g
        zinc = 11;         // mg
    } else {
        calcium = 650;
        iron = 11;     // mg
        dha = 8;   // g
        epa = 1.6;   // g
        zinc = 8;         // mg
    }

    return {
        protein,
        vitaminD,
        vitaminB12,
        iron,
        dha,
        epa,
        calcium,
        zinc
    };
}

module.exports = {
    calculateDailyNutrientGoals
};