# மாத்திரை analysis — model and scope

The Māttirai Explorer distinguishes two different quantities that are often
conflated:

| | meaning |
|---|---|
| **Nominal letter value** | the மாத்திரை of a grapheme *in isolation*, as taught for individual letters. |
| **Contextual மாத்திரை value** | the மாத்திரை the same grapheme actually carries *inside a word*, after context-sensitive rules apply. |

The earlier version of the tool reported only the nominal value and summed it,
which is incorrect for Tamil prosody. For example it scored **வீடு** as `2 + 1 = 3`,
treating the final **டு** as an ordinary குறில் உயிர்மெய். In context the final
**டு** is a **நெடிற்றொடர்க் குற்றியலுகரம்**, so its உகரம் shortens to ½, giving the
correct **2½**.

## Nominal values used

Grounded in Tolkāppiyam எழுத்து · நூல் மரபு and standard Tamil prosodic tradition:

| form | value |
|---|---:|
| குறில் உயிர் / உயிர்மெய் | 1 |
| நெடில் உயிர் / உயிர்மெய் (ஆ ஈ ஊ ஏ ஓ) | 2 |
| தனி மெய் / ஒற்று | ½ |
| ஆய்தம் | ½ |
| word-initial ஐ / ஔ | 2 |

## Contextual rules currently implemented

**குற்றியலுகரம் (word-final short u = ½).** A வல்லினம்+உ letter (கு சு டு து பு று)
that is the **final** letter of a multi-letter word shortens to ½ மாத்திரை. The
subtype is named from the immediately preceding element:

| preceding element | subtype | example |
|---|---|---|
| a நெடில் syllable | நெடிற்றொடர்க் குற்றியலுகரம் | வீடு, நாடு, சோறு |
| a வல்லின ஒற்று | வன்றொடர்க் குற்றியலுகரம் | காற்று |
| a மெல்லின ஒற்று | மென்றொடர்க் குற்றியலுகரம் | ஐந்து |
| an இடையின ஒற்று | இடைத்தொடர்க் குற்றியலுகரம் | (e.g. கார்பு-type) |
| a உயிர் / குறில் உயிர்மெய் | உயிர்த்தொடர்க் குற்றியலுகரம் | பசு |
| ஆய்தம் | ஆய்தத்தொடர்க் குற்றியலுகரம் | எஃகு |

A single isolated வல்லினம்+உ (e.g. **டு** on its own) is **not** a word, so no
word-final rule is applied — only its nominal value (1) is shown.

## Deliberately unsupported (returns "needs further analysis")

Where the tradition does not give a single deterministic value, the tool refuses
to output a definitive total and instead returns:

> இந்தச் சொல்லின் மாத்திரை அமைப்புக்கு மேலும் இலக்கணச் சூழல் ஆய்வு தேவை.

Currently this applies to:

- **Non-initial ஐ / ஔ** — ஐகாரக் / ஔகாரக் குறுக்கம், documented as **"1 or 1½"**
  மாத்திரை (value not fixed). This is why **மலை** returns *needs analysis* rather
  than a contested number.
- **குற்றியலிகரம்** (context-sensitive short i), **அளபெடை**, **மகரக் குறுக்கம்**,
  **ஆய்தக் குறுக்கம்** (¼), and other higher-order prosodic forms.

Per-letter nominal values are still shown for these words; only the *total* is withheld.

## Grammatical sources

- Tolkāppiyam, எழுத்ததிகாரம், நூல் மரபு (letter counts, அளபு/மாத்திரை, the six
  contexts of குற்றியலுகரம் in "ஈர் எழுத்து ஒருமொழி … வன்றொடர் மென்றொடர்").
- [தமிழ் விக்கிப்பீடியா: மாத்திரை](https://ta.wikipedia.org/wiki/மாத்திரை_(தமிழ்_இலக்கணம்))
- [தமிழ் விக்கிப்பீடியா: குறுக்கம்](https://ta.wikipedia.org/wiki/குறுக்கம்_(இலக்கணம்)) — for the "1 or 1½" ஐ/ஔ குறுக்கம் value.
- [தமிழ் விக்கிப்பீடியா: குற்றியலுகரம்](https://ta.wikipedia.org/wiki/குற்றியலுகரம்)

This module implements a *subset* of Tamil prosody. It is not a complete
யாப்பியல் engine and does not present unsupported calculations as definitive.
