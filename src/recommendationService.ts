//@ts-nocheck
import { Restaurant } from "./types/Restaurants";

export async function recommendRestaurant(
  restaurants: Restaurant[],
  mood: string
): Promise<Restaurant | null> {
  return new Promise<Restaurant | null>(async (resolve, reject) => {
    const moodScore = await vibeCheck(mood);
    let bestMatch: Restaurant | null = null;
    let bestScoreDifference = Infinity;

    for (const restaurant of restaurants) {
      const cuisine = restaurant.tags.cuisine || "";
      const cuisineScore = await vibeCheck(cuisine);
      const scoreDifference = Math.abs(moodScore - cuisineScore);

      if (scoreDifference < bestScoreDifference) {
        bestScoreDifference = scoreDifference;
        bestMatch = restaurant;
      }
    }

    console.log("BEST MATCH", bestMatch);

    resolve(bestMatch);
  });
}

let cachedMetadata = null;
let cachedModel = null;

async function loadModel() {
  const model =
    cachedModel ??
    (await tf.loadLayersModel(
      "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json"
    ));
  if (model && !cachedModel) cachedModel = model;
  return model;
}

// Sequenzen auf eine einheitliche Länge auffüllen oder abschneiden
function padSequences(sequences, maxLen) {
  return sequences.map((seq) => {
    if (seq.length > maxLen) {
      return seq.slice(seq.length - maxLen);
    } else if (seq.length < maxLen) {
      const pad = new Array(maxLen - seq.length).fill(0);
      return pad.concat(seq);
    } else {
      return seq;
    }
  });
}

async function vibeCheck(inputText) {
  const model = await loadModel();

  // Metadaten laden
  const metadata =
    cachedMetadata ??
    (await fetch(
      "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json"
    ).then((res) => res.json()));

  if (metadata && !cachedMetadata) cachedMetadata = metadata;

  const { paddedSequence, maxLen } = padSequence(metadata, inputText);

  const input = tf.tensor2d(paddedSequence, [1, maxLen]);

  // Vorhersage durchführen
  const prediction = model.predict(input);
  const score = prediction.dataSync()[0];

  // Speicher freigeben
  prediction.dispose();
  input.dispose();

  return score;
}
function padSequence(metadata: any, inputText: any) {
  const wordIndex = metadata["word_index"];
  const indexFrom = metadata["index_from"];
  const maxLen = metadata["max_len"]; // Korrigiert: Verwenden von max_len aus Metadaten
  const vocabularySize = metadata["vocabulary_size"];
  const OOV_INDEX = 2; // Index für "Out of Vocabulary" Wörter


  // Text in numerische Sequenz konvertieren
  function textToSequence(text) {
    const words = text
      .trim()
      .toLowerCase()
      .replace(/(\.|\,|\!|\?)/g, "")
      .split(" ");
    const sequence = words.map((word) => {
      let index = wordIndex[word];
      if (index !== undefined) {
        index += indexFrom;
        if (index > vocabularySize) {
          index = OOV_INDEX;
        }
      } else {
        index = OOV_INDEX;
      }
      return index;
    });
    return sequence;
  }

  const sequence = textToSequence(inputText);
  const paddedSequence = padSequences([sequence], maxLen);
  return { paddedSequence, maxLen };
}

