---
name: Deep Aero-Acoustic Intelligence
colors:
  surface: '#061426'
  surface-dim: '#061426'
  surface-bright: '#2d3a4e'
  surface-container-lowest: '#020e21'
  surface-container-low: '#0e1c2f'
  surface-container: '#132033'
  surface-container-high: '#1d2a3e'
  surface-container-highest: '#28354a'
  on-surface: '#d6e3fe'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#d6e3fe'
  inverse-on-surface: '#243145'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#aec6ff'
  on-secondary: '#002e6b'
  secondary-container: '#508eff'
  on-secondary-container: '#00275e'
  tertiary: '#faf3ff'
  on-tertiary: '#3c0091'
  tertiary-container: '#e1d2ff'
  on-tertiary-container: '#6d3bd7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#aec6ff'
  on-secondary-fixed: '#001a43'
  on-secondary-fixed-variant: '#004397'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#061426'
  on-background: '#d6e3fe'
  surface-variant: '#28354a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system embodies high-precision aerospace instrumentation, structural health monitoring (SHM), and cutting-edge non-destructive evaluation (NDE). The aesthetic fuses modern aerospace telemetry with an advanced research laboratory console: authoritative, mathematically rigorous, and hyper-focused.

The emotional signature is one of quiet operational mastery—transforming complex, noisy ultrasonic guided wave dispersion matrices and A-scan/B-scan signals into immediate diagnostic clarity. 

The design combines elements of **Futuristic Industrial Technology** and **Precision Glassmorphism**:
- Ultra-dark, layered tactical surfaces minimize ocular fatigue during prolonged laboratory and field inspections.
- Subtle inner glows and crisp 1px specular micro-borders emulate high-end avionics displays and carbon-composite inspection heads.
- Monospaced telemetry clusters ground real-time frequency, phase velocity, and attenuation metrics with absolute clarity.

## Colors
The color architecture relies on a specialized dark laboratory palette engineered for maximum signal-to-noise ratio:

- **Canvas & Structural Baselines**: Base backdrop at `#06111F` (Abyssal Navy), layered with primary working planes at `#0B192C` (Deep Slate) and elevated analytical containers at `#0F2238` (Active Slate).
- **Core Signal Accents**: 
  - Primary `#00F0FF` (Electric Cyan) denotes primary laser/ultrasonic pulses, interactive active states, and dispersion curve trajectories.
  - Secondary `#0070F3` (Scientific Cobalt) anchors structural structural grids, transducer baselines, and secondary sensor channels.
- **Diagnostic & Defect Spectrum**:
  - **Healthy / Nominal Structural State**: `#10B981` (Emerald)
  - **Delamination Warning**: `#F59E0B` (Amber)
  - **Crack / Structural Discontinuity**: `#F43F5E` (Rose)
  - **High-Energy Impact Damage**: `#8B5CF6` (Aero Violet)
- **Text & Telemetry Contrast**: High-contrast readouts use pure white `#FFFFFF` for primary values, muted technical blue `#94A3B8` for secondary labels, and `#475569` for grid graduations and inactive channel indices.

## Typography
The typographic hierarchy leverages `Inter` for exceptional interface legibility, structural hierarchy, and system controls, paired intentionally with `JetBrains Mono` for all coordinate fields, wave propagation metrics, sensor IDs, time-of-flight (ToF) logs, and classified anomaly telemetry.

All numeric measurements, coordinates (X, Y, Z, theta), sampling frequencies (MHz), and confidence percentages must be rendered using `JetBrains Mono` with tabular lining figures enabled (`font-variant-numeric: tabular-nums`) to prevent layout jitter during real-time transducer stream playback.

## Layout & Spacing
This design system utilizes an engineered 12-column dynamic fluid grid configured for high-density instrument readouts:

- **Desktop (>= 1280px)**: 12-column grid, `gutter-desktop` (1.5rem / 24px), `margin-desktop` (2rem / 32px). Maximizes simultaneous visualization of the carbon-composite plate mesh, dispersion curves, A/B-scan waterfall plots, and anomaly classification panels.
- **Tablet (768px - 1279px)**: 8-column layout, `gutter` (1rem / 16px), `margin` (1.5rem / 24px). Telemetry panels collapse beneath plate mesh heatmaps with tabbed wave spectra.
- **Mobile (< 768px)**: 4-column layout, `gutter` (1rem / 16px), `margin` (1rem / 16px). Single-stream linear layout prioritizing structural defect alarms, summary health index, and critical sensor toggles.

Spatial distribution utilizes an 8px base rhythmic grid. Internal panel padding is strictly compact to preserve critical screen real estate for dense waveform renders.

## Elevation & Depth
Depth is constructed through optical transparency, chromatic filtration, and delicate luminance borders rather than standard heavy drop shadows:

- **Base Plane (Level 0)**: `#06111F` flat matte background.
- **Surface Level 1 (Panels & Viewports)**: `#0B192C` with `80%` opacity and `backdrop-filter: blur(16px)`. Border is a crisp `1px solid rgba(0, 240, 255, 0.12)`.
- **Surface Level 2 (Selected Cards & Active Wave Monitors)**: `#0F2238` with `90%` opacity, `backdrop-filter: blur(24px)`. Border is `1px solid rgba(0, 240, 255, 0.35)` with an ambient outer glow of `0 0 16px -4px rgba(0, 240, 255, 0.20)`.
- **Surface Level 3 (Diagnostic Overlays & Flyout Tooltips)**: `#091424` at `95%` opacity, bordered with `1px solid rgba(255, 255, 255, 0.18)` and an axial depth shadow of `0 12px 32px -8px rgba(2, 6, 12, 0.75)`.
- **Defect Alert Elevation**: Anomaly callouts (e.g., Delamination at coordinate `X: 420mm, Y: 118mm`) emit localized radial glows matching their designated status hex code at `15%` opacity.

## Shapes
To preserve an authentic, mission-critical instrumentation demeanor, shapes remain disciplined, crisp, and predominantly angular (`roundedness: 1`):

- **Standard Containers, Panels, and Waveform Canvas**: `0.25rem` (4px) corner radius.
- **Data Badges, Metric Blocks, and Modal Windows**: `0.5rem` (8px) corner radius (`rounded-lg`).
- **Interactive Control Switches, Chips, and Transducer Nodes**: `0.75rem` (12px) corner radius (`rounded-xl`).
- **Signal Status Pips & Transducer Matrix Pins**: Strict circular geometry (`rounded-full`).

Bevel cuts (45-degree chamfers) are reserved exclusively for panel headers and diagnostic mode indicators to mirror aerospace structural fixtures.

## Components

### Buttons & Trigger Controls
- **Primary Action (Scan Acquisition / Run Inference)**: Filled with linear gradient (`#00F0FF` to `#0070F3`), text in `#06111F` (bold weight), with a persistent soft cyan bloom (`box-shadow: 0 0 12px rgba(0, 240, 255, 0.3)`). Hover triggers increased border luminosity and 1.02x scale.
- **Secondary (Calibrate / Export HDF5)**: Transparent surface with `1px solid rgba(0, 240, 255, 0.4)`, text in `#00F0FF`. Hover shifts background to `rgba(0, 240, 255, 0.08)`.
- **Destructive / Abort**: Transparent surface with `1px solid #F43F5E`, text in `#F43F5E`.

### Diagnostic Chips & Defect Badges
- Constructed with `label-sm` monospaced font, uppercase tracking.
- Composed of an ultra-thin border (`1px`) tinted with the status color, a tinted background at `10%` opacity, and a leading pulsing LED indicator (`6px x 6px`).
- States:
  - Nominal: Border `#10B981`, Background `rgba(16, 185, 129, 0.12)`, Text `#10B981`
  - Delamination: Border `#F59E0B`, Background `rgba(245, 158, 11, 0.12)`, Text `#F59E0B`
  - Crack: Border `#F43F5E`, Background `rgba(244, 63, 94, 0.12)`, Text `#F43F5E`
  - Impact Damage: Border `#8B5CF6`, Background `rgba(139, 92, 246, 0.12)`, Text `#8B5CF6`

### Scientific Waveform Viewports & Inspection Cards
- Enclosed inside Level 1 or Level 2 glassmorphic containers.
- Header bars feature technical metadata: Sampling Rate (e.g., `FS: 10.0 MHz`), Actuator Frequency (e.g., `fc: 250 kHz`), and Transducer Pair indexing (`TX: 04 -> RX: 12`).
- Coordinate axes must render in low-contrast `#475569` with `label-sm` tick labels.

### Input Fields & Parameter Steppers
- Dark slate fill (`#081526`), inset border `1px solid rgba(148, 163, 184, 0.2)`.
- Active focus state immediately transitions border to `#00F0FF` with a cyan outer halo (`0 0 0 2px rgba(0, 240, 255, 0.2)`).
- Metric units (e.g., `m/s`, `dB`, `kHz`, `μs`) are permanently anchored on the right edge in `JetBrains Mono` at `#94A3B8`.

### Specialized UI Elements
- **Transducer Grid Matrix**: Interactive 2D planar map of the carbon composite plate depicting piezoelectric sensor arrays. Intact sensors appear in `#0070F3`, active emitters pulse in `#00F0FF`, and flagged structural anomalies illuminate the affected coordinate sectors with animated boundary highlights.
- **Wave Propagation Oscilloscope Slider**: Scrubber bar featuring micro-division notches, current propagation timestamp in microseconds (`μs`), and play/pause/step-frame actuation controls.