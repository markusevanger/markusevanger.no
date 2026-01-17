# Lighthouse Audit Skill

Run Lighthouse performance audits on the production build.

## Prerequisites

- Lighthouse CLI: `pnpm add -g lighthouse` (if not installed)
- Google Chrome installed

### Chrome Path by Environment

| Environment | Chrome Path |
|-------------|-------------|
| WSL (Windows Subsystem for Linux) | `/usr/bin/google-chrome` |
| Linux | `/usr/bin/google-chrome` or `/usr/bin/chromium-browser` |
| macOS | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| Windows | `C:\Program Files\Google\Chrome\Application\chrome.exe` |

Set the path before running Lighthouse:
```bash
export CHROME_PATH=/usr/bin/google-chrome  # WSL/Linux
```

## Workflow

1. **Build and start production server**
   ```bash
   pnpm build && pnpm start &
   ```

2. **Wait for server to be ready** (typically port 3000)

3. **Run Lighthouse audit**
   ```bash
   CHROME_PATH=/usr/bin/google-chrome lighthouse http://localhost:3000 \
     --output=json --output=html \
     --output-path=/tmp/lighthouse-report \
     --chrome-flags="--headless --no-sandbox --disable-gpu"
   ```

4. **Parse results** from `/tmp/lighthouse-report.report.json`

5. **Stop the production server** when done

6. **Clean up** - Remove lighthouse temp files:
   ```bash
   rm -rf /tmp/lighthouse-report.*
   ```

### WSL-Specific Cleanup

Lighthouse on WSL creates temp directories with Windows-style paths in the current directory:
```bash
rm -rf "C:\Users\*\AppData\Local\lighthouse."* 2>/dev/null
```

These appear as untracked files in git - always clean them up after running audits.

## Key Metrics to Report

| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 95+ |
| LCP (Largest Contentful Paint) | <2.5s |
| TBT (Total Blocking Time) | <200ms |
| CLS (Cumulative Layout Shift) | <0.1 |

## Common Issues & Fixes

### LCP Issues
- Remove animation wrappers (AppearInView, etc.) from LCP elements
- Add `priority` and `fetchPriority="high"` to hero images
- Add `sizes` attribute to responsive images
- Preload LCP image in page head

### Unused JavaScript
- Check for duplicate packages (e.g., `motion` vs `framer-motion`)
- Convert animations to CSS where possible
- Dynamic import heavy components

### Accessibility (Contrast)
- Minimum opacity for text: `opacity-70` or higher
- Background overlays: `bg-white/30` minimum on dark backgrounds
- Use WCAG AA contrast ratio (4.5:1 for normal text)

## Notes

- Always run on production build, not dev server
- Dev mode has slower performance and different bundle sizes
- Lighthouse temp directories may appear in worktree on Windows/WSL - clean them up
