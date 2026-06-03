# ARAYA — AI Media Production Brief

**Art direction (all assets):** quiet luxury tropical hospitality, coastal sanctuary, spiritual calm, warm ocean air, white sand, turquoise water, Boracay-inspired, luxury villa rental life, private residence stewardship, Aman meets Six Senses, warm ivory, limestone, teak, soft linen, golden hour, editorial luxury photography, cinematic tropical sanctuary.

**Avoid:** cheap tropical tourism, generic Airbnb photography, overexposed stock, crowded beaches, cartoonish visuals, fake-looking villas, corporate hotel energy, tech startup aesthetic.

**Drop files at paths in** `app/lib/araya-media.ts`.

---

## 1. Hero Image

**File:** `/public/images/hero/araya-hero.jpg`

### Midjourney
```
Cinematic editorial photograph of a private luxury villa in Boracay at golden hour, infinity pool merging with turquoise shallows, warm ivory limestone architecture, teak terraces, soft linen, palm shadows, quiet luxury, Aman resort aesthetic, Six Senses calm, no people, no crowds, spiritual stillness, warm ocean air, 35mm film grain subtle, --ar 16:9 --style raw --v 6
```

### Leonardo AI
```
Ultra-premium Boracay villa hero, golden hour, infinity pool, turquoise water, ivory stone and teak, editorial luxury travel photography, sanctuary calm, warm sand tones, cinematic depth, photorealistic, no tourists, no text, 8k, soft haze
```

### Runway / Luma (still frame reference)
```
Static hero frame: slow aerial drift toward private villa terrace at sunset, Boracay turquoise lagoon, luxury tropical sanctuary, warm ivory and teal palette, editorial film still, no crowds
```

---

## 2. Hero Video

**File:** `/public/videos/araya-hero.mp4`  
**Poster:** `/public/images/hero/araya-hero.jpg`

### Midjourney (keyframe references)
```
Sequential keyframes: dawn mist lifting over Boracay villa pool, golden hour light on limestone, gentle palm movement, turquoise water reflection, luxury sanctuary, cinematic --ar 21:9
```

### Leonardo AI (image-to-video source frames)
```
Generate 3 consistent frames: wide aerial villa approach, medium pool terrace glide, close teak detail with ocean bokeh — same villa, golden hour, ivory and teal grade
```

### Runway / Luma
```
Slow cinematic aerial push-in over private Boracay luxury villa at golden hour, infinity pool, turquoise shallows, warm ivory architecture, palm fronds soft in breeze, no crowds, no logos, 24fps film look, gentle parallax, 8–12 second loop, mood: Aman meets Six Senses sanctuary
```

---

## 3. Interior Sanctuary

**File:** `/public/images/interiors/residence-care.jpg`

### Midjourney
```
Editorial interior, luxury tropical villa living room, warm ivory walls, limestone floor, teak furniture, soft white linen, morning light through sheer curtains, Boracay sanctuary, quiet luxury, no clutter, hotel residence care aesthetic --ar 4:5 --style raw
```

### Leonardo AI
```
Private villa interior sanctuary, ivory and sand palette, limestone, teak, linen textiles, soft directional light, Aman-style minimal luxury, Boracay tropical calm, photorealistic editorial, empty room, serene
```

### Runway / Luma
```
Slow interior dolly: linen sofa, limestone wall, teak side table, morning light shift, 6s loop, whisper-quiet luxury
```

---

## 4. Pool Terrace

**File:** `/public/images/lifestyle/pool-terrace.jpg`

### Midjourney
```
Luxury villa infinity pool terrace at dusk, teak loungers, soft linen umbrellas, turquoise water beyond, golden hour warmth, Boracay private residence, editorial travel photography, empty, serene, no party --ar 3:2 --style raw
```

### Leonardo AI
```
Pool terrace luxury Boracay villa, dusk golden light, still water, teak and ivory, turquoise horizon, Six Senses aesthetic, photorealistic, no people, sanctuary calm
```

### Runway / Luma
```
Gentle pan across still pool surface at dusk, terrace reflections, warm gold to teal gradient sky, 8s seamless loop
```

---

## 5. Ocean Aerial

**File:** `/public/images/ocean/ocean-aerial.jpg`

### Midjourney
```
Aerial photograph Boracay white sand and turquoise shallows, abstract peaceful patterns, no boats, no crowds, sanctuary altitude, editorial luxury travel, warm golden light on water, spiritual calm --ar 21:9 --style raw
```

### Leonardo AI
```
Drone aerial white sand beach turquoise water Boracay, pristine, empty, luxury travel editorial, soft golden hour, high detail, no resorts visible, pure nature geometry
```

### Runway / Luma
```
Very slow aerial drift over empty turquoise shallows and white sand, Boracay, cinematic grade, no crowds, 10s loop
```

---

## 6. Guest Lifestyle

**File:** `/public/images/lifestyle/guest-lifestyle.jpg`

### Midjourney
```
Luxury villa exterior with pool and open pavilion, guest lifestyle implied through setting only, white sand path, tropical plants, golden hour, Boracay sanctuary villa, editorial photography, no crowds --ar 4:5
```

### Leonardo AI
```
Boracay luxury villa lifestyle scene, pool and open architecture, warm ivory stone, turquoise glimpses, linen and teak, golden hour, photorealistic editorial, peaceful, no stock tourists
```

### Runway / Luma
```
Slow track along villa facade to pool, golden hour, gentle palm shadow movement, sanctuary guest experience mood, 8s
```

---

## 7. Sunset CTA

**File:** `/public/images/sunset/sunset-cta.jpg`

### Midjourney
```
Warm sunset interior vignette, villa salon with candles and linen, golden light through open doors to ocean, intimate consultation mood, Boracay luxury stewardship, editorial --ar 3:4 --style raw
```

### Leonardo AI
```
Sunset luxury interior for private inquiry, warm ivory room, teak, soft glow, ocean glimpse through terrace doors, Aman aesthetic, photorealistic, inviting calm
```

### Runway / Luma
```
Interior hold with subtle light fade as sun sets, warm flares, 6s loop for CTA panel background
```

---

## 8. Ownership Stewardship

**File:** `/public/images/lifestyle/ownership-stewardship.jpg`

### Midjourney
```
Elegant villa study terrace overlooking calm ocean, owner's sanctuary, documents and tea implied but minimal, teak desk, ivory walls, stewardship and peace, Boracay luxury property management mood, editorial --ar 16:10
```

### Leonardo AI
```
Luxury property stewardship scene, villa owner perspective terrace, calm ocean, ivory and teak, golden hour, trust and discretion, photorealistic editorial, no corporate office
```

### Runway / Luma
```
Static wide shot, subtle cloud movement over calm sea from owner terrace, 8s, refined and reassuring
```

---

## Production checklist

| Asset | Path |
|--------|------|
| Hero image | `/public/images/hero/araya-hero.jpg` |
| Hero video | `/public/videos/araya-hero.mp4` |
| Interior sanctuary | `/public/images/interiors/residence-care.jpg` |
| Pool terrace | `/public/images/lifestyle/pool-terrace.jpg` |
| Ocean aerial | `/public/images/ocean/ocean-aerial.jpg` |
| Guest lifestyle | `/public/images/lifestyle/guest-lifestyle.jpg` |
| Sunset CTA | `/public/images/sunset/sunset-cta.jpg` |
| Ownership stewardship | `/public/images/lifestyle/ownership-stewardship.jpg` |
| Signature moment | `/public/images/sunset/signature-moment.jpg` |
| Terrace evening | `/public/images/sunset/terrace-evening.jpg` |
| Hospitality operations | `/public/images/lifestyle/hospitality-operations.jpg` |

After export, run `npm run dev` and hard-refresh — components probe local files automatically.
