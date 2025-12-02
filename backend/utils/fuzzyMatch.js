/**
 * Calculate Levenshtein distance
 */
const levenshteinDistance = (str1, str2) => {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  const m = str1.length;
  const n = str2.length;
  
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          
          dp[i][j - 1],
          
          dp[i - 1][j - 1]
        );
      }
    }
  }

  return dp[m][n];
};

/**
 * Smart similarity score that handles partial matches
 * Checks if input is contained in target (substring match)
 */
const smartSimilarityScore = (input, target) => {
  const inputLower = input.toLowerCase().trim();
  
  const targetLower = target.toLowerCase().trim();
  
  // Exact match
  if (inputLower === targetLower) {
    return 100;
  }
  
  // Check if input is contained in target (partial match)
  if (targetLower.includes(inputLower)) {
    return 95; // High score for substring matches
  }
  
  // Check if any word in target matches input closely
  const targetWords = targetLower.split(/\s+/);
  const inputWords = inputLower.split(/\s+/);
  
  let bestWordScore = 0;
  
  for (const inputWord of inputWords) {
    for (const targetWord of targetWords) {
      // Skip very short words
      if (inputWord.length < 3 || targetWord.length < 3) continue;
      
      const distance = levenshteinDistance(inputWord, targetWord);
      const maxLength = Math.max(inputWord.length, targetWord.length);
      const wordScore = ((maxLength - distance) / maxLength) * 100;
      
      if (wordScore > bestWordScore) {
        bestWordScore = wordScore;
      }
    }
  }
  
  // If we found a good word match, return it
  if (bestWordScore > 0) {
    return Math.round(bestWordScore);
  }
  
  // Fallback: calculate overall similarity
  const distance = levenshteinDistance(inputLower, targetLower);
  const maxLength = Math.max(inputLower.length, targetLower.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.round(similarity);
};

/**
 * Fuzzy match locality with smart scoring
 */
const fuzzyMatchLocality = (input, localities, threshold = 70) => {
  if (!input || !localities || localities.length === 0) {
    return { 
      
      match: null, 
      score: 0, 
      alternatives: [] 
    };
  }

  const cleanInput = input.trim();
  
  console.log('Fuzzy matching:', cleanInput, 'against', localities.length, 'localities');

  // Calculate smart scores for all localities
  const scores = localities.map(locality => ({
    name: locality,
    score: smartSimilarityScore(cleanInput, locality)
  }));

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  console.log('Top 5 scores:', scores.slice(0, 5));

  // Filter by threshold
  const matches = scores.filter(s => s.score >= threshold);

  if (matches.length === 0) {
    // If no matches above threshold, return the best match anyway if it's > 50%
    if (scores[0].score >= 50) {
      console.log('No match above threshold, but returning best match:', scores[0]);
      return {
        match: scores[0].name,
        score: scores[0].score,
        alternatives: scores.slice(1, 4).map(m => ({
          name: m.name,
          score: m.score
        }))
      };
    }
    
    return { 
      match: null, 
      score: 0, 
      alternatives: scores.slice(0, 3).map(m => ({
        name: m.name,
        score: m.score
      }))
    };
  }

  // Return best match and alternatives
  return {
    match: matches[0].name,
    score: matches[0].score,
    alternatives: matches.slice(1, 4).map(m => ({
      name: m.name,
      score: m.score
    }))
  };
};

module.exports = {
  fuzzyMatchLocality,
  levenshteinDistance,
  smartSimilarityScore
};
