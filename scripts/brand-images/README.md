# Brand images

Sources for `assets/og-image.png` (1200×630) and `assets/apple-touch-icon.png` (180×180).

QuickLook renders SVGs onto a square canvas, so render a square copy and crop:

```bash
sed 's/width="1200" height="630" viewBox="0 0 1200 630"/width="1200" height="1200" viewBox="0 -285 1200 1200"/' og-image.svg > /tmp/og-square.svg
qlmanage -t -s 1200 -o /tmp /tmp/og-square.svg
sips -c 630 1200 /tmp/og-square.svg.png --out ../../assets/og-image.png

sed 's/width="180" height="180" viewBox="0 0 180 180"/width="1200" height="1200" viewBox="0 0 180 180"/' apple-touch-icon.svg > /tmp/icon-big.svg
qlmanage -t -s 1200 -o /tmp /tmp/icon-big.svg
sips -Z 180 /tmp/icon-big.svg.png --out ../../assets/apple-touch-icon.png
```
